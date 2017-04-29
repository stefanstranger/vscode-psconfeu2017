// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// Example: https://riteshpatel.silvrback.com/content-provider-tutorial-for-vscode

var vscode = require('vscode');
var request, options;
request = require('request');
var json2html = require('node-json2html');


function loadAgenda(uri) {
    options = {
        url: uri,
        value: 'application/json'
    };
    //Start the request
    request(options, agendaLoaded);
}


function agendaLoaded(error, response, body) {
    var transform = {
        "<>": "ul", "style": "font-family: Verdana, Arial, Helvetica, sans-serif", "html": [
            { "<>": "li", "style": "background:green", "html": "Title: ${Title}" },
            { "<>": "li", "style": "font:arial", "html": "SpeakerList: ${SpeakerList}" },
            { "<>": "li", "html": "Room: ${Room}" },
            { "<>": "li", "html": "StartTime: ${StartTime}" },
            { "<>": "li", "html": "EndTime: ${EndTime}" },
            { "<>": "li", "html": "Audience: ${Audience}" },
            { "<>": "li", "html": "TracksList: ${TracksList}" },
            { "<>": "li", "html": "Description: ${Description}" },
        ]
    }
    jsonData = eval(body);
    const docProvider = {
        provideTextDocumentContent: () => json2html.transform(jsonData, transform)
    };

    vscode.workspace.registerTextDocumentContentProvider('psconfeu', docProvider);
    vscode.commands.executeCommand("vscode.previewHtml",
        vscode.Uri.parse('psconfeu://agenda'), vscode.ViewColumn.One)
        .then(() => 1, error => console.log(error));
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-psconfeu2017" is now active!');

    var psconfeuagenda = vscode.commands.registerCommand('extension.getPSConfEUAgenda', loadAgenda('http://www.psconf.eu/AllSessions.json'));
    context.subscriptions.push(psconfeuagenda);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;