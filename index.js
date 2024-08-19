import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs/promises';
import { Lang, parse } from '@ast-grep/napi';
import { tableCellRule, tableGridRule, tdRule, formRule, tableGridIdentifierRule } from './rules/rules.js';

const rl = readline.createInterface({ input, output });

rl.on('line', command => {
    parseCommand(command);
})

const parseCommand = (commandString) => {
    const tokenizedString = commandString.split(" ");
    switch (tokenizedString[0]) {
        case 'exit':
            rl.close();
            break;
        case 'add-field':
            executeCommand(tokenizedString);
            break;
        default:
            console.log('Wrong command!');
            break;
    }
}

const executeCommand = async (tokenizedCommandString) => {
    console.log('Reading file...')
    let file;
    try {
        file = await fs.readFile(tokenizedCommandString[1], { encoding: 'utf-8' });
    } catch (err) {
        console.error('File reading failed\nError: ' + err);
        return;
    }
    const ast = parse(Lang.Tsx, file);
    const root = ast.root();
    console.log('Finding matches...');
    const replaceablesArray = findMatches(root, tokenizedCommandString[2]);
    console.log(`Found ${replaceablesArray[1].length} matches.`);
    if (replaceablesArray[1].length == 0) {
        console.log('No Table or Form found!');
        return;
    }

    fixCode(replaceablesArray, tokenizedCommandString[3]);
    console.log('Command execute succesfully');
}

const findMatches = (root, fieldType) => {
    switch (fieldType.toLowerCase()) {
        case 'tablecell':
            return ['<TableCell>', root.findAll(tableCellRule), '</TableCell>'];

        case 'td':
            return ['<td>', root.findAll(tdRule), '</td>'];

        case 'column':
            const identifier = root.find(tableGridIdentifierRule).getMatch('ID');
            return ['column', root.findAll(tableGridRule(identifier)), null];

        case 'input':
            return ['<input>', root.findAll(formRule), '</input>'];

        case 'textfield':
            return ['<TextField', root.findAll(formRule), '</TextField>'];
        default:
            return [null, []];
    }
}

const returnInputString = (typeString) => {
    switch (typeString) {
        case typeString.match('[sS]tring').input:
            return ['string', 'Lorem Ipsum'];

        case typeString.match('[iI]nteger').input:
            return ['number', 100];

        case typeString.match('[dD]ecimal').input:
            return ['number', 19.87];

        case typeString.match('[dD]ate').input:
            return ['date', new Date().toLocaleString()];
        default:
            return [null, null];
    }
}

const fixCode = (matches, inputType) => {
    const edits = [];
    matches[1].forEach(match => {
        if (matches[0].includes('td') || matches[0].includes('TableCell')) {
            //rebuild the table row and put new cell at the end

            const openTag = matches[0].includes('td') ? '<tr' : '<TableRow'
            const openTagArgs = match.getMultipleMatches('ARGS');
            const cells = match.getMultipleMatches('CELLS');
            const closeTag = matches[0].includes('td') ? '</tr>' : '</TableRow>'
            const newCell = matches[0] + returnInputString(inputType)[1] + matches[2]
            const newEdit = match.replace(`${openTag} ${openTagArgs.forEach(arg => arg.text())}> \n${cells.forEach(cell => cell.text())} \n${newCell} \n${closeTag}`);
            match.commitEdits([newEdit]);
            edits.push(newEdit);

        } else if (matches[0] == 'column') {
            // input new column definition into DataGrid columns definition

            const newEdit = match.replace(`${match.slice(0, -1)}\n{ field: "${returnInputString(inputType)[0]}", type: "${returnInputString(inputType)[0]}"}\n]`);
            match.commitEdits([newEdit]);
            edits.push(newEdit);

        } else if (matches[0].includes('input') || matches[0].includes('TextField')) {
            // rebuild the TextFields/input container and put new TextField/input at the end

            const openTag = match.getMatch('OPEN_TAG').text();
            const openTagArgs = match.getMultipleMatches('ARGS');
            const body = match.getMultipleMatches('BODY');
            const newElement = `${matches[0]} placeholder="${returnInputString(inputType)[1]}" type="${typeof (inputType) == 'string' ? 'text' : returnInputString(inputType[0])}"/>`;
            const newEdit = match.replace(`<${openTag} ${openTagArgs.forEach(arg => arg.text())}> \n${body.forEach(node => node.text())} \n${newElement}\n</${openTag}>`);
            match.commitEdits([newEdit]);
            edits.push(newEdit);

        }
    });
    console.log(`In total ${edits.length} inserts made.`);

}