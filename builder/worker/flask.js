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
        const flaskDir = path.resolve(__dirname, 'templates', 'flask');
        const requirements = path.resolve(flaskDir, 'req.min.txt');
        const app = path.resolve(flaskDir, 'app.min.txt');
        const database = path.resolve(flaskDir, 'db.min.txt');
        const html = path.resolve(flaskDir, 'index.min.txt');
        req.push({
            source: requirements,
            target: path.resolve(backendDir, 'requirements.txt')
        }, {
            source: app,
            target: path.resolve(backendDir, 'app.py')
        }, {
            source: database,
            target: path.resolve(backendDir, 'database.py')
        }, {
            source: html,
            target: path.resolve(backendDir, 'templates', 'index.html')
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