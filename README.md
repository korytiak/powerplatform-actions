# Power Platform Actions

**PRE-RELEASE SOFTWARE.** The software is a pre-release version. It may not work the way a final version of the software will.
We may change it for the final, commercial version. We also may not release a commercial version.

This repo provides multiple [GitHub Actions](https://help.github.com/en/actions) for the Power Platform.
Each action wraps the existing [Power Apps CLI](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/powerapps-cli). Detailed documentation on GitHub actions for Power Platform is available [here](https://aka.ms/poweractionsdocs).

Sample workflows and detailed instructions are available in our [GitHub actions lab repo](https://github.com/microsoft/powerplatform-actions-lab) but if you are already familiar with GitHub actions and Power Platform solutions, simply add below to your existing workflows; also add the secret `MYPASSWORD` to your repo's 'Settings' | 'Secrets'

```yaml
jobs:
  build:

    runs-on: windows-latest   # For now, only Windows runners are supported.

    steps:
    - name: Export Solution
      uses: microsoft/powerplatform-actions/export-solution@v0
      with:
        environment-url: 'https://myenv.crm.dynamics.com'
        user-name: 'me@myenv.onmicrosoft.com'
        password-secret: ${{ secrets.MYPASSWORD }}
        solution-name: aSolution
        solution-output-file: 'aSolution.zip'
        working-directory: 'out'

    - name: Unpack Solution
      uses: microsoft/powerplatform-actions/unpack-solution@v0
      with:
        solution-file: 'out/aSolution1.zip'
        solution-folder: 'out/solutions/solution one'
        solution-type: 'Unmanaged'
        overwrite-files: true

    - name: Publish Solution
      uses: microsoft/powerplatform-actions/publish-solution@v0
      with:
        environment-url: 'https://myenv.crm.dynamics.com'
        user-name: 'me@myenv.onmicrosoft.com'
        password-secret: ${{ secrets.MYPASSWORD }}

    - name: Prepare solution changes for checkin into source control
      uses: microsoft/powerplatform-actions/branch-solution@v0
      with:
        solution-folder: 'out/solutions/solution one'
        solution-target-folder: 'src/solutions/solution1'
        token: ${{ secrets.GITHUB_TOKEN }}
```

[![CI](https://github.com/microsoft/powerplatform-actions/workflows/CI/badge.svg)](https://github.com/microsoft/powerplatform-actions/actions?query=workflow%3ACI)

## Contributing

**PRE-RELEASE SOFTWARE.**
This project will welcome contributions and suggestions in the near future. But in this early preview stage, we're not ready for contributions.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Setting Up Dev Environment

Windows, macOS or Linux:

- [Node.js LTS (currently v12)](https://nodejs.org/en/download/)
- gulp CLI: ```npm install -g gulp-cli```
- [git](https://git-scm.com/downloads)
- [VS Code](https://code.visualstudio.com/Download) or your different favorite editor
- recommended VSCode extensions:
  - [EditorConfig for VS Code (editorconfig.editorconfig)](https://github.com/editorconfig/editorconfig-vscode)
  - [ESLint (dbaeumer.vscode-eslint)](https://github.com/Microsoft/vscode-eslint)
  - [GitLens (eamodio.gitlens)](https://github.com/eamodio/vscode-gitlens)
  - [markdownlint (davidanson.vscode-markdownlint)](https://github.com/DavidAnson/vscode-markdownlint)
  - [Mocha sidebar (maty.vscode-mocha-sidebar)](https://github.com/maty21/mocha-sidebar)
- TEMPORARY:
  - Create a PAT for the Azure DevOps org ```msazure``` with scope: package(read) and add it as local environment variable.
  ```Powershell
  [Environment]::SetEnvironmentVariable('AZ_DevOps_Read_PAT', '<yourPAT>', [EnvironmentVariableTarget]::User)
  ```
  - Create a PAT in GitHub to read packages, and enable SSO for the microsoft organization. Then add it to your *~/.npmrc* file or use the `npm login` command as documented [here](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token). This will only be needed until the `@microsoft/powerplatform-cli-wrapper` repo is made public.

If developing on Linux or macOS, you will also need to install `git-lfs`.  (It is prepackaged with the Git installer for Windows.)  Follow the [instructions here](https://docs.github.com/en/github/managing-large-files/installing-git-large-file-storage) for your environment.

## Getting Started

Clone, restore modules, build and run:

```bash
git clone https://github.com/microsoft/powerplatform-actions.git
cd powerplatform-actions
npm install
gulp
```

## Refreshing actions in dist folder

Run ```npm run dist``` and commit and push the updates in the ```./dist``` folder.

If you have updated the Linux PAC package version (especially from a Windows host), double check that the `pac` executable has the execute flag set.  Run
```bash
git ls-tree HEAD dist/pac_linux/tools/pac
```
and check that the leftmost value should be `100755`.  Example output:
```bash
100755 blob 00034fe2fe80faca43030481877760674409d739    dist/pac_linux/tools/pac
```
If the file mode does not match, run
```bash
git update-index --chmod=+x dist/pac_linux/tools/pac
```
prior to commiting the changes.
## Details

[CLI command for pac](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/powerapps-cli#solution)

## References

### ADAL/MSAL

### CustomerEngagement API

- [WebAPI](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/overview)
- [WebAPI REST API](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/about?view=dynamics-ce-odata-9)
- [OrgService](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/org-service/overview)
- [Org url discovery](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/discover-url-organization-web-api)

### Power Platform Environment Admin (BAP)

- [Environments Overview](https://docs.microsoft.com/en-us/power-platform/admin/environments-overview)
