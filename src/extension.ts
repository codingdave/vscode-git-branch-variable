// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { env } from "process";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  //   console.log('Congratulations, your extension "git-branch-variable" is now active!');

  let ret = "uninitialized";
  const cmd = "git";
  const args = ["rev-parse", "--abbrev-ref", "HEAD"];

  // Find workspaceFolder corresponding to file
  let wsFolder = ".";
  // Temporary code to resolve bug:
  // vscode.workspace.getWorkspaceFolder(file) return null when file is opened from command line. 
  // Even if the right folder is already open in vscode (e.g. --reuse window)
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {
    wsFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  const options = {
    cwd: wsFolder,
  };
  const execFile = require("child_process").execFile;
  const child = execFile(
    cmd,
    args,
    options,
    (error: any, stdout: any, stderr: any) => {

      if (error) {
        console.error("stderr: ", stderr);
        throw error;
      }

      ret = stdout.replace(/\n/gm, "");
      // console.log("*** -> stdout: ", ret);
    }
  );

  const command = "git-branch-variable.gitbranch";
  const commandHandler = () => {
    // Display a message box to the user
    // const command = ${text}[0];
    // const path = ${text}[1];
    // vscode.window.showInformationMessage(`commandHandler');
    // console.log('***** -> ret: ', ret);
    return ret;
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(command, commandHandler);
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
