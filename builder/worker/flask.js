/**
 * Responsible for building flask backend
 */
const path = require('path');
const { execCommand } = require('../builder.helper');
const { glueReplace } = require('../glue');

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
    glue: function(backendDir, database) {
        const requirements = path.resolve(backendDir, 'requirements.txt');
        const db = path.resolve(backendDir, 'database.py');
        if(database === 'MongoDB') {
            glueReplace('python', requirements, {
                'DatabaseDependency': 'pymongo'
            });
            console.log(`Successfully glue flask and MongoDB in file: ${requirements}`);
            glueReplace('python', db, {
                'DatabaseImport': 'import pymongo',
                'DatabaseConfig': [
                    'host = "127.0.0.1"',
                    'port = 27017',
                    'timeout = 5000',
                    'client = pymongo.MongoClient(host=host, port=port, serverSelectionTimeoutMS=timeout)'
                ],
                'DatabaseTest': 'client.database_names()'
            });
            console.log(`Successfully glue flask and MongoDB in file: ${db}`);
        }
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