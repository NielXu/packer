/**
 * Builder helper is responsible contains tools for building
 */
const child_process = require('child_process');
const { error, info, print } = require('./builder.logger');
const fs = require('fs');
const path = require('path');

const BACKEND = 1;
const FRONTEND = 2;

function readAsJson(file) {
    return JSON.parse(fs.readFileSync(file));
}

/**
 * Tell if merge is required based on the backend and frontend
 * options. It will check if `package.json` exists in both
 * `backend` and `frontend`, return true if it does, false
 * otherwise.
 * 
 * @param {Object} args An obejct of arguments
*/
function mergeRequired(args) {
    const backendPackage = path.resolve(args.backendDir, 'package.json');
    const frontendPackage = path.resolve(args.frontendDir, 'package.json');
    if(fs.existsSync(backendPackage) && fs.existsSync(frontendPackage)) {
        return true;
    }
    return false;
}

function merge(front, back, strategy) {
    let copyFront = JSON.parse(JSON.stringify(front));
    for(var key in back) {
        if(copyFront.hasOwnProperty(key) && copyFront[key]) {
            const frontValue = copyFront[key];
            const backValue = back[key];
            if(typeof frontValue === 'object' && typeof backValue === 'object') {
                const child = merge(frontValue, backValue, strategy);
                copyFront[key] = child;
            }
            else if(typeof frontValue === 'string' && typeof backValue === 'string') {
                if(strategy === BACKEND) {
                    copyFront[key] = back[key];
                }
            }
            else {
                throw `Incomptiable type ${typeof frontValue} and ${typeof backValue}`;
            }
        }
        else {
            copyFront[key] = back[key];
        }
    }
    return copyFront;
}

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
    },
    mergeRequired: mergeRequired,
    /**
     * Merge the backend `package.json` and frontend `package.json` into one,
     * and place it under the project directory and it will do a `mergeRequired`
     * check first.
     * 
     * The original `package.json` under backend and frontend will be removed
     * since they have been merged to one.
     * 
     * @param {Object} args An object of arguments
     * @param {Object} strategy The strategy of merging, `STRATEGY_BackendPriority`,
     *  `STRATEGY_FrontendPriority`, default is `STRATEGY_FrontendPriority`
     */
    mergePackage: function(args, strategy) {
        if(mergeRequired(args)) {
            const backendPackage = path.resolve(args.backendDir, 'package.json');
            const frontendPackage = path.resolve(args.frontendDir, 'package.json');
            const mainPackage = path.resolve(args.projectDir, 'package.json');
            const merged = merge(readAsJson(frontendPackage), readAsJson(backendPackage), strategy);
            fs.unlinkSync(backendPackage);
            fs.unlinkSync(frontendPackage);
            fs.writeFileSync(mainPackage, JSON.stringify(merged, null, 2), 'utf-8');
            info(`Successfully merged ${backendPackage} and ${frontendPackage} to ${mainPackage}`, true);
        }
    },
    /**
     * If dependencies appear in both backend and frontend, use
     * the backend one
     */
    STRATEGY_BackendPriority: BACKEND,
    /**
     * If dependencies appear in both backend and frontend, use
     * the frontend one
     */
    STRATEGY_FrontendPriority: FRONTEND,
}

// const a = merge(readAsJson(path.resolve(__dirname, '..', 'test', 'b.json')), readAsJson(path.resolve(__dirname, '..', 'test', 'a.json')), BACKEND);
// console.log(JSON.stringify(a, null, 4));