// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { spawn, spawnSync } from "child_process";
import os = require('os');
import getExePath from "./getExePath";
import { Logger } from "./logger";

export class ExeRunner {
    private readonly _exePath: string;

    public constructor(private readonly _workingDir: string, private readonly logger: Logger, exeName: string, exeRelativePath?: string[]) {
        if (exeRelativePath) {
            this._exePath = getExePath(...exeRelativePath, exeName);
        } else {
            this._exePath = exeName;
        }
    }

    public get workingDir(): string {
        return this._workingDir;
    }

    public async run(args: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const stdout = new Array<string>();
            const stderr = new Array<string>();

            this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0]: '<none>'}`);
            const process = spawn(this._exePath, args, { cwd: this.workingDir });

            process.stdout.on('data', (data) => stdout.push(...data.toString().split(os.EOL)));
            process.stderr.on('data', (data) => stderr.push(...data.toString().split(os.EOL)));

            process.on('exit', (code) => {
                if (code === 0) {
                    this.logger.info(`success: ${stdout.join(os.EOL)}`);
                    resolve(stdout);
                } else {
                    const allOutput = stderr.concat(stdout);
                    this.logger.error(`error: ${code}: ${allOutput.join(os.EOL)}`);
                    reject(new RunnerError(code ?? 99999, allOutput.join()));
                }

                // Close out handles to the output streams so that we don't wait on grandchild processes like pacTelemetryUpload
                process.stdout.destroy();
                process.stderr.destroy();
            });
        });
    }

    public runSync(args: string[]): string[] {
        this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0]: '<none>'}`);
        const proc = spawnSync(this._exePath, args, { cwd: this.workingDir });
        if (proc.status === 0) {
            const output = proc.output
                .filter(line => !!line)     // can have null entries
                .map(line => line.toString());
            this.logger.info(`success: ${output.join(os.EOL)}`);
            return output;
        } else {
            const allOutput = proc.stderr.toString().concat(proc.stdout.toString());
            this.logger.error(`error: ${proc.status}: ${allOutput}`);
            throw new RunnerError(proc.status ?? 99999, allOutput);
        }
    }
}

export class RunnerError extends Error {

    public constructor(public exitCode: number, message: string) {
        super(message);
    }
}
