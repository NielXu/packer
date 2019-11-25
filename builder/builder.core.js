/**
 * Builder core is responsible for building important directories
 * that almost all web applications will have.
 */
const path = require('path');
const fs = require('fs');

/**
 * Resolving the frontend directories, push all the require
 * directories to the given array
 * 
 * @param {Object} reqPaths An array of required paths
 * @param {String} frontend One of the frontend option
 * @param {String} dir Working directory
 */
function resolveFrontend(reqPaths, frontend, dir) {
    const frontendDir = path.resolve(dir, 'frontend');
    reqPaths.push(frontendDir);
    try {
        const { resolve } = require(`./worker/${frontend}`);
        resolve(reqPaths, frontendDir);
    }
    catch(e) {
        console.log(`Worker not found: ${frontend}`);
        process.exit(1);
    }
}

/**
 * Resolving the backend directories, push all the require
 * directories to the given array.
 * 
 * @param {Object} reqPaths An array of required paths
 * @param {String} backend One of the backend option
 * @param {String} dir Working directory
 */
function resolveBackend(reqPaths, backend, dir) {
    const backendDir = path.resolve(dir, 'backend');
    reqPaths.push(backendDir);
    try {
        const { resolve } = require(`./worker/${backend}`);
        resolve(reqPaths, backendDir);
    }
    catch(e) {
        console.log(`\nWorker not found: ${backend}`);
        process.exit(1);
    }
}

/**
 * Build the require directories using `fs.mkdirSync`.
 * The order of the array does matter since directories
 * depend with each other.
 * 
 * @param {Object} reqPaths An array of required paths
 */
function buildReq(reqPaths) {
    reqPaths.forEach(e => {
        fs.mkdirSync(e);
        console.log(`Successfully created directory: ${e}`);
    });
}

module.exports = {
    /**
     * Building the directory tree based on the backend
     * and frontend choice. Also effected is useConfig
     * is true, which will slightly change the directory.
     * 
     * @param {String} dir The project directory
     * @param {String} name The project name
     * @param {String} backend One of the backend option
     * @param {String} frontend One of the frontend option
     * 
     * @throws Exception if directory already exists
     */
    buildDir: function(dir, name, backend, frontend, useConfig) {
        const projectDir = path.resolve(dir, name);
        let reqPaths = [];
        if(fs.existsSync(projectDir)) {
            throw `Project '${name}' already exists under directory '${path.resolve(dir)}'`;
        }
        reqPaths.push(projectDir);
        resolveBackend(reqPaths, backend, projectDir);
        resolveFrontend(reqPaths, frontend, projectDir);
        buildReq(reqPaths);
    }
}