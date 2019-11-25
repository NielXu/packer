/**
 * Builder helper is responsible contains tools for building
 */
const child_process = require('child_process');

module.exports = {
    execCommand: function(command) {
        try {
            child_process.execSync(command);
            console.log(`Command: ${command} exited with 0`);
        }
        catch(e) {
            console.log(`Error happened when executing command: '${command}'`);
            console.log(e);
            process.exit(1);
        }
    }
}