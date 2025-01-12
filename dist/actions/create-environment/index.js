module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __webpack_require__(351);
const file_command_1 = __webpack_require__(717);
const utils_1 = __webpack_require__(278);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(747));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 18:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.main = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __webpack_require__(186);
const lib_1 = __webpack_require__(806);
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.GITHUB_ACTIONS) {
        yield main(lib_1.DefaultRunnerFactory);
    }
}))();
function main(factory) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.startGroup('create-environment:');
            const pac = factory.getRunner('pac', process.cwd());
            const envName = core.getInput('name', { required: true });
            const envType = core.getInput('type', { required: true });
            const envRegion = core.getInput('region', { required: false });
            const domain = core.getInput('domain', { required: false });
            yield new lib_1.AuthHandler(pac).authenticate(lib_1.AuthKind.ADMIN);
            const createEnvironmentArgs = ['admin', 'create', '--name', envName, '--region', envRegion, '--type', envType, '--domain', domain];
            const result = yield pac.run(createEnvironmentArgs);
            // HACK TODO: Need structured output from pac CLI to make parsing out of the resulting env URL more robust
            const envUrl = (_a = result
                .filter(l => l.length > 0)
                .pop()) === null || _a === void 0 ? void 0 : _a.trim().split(/\s+/).shift();
            core.setOutput('environment-url', envUrl);
            core.endGroup();
        }
        catch (error) {
            core.setFailed(`failed: ${error.message}`);
            throw error;
        }
    });
}
exports.main = main;

//# sourceMappingURL=index.js.map


/***/ }),

/***/ 434:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWorkingDirectory = exports.getInputAsBool = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __webpack_require__(186);
function getInputAsBool(name, required, defaultValue) {
    const textValue = core.getInput(name, { required: required });
    return (!textValue) ? defaultValue : textValue.toLowerCase() === 'true';
}
exports.getInputAsBool = getInputAsBool;
function getWorkingDirectory(name, required, defaultValue) {
    const textValue = core.getInput(name, { required: required });
    return (!textValue) ? (defaultValue !== null && defaultValue !== void 0 ? defaultValue : process.cwd()) : textValue;
}
exports.getWorkingDirectory = getWorkingDirectory;

//# sourceMappingURL=actionInput.js.map


/***/ }),

/***/ 970:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionLogger = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __webpack_require__(186);
class ActionLogger {
    info(...args) {
        core.info(args.join());
    }
    warn(...args) {
        core.warning(args.join());
    }
    error(...args) {
        const errorMessage = args.join();
        core.setFailed(errorMessage);
        core.error(errorMessage);
    }
    debug(...args) {
        core.debug(args.join());
    }
    log(...args) {
        console.log(args.join());
    }
}
exports.ActionLogger = ActionLogger;

//# sourceMappingURL=actionLogger.js.map


/***/ }),

