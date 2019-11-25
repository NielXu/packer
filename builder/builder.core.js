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
    if(frontend === 'react') {
        resolveReact(reqPaths, frontendDir);
    }
}

/**
 * Resolve the react frontend, push necessary directories
 * to the given array
 * 
 * @param {Object} reqPaths An array of required paths
 * @param {String} backendDir Backend directory
 */
function resolveReact(reqPaths, frontendDir) {
    const css = path.resolve(frontendDir, 'css');
    const js = path.resolve(frontendDir, 'js');
    reqPaths.push(css, js);
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
    if(backend === 'flask') {
        resolveFlask(reqPaths, backendDir);
    }
    else if(backend === 'express') {
        resolveExpress(reqPaths, backendDir);
    }
}

/**
 * Resolve the flask backend, push necessary directories
 * to the given array
 * 
 * @param {Object} reqPaths An array of required paths
 * @param {String} backendDir Backend directory
 */
function resolveFlask(reqPaths, backendDir) {
    const templates = path.resolve(backendDir, 'templates');
    const static = path.resolve(backendDir, 'static');
    reqPaths.push(templates, static);
}

/**
 * Resolve the express backend, push necessary directories
 * to the given array
 * 
 * @param {Object} reqPaths An array of required paths
 * @param {String} backendDir Backend directory
 */
function resolveExpress(reqPaths, backendDir) {
    throw `Express backend is not yet implemented`;
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