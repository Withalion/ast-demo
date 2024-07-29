import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

rl.on('line', command => {
    // console.log(`Detected command: ${command}`);
    parseCommand(command);
})

function parseCommand(commandString) {
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

function executeCommand(tokenizedCommandString) {
    console.log(tokenizedCommandString);
}