/***/ 677:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthKind = exports.AuthHandler = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __webpack_require__(186);
const createLegacyRunnerPacAuthenticator_1 = __webpack_require__(687);
class AuthHandler {
    constructor(pac) {
        if ("run" in pac) {
            this._pacAuthenticator = createLegacyRunnerPacAuthenticator_1.default(pac);
        }
        else {
            this._pacAuthenticator = pac;
        }
    }
    authenticate(authKind) {
        return __awaiter(this, void 0, void 0, function* () {
            core.startGroup("authentication");
            this._envUrl = core.getInput("environment-url", { required: false });
            const authType = this.determineAuthType();
            if (authType === AuthTypes.USERNAME_PASSWORD) {
                yield this.authenticateWithUsernamePassword(authKind);
            }
            else if (authType == AuthTypes.APPID_SECRET) {
                yield this.authenticateWithClientCredentials(authKind);
            }
            else {
                throw new Error("Must provide either username/password or app-id/client-secret/tenant-id for authentication!");
            }
            core.endGroup();
        });
    }
    determineAuthType() {
        const validUsernameAuth = this.isValidUsernameAuth();
        const validSPNAuth = this.isValidSPNAuth();
        try {
            if (validUsernameAuth && validSPNAuth) {
                throw new Error("Too many authentication parameters specified. Must pick either username/password or app-id/client-secret/tenant-id for the authentication flow.");
            }
            if (validUsernameAuth) {
                return AuthTypes.USERNAME_PASSWORD;
            }
            else if (validSPNAuth) {
                return AuthTypes.APPID_SECRET;
            }
        }
        catch (error) {
            core.setFailed(`failed: ${error.message}`);
            throw error;
        }
        return AuthTypes.INVALID_AUTH_TYPE;
    }
    isValidUsernameAuth() {
        this._username = core.getInput("user-name", { required: false });
        this._password = core.getInput("password-secret", { required: false });
        return !!this._username && !!this._password;
    }
    isValidSPNAuth() {
        this._appId = core.getInput("app-id", { required: false });
        this._clientSecret = core.getInput("client-secret", {
            required: false,
        });
        this._tenantId = core.getInput("tenant-id", { required: false });
        return !!this._appId && !!this._clientSecret && !!this._tenantId;
    }
    authenticateWithClientCredentials(authKind) {
        return __awaiter(this, void 0, void 0, function* () {
            core.info(`SPN Authentication : Authenticating with appId: ${this._appId}`);
            if (authKind === AuthKind.CDS) {
                yield this._pacAuthenticator.authenticateCdsWithClientCredentials({
                    environmentUrl: this._envUrl,
                    tenantId: this._tenantId,
                    appId: this._appId,
                    clientSecret: this._clientSecret,
                });
            }
            else {
                yield this._pacAuthenticator.authenticateAdminWithClientCredentials({
                    tenantId: this._tenantId,
                    appId: this._appId,
                    clientSecret: this._clientSecret,
                });
            }
        });
    }
    authenticateWithUsernamePassword(authKind) {
        return __awaiter(this, void 0, void 0, function* () {
            core.info(`Username/password Authentication : Authenticating with user: ${this._username}`);
            if (authKind == AuthKind.CDS) {
                yield this._pacAuthenticator.authenticateCdsWithUsernamePassword({
                    environmentUrl: this._envUrl,
                    username: this._username,
                    password: this._password,
                });
            }
            else {
                yield this._pacAuthenticator.authenticateAdminWithUsernamePassword({
                    username: this._username,
                    password: this._password,
                });
            }
        });
    }
}
exports.AuthHandler = AuthHandler;
var AuthTypes;
(function (AuthTypes) {
    AuthTypes[AuthTypes["USERNAME_PASSWORD"] = 0] = "USERNAME_PASSWORD";
    AuthTypes[AuthTypes["APPID_SECRET"] = 1] = "APPID_SECRET";
    AuthTypes[AuthTypes["INVALID_AUTH_TYPE"] = 2] = "INVALID_AUTH_TYPE";
})(AuthTypes || (AuthTypes = {}));
var AuthKind;
(function (AuthKind) {
    AuthKind[AuthKind["CDS"] = 0] = "CDS";
    AuthKind[AuthKind["ADMIN"] = 1] = "ADMIN";
})(AuthKind = exports.AuthKind || (exports.AuthKind = {}));

//# sourceMappingURL=authHandler.js.map


/***/ }),

/***/ 687:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
function createLegacyRunnerPacAuthenticator(pac) {
    return {
        authenticateCdsWithClientCredentials: (parameters) => __awaiter(this, void 0, void 0, function* () {
            yield clearAuth();
            yield pac.run([
                "auth",
                "create",
                "--url",
                parameters.environmentUrl,
                "--applicationId",
                parameters.appId,
                "--clientSecret",
                parameters.clientSecret,
                "--tenant",
                parameters.tenantId,
            ]);
        }),
        authenticateAdminWithClientCredentials: (parameters) => __awaiter(this, void 0, void 0, function* () {
            yield clearAuth();
            yield pac.run([
                "auth",
                "create",
                "--kind",
                "ADMIN",
                "--applicationId",
                parameters.appId,
                "--clientSecret",
                parameters.clientSecret,
                "--tenant",
                parameters.tenantId,
            ]);
        }),
        authenticateCdsWithUsernamePassword: (parameters) => __awaiter(this, void 0, void 0, function* () {
            yield clearAuth();
            yield pac.run([
                "auth",
                "create",
                "--url",
                parameters.environmentUrl,
                "--username",
                parameters.username,
                "--password",
                parameters.password,
            ]);
        }),
        authenticateAdminWithUsernamePassword: (parameters) => __awaiter(this, void 0, void 0, function* () {
            yield clearAuth();
            yield pac.run([
                "auth",
                "create",
                "--kind",
                "ADMIN",
                "--username",
                parameters.username,
                "--password",
                parameters.password,
            ]);
        }),
    };
    function clearAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            yield pac.run(["auth", "clear"]);
        });
    }
}
exports.default = createLegacyRunnerPacAuthenticator;

