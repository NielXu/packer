/**
 * Do logging based on verbosity level passed in command
 */
const argv = require('yargs').argv;

module.exports = {
    /**
     * Print info message on console with
     * `INFO` prefix, if v is true, only
     * print this message in verbose mode
     * 
     * @param {String} msg Info message
     * @param {Boolean} v Verbose
     * @param {Boolean} sep Add empty line before and after the message
     */
    info: function(msg, v, sep) {
        if(v) {
            if(argv.v) {
                console.log(sep? `\nINFO: ${msg}\n` : `INFO: ${msg}`);
            }
        }
        else {
            console.log(sep? `\nINFO: ${msg}\n` : `INFO: ${msg}`);
        }
    },
    /**
     * Print info message on console with
     * `WARN` prefix, if v is true, only
     * print this message in verbose mode
     * 
     * @param {String} msg Warning message
     * @param {Boolean} v Verbose
     * @param {Boolean} sep Add empty line before and after the message
     */
    warn: function(msg, v) {
        if(v) {
            if(argv.v) {
                console.log(sep? `\nWARN: ${msg}\n` : `WARN: ${msg}`);
            }
        }
        else {
            console.log(sep? `\nWARN: ${msg}\n` : `WARN: ${msg}`);
        }
    },
    /**
     * Print info message on console with
     * `ERROR` prefix, if v is true, only
     * print this message in verbose mode
     * 
     * @param {String} msg Error message
     * @param {Boolean} v Verbose
     * @param {Boolean} sep Add empty line before and after the message
     */
    error: function(msg, v) {
        if(v) {
            if(argv.v) {
                console.log(sep? `\nERROR: ${msg}\n` : `ERROR: ${msg}`);
            }
        }
        else {
            console.log(sep? `\nERROR: ${msg}\n` : `ERROR: ${msg}`);
        }
    },
    /**
     * Print the given message with prefix, if prefix
     * is not given the message will be printed directly
     * without prefix. If v is true, only print this
     * message in verbose mode
     * 
     * @param {String} msg Any message
     * @param {String} prefix Prefix of the message
     * @param {Boolean} v Verbose
     */
    print: function(msg, prefix, v) {
        if(v) {
            if(argv.v) {
                console.log(prefix? prefix+": "+msg : msg);
            }
        }
        else {
            console.log(prefix? prefix+": "+msg : msg);
        }
    }
}