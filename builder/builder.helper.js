/**
 * Builder helper is responsible contains tools for building
 */
const child_process = require('child_process');
const { error, info, print } = require('./builder.logger');

module.exports = {
    execCommand: function(command) {
        try {
            child_process.execSync(command);
            info(`Command: ${command} exited with 0`, true);
        }
        catch(e) {
            error(`Error happened when executing command: '${command}'`);
            print(`Error message:\n${e}`);
            process.exit(1);
        }
    }
}