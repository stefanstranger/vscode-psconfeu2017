// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// Example: https://riteshpatel.silvrback.com/content-provider-tutorial-for-vscode

var vscode = require('vscode');
var request, options;
request = require('request');
var json2html = require('node-json2html');
const psconfeuuri = 'http://www.psconf.eu/AllSessions.json';

// Load PSConfEU Agenda from 'http://www.psconf.eu/AllSessions.json'
function loadAgenda(uri) {
    options = {
        url: uri,
        value: 'application/json'
    };
    //Start the request
    request(options, agendaLoaded);
}

// Format result from web request to html using node-json2html module
function agendaLoaded(error, response, body) {
    // json2html transform template
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
        vscode.Uri.parse('psconfeu:/psconfeu/agenda'), vscode.ViewColumn.One)
        .then(() => 1, error => console.log(error));
}

function loadfilteredAgenda(uri) {
    options = {
        url: uri,
        value: 'application/json'
    };
    //Start the request
    request(options, filterAgendaLoaded);
}

function filterAgendaLoaded(error, response, body) {
    // json2html transform template
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
    vscode.window.showInputBox({ prompt: "Please enter [search string]" }).then(
        function (filter) {
            vscode.window.showInformationMessage('Search String used: ' + filter)
            jsonData = eval(body);
            //Empty array
            newArray = [];
            jsonData.filter(function (el) {
                if (el.SpeakerList.match(new RegExp(filter, "i"))) { newArray.push(el) }
                else if (el.Room.match(/filter/i)) { newArray.push(el) }
                else if (el.StartTime.match(new RegExp(filter, "i"))) { newArray.push(el) }
                else if (el.EndTime.match(new RegExp(filter, "i"))) { newArray.push(el) }
                else if (el.Audience.match(new RegExp(filter, "i"))) { newArray.push(el) }
                else if (el.TracksList.match(new RegExp(filter, "i"))) { newArray.push(el) }
                else if (el.Description.match(new RegExp(filter, "i"))) { newArray.push(el) };
            });
            const docProvider = {
                provideTextDocumentContent: () => json2html.transform(newArray, transform)
            };

            vscode.workspace.registerTextDocumentContentProvider('psconfeu', docProvider);
            vscode.commands.executeCommand("vscode.previewHtml",
                vscode.Uri.parse('psconfeu:/psconfeu/agenda'), vscode.ViewColumn.One)
                .then(() => 1, error => console.log(error));
        })
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-psconfeu2017" is now active!');
    // Retrieve total Agenda info
    var psconfeuagenda = vscode.commands.registerCommand('extension.getPSConfEUAgenda', () => loadAgenda(psconfeuuri));
    context.subscriptions.push(psconfeuagenda);
    // Filter Agenda
    var filterpsconfeuagenda = vscode.commands.registerCommand('extension.filterPSConfEUAgenda', () => loadfilteredAgenda(psconfeuuri));
    context.subscriptions.push(filterpsconfeuagenda);


}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;