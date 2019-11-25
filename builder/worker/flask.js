/**
 * Responsible for building flask backend
 */
const path = require('path');
const { execCommand } = require('../builder.helper');

module.exports = {
    resolve: function(req, backendDir) {
        const templates = path.resolve(backendDir, 'templates');
        const static = path.resolve(backendDir, 'static');
        req.push(templates, static);
    },
    resolveFiles: function(req, backendDir) {
        const requirements = path.resolve(__dirname, 'templates', 'flask.min.txt');
        req.push({
            source: requirements,
            target: path.resolve(backendDir, 'requirements.txt')
        });
    },
    build: function(backendDir) {
        const venv = path.resolve(backendDir, 'venv');
        const activate = path.resolve(venv, 'bin', 'activate');
        const req = path.resolve(backendDir, 'requirements.txt');
        console.log(`Setting up virtualenv for flask backend ...`);
        execCommand(`virtualenv ${venv}`);
        console.log(`Activating virtualenv ...`);
        execCommand(`source ${activate}`);
        console.log(`Installing dependencies ...`);
        execCommand(`pip install -r ${req}`);
    },
}