//# sourceMappingURL=createLegacyRunnerPacAuthenticator.js.map


/***/ }),

/***/ 21:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RunnerError = exports.ExeRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const child_process_1 = __webpack_require__(129);
const os = __webpack_require__(87);
const getExePath_1 = __webpack_require__(309);
class ExeRunner {
    constructor(_workingDir, logger, exeName, exeRelativePath) {
        this._workingDir = _workingDir;
        this.logger = logger;
        if (exeRelativePath) {
            this._exePath = getExePath_1.default(...exeRelativePath, exeName);
        }
        else {
            this._exePath = exeName;
        }
    }
    get workingDir() {
        return this._workingDir;
    }
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const stdout = new Array();
                const stderr = new Array();
                this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0] : '<none>'}`);
                const process = child_process_1.spawn(this._exePath, args, { cwd: this.workingDir });
                process.stdout.on('data', (data) => stdout.push(...data.toString().split(os.EOL)));
                process.stderr.on('data', (data) => stderr.push(...data.toString().split(os.EOL)));
                process.on('exit', (code) => {
                    if (code === 0) {
                        this.logger.info(`success: ${stdout.join(os.EOL)}`);
                        resolve(stdout);
                    }
                    else {
                        const allOutput = stderr.concat(stdout);
                        this.logger.error(`error: ${code}: ${allOutput.join(os.EOL)}`);
                        reject(new RunnerError(code !== null && code !== void 0 ? code : 99999, allOutput.join()));
                    }
                    // Close out handles to the output streams so that we don't wait on grandchild processes like pacTelemetryUpload
                    process.stdout.destroy();
                    process.stderr.destroy();
                });
            });
        });
    }
    runSync(args) {
        var _a;
        this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0] : '<none>'}`);
        const proc = child_process_1.spawnSync(this._exePath, args, { cwd: this.workingDir });
        if (proc.status === 0) {
            const output = proc.output
                .filter(line => !!line) // can have null entries
                .map(line => line.toString());
            this.logger.info(`success: ${output.join(os.EOL)}`);
            return output;
        }
        else {
            const allOutput = proc.stderr.toString().concat(proc.stdout.toString());
            this.logger.error(`error: ${proc.status}: ${allOutput}`);
            throw new RunnerError((_a = proc.status) !== null && _a !== void 0 ? _a : 99999, allOutput);
        }
    }
}
exports.ExeRunner = ExeRunner;
class RunnerError extends Error {
    constructor(exitCode, message) {
        super(message);
        this.exitCode = exitCode;
    }
}
exports.RunnerError = RunnerError;

//# sourceMappingURL=exeRunner.js.map


/***/ }),

/***/ 309:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const path_1 = __webpack_require__(622);
function getExePath(...relativePath) {
    // in mocha, __dirname resolves to the src folder of the .ts file,
    // but when running the .js file directly, e.g. from the /dist folder, it will be from that folder
    const currentDirectory = path_1.resolve(__dirname);
    const parentDir = path_1.dirname(currentDirectory);
    // /dist/actions/<action-name>/index.js:
    // /out/actions/<action-name>/index.js:
    let outDirRoot;
    switch (path_1.basename(parentDir)) {
        case "actions":
            outDirRoot = path_1.resolve(path_1.dirname(parentDir));
            break;
        case "src":
        case "out":
            outDirRoot = path_1.resolve(parentDir, "..", "out");
            break;
        default:
            throw Error(`ExeRunner: cannot resolve outDirRoot running from this location: ${path_1.dirname}`);
    }
    return path_1.resolve(outDirRoot, ...relativePath);
}
exports.default = getExePath;

//# sourceMappingURL=getExePath.js.map


/***/ }),

/***/ 973:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const exeRunner_1 = __webpack_require__(21);
class GitRunner extends exeRunner_1.ExeRunner {
    constructor(workingDir, logger) {
        super(workingDir, logger, 'git');
    }
}
exports.GitRunner = GitRunner;

//# sourceMappingURL=gitRunner.js.map


/***/ }),

/***/ 806:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthKind = exports.AuthHandler = exports.SopaRunner = exports.PacRunner = exports.GitRunner = exports.ActionLogger = exports.DefaultRunnerFactory = exports.RunnerError = exports.getWorkingDirectory = exports.getInputAsBool = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var actionInput_1 = __webpack_require__(434);
Object.defineProperty(exports, "getInputAsBool", ({ enumerable: true, get: function () { return actionInput_1.getInputAsBool; } }));
Object.defineProperty(exports, "getWorkingDirectory", ({ enumerable: true, get: function () { return actionInput_1.getWorkingDirectory; } }));
var exeRunner_1 = __webpack_require__(21);
Object.defineProperty(exports, "RunnerError", ({ enumerable: true, get: function () { return exeRunner_1.RunnerError; } }));
var runnerFactory_1 = __webpack_require__(147);
Object.defineProperty(exports, "DefaultRunnerFactory", ({ enumerable: true, get: function () { return runnerFactory_1.DefaultRunnerFactory; } }));
// TODO: delete exports once all actions are converted:
var actionLogger_1 = __webpack_require__(970);
Object.defineProperty(exports, "ActionLogger", ({ enumerable: true, get: function () { return actionLogger_1.ActionLogger; } }));
var gitRunner_1 = __webpack_require__(973);
Object.defineProperty(exports, "GitRunner", ({ enumerable: true, get: function () { return gitRunner_1.GitRunner; } }));
var pacRunner_1 = __webpack_require__(366);
Object.defineProperty(exports, "PacRunner", ({ enumerable: true, get: function () { return pacRunner_1.PacRunner; } }));
var sopaRunner_1 = __webpack_require__(653);
Object.defineProperty(exports, "SopaRunner", ({ enumerable: true, get: function () { return sopaRunner_1.SopaRunner; } }));
var authHandler_1 = __webpack_require__(677);
Object.defineProperty(exports, "AuthHandler", ({ enumerable: true, get: function () { return authHandler_1.AuthHandler; } }));
Object.defineProperty(exports, "AuthKind", ({ enumerable: true, get: function () { return authHandler_1.AuthKind; } }));

//# sourceMappingURL=index.js.map


/***/ }),

/***/ 366:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PacRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const exeRunner_1 = __webpack_require__(21);
const os = __webpack_require__(87);
const platform = os.platform();
const programName = platform === "win32" ? 'pac.exe' : 'pac';
const programPath = platform === "win32" ? ['pac', 'tools'] : ['pac_linux', 'tools'];
class PacRunner extends exeRunner_1.ExeRunner {
    constructor(workingDir, logger) {
        super(workingDir, logger, programName, programPath);
    }
}
exports.PacRunner = PacRunner;

//# sourceMappingURL=pacRunner.js.map


/***/ }),

/***/ 147:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultRunnerFactory = void 0;
const actionLogger_1 = __webpack_require__(970);
const gitRunner_1 = __webpack_require__(973);
const pacRunner_1 = __webpack_require__(366);
const sopaRunner_1 = __webpack_require__(653);
class RealRunnerFactory {
    constructor() {
        this._logger = new actionLogger_1.ActionLogger();
    }
    getRunner(runnerName, workingDir) {
        switch (runnerName) {
            case 'pac':
                return new pacRunner_1.PacRunner(workingDir, this._logger);
            case 'git':
                return new gitRunner_1.GitRunner(workingDir, this._logger);
            case 'sopa':
                return new sopaRunner_1.SopaRunner(workingDir, this._logger);
            default:
                throw new Error(`Unknown runner type requested: ${runnerName}`);
        }
    }
}
exports.DefaultRunnerFactory = new RealRunnerFactory();

//# sourceMappingURL=runnerFactory.js.map


/***/ }),

/***/ 653:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SopaRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const exeRunner_1 = __webpack_require__(21);
const os = __webpack_require__(87);
class SopaRunner extends exeRunner_1.ExeRunner {
    constructor(workingDir, logger) {
        super(workingDir, logger, 'SolutionPackager.exe', ['sopa', 'content', 'bin', 'coretools']);
        const platform = os.platform();
        if (platform !== 'win32') {
            throw Error(`Unsupported SoPa runner os: '${platform}'; the standalone SoPa executable is only available on Windows`);
        }
    }
}
exports.SopaRunner = SopaRunner;

//# sourceMappingURL=sopaRunner.js.map


/***/ }),

/***/ 129:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 747:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 87:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 622:
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(18);
/******/ })()
;