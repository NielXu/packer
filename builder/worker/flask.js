/**
 * Responsible for building flask backend
 */
const path = require('path');
const { execCommand } = require('../builder.helper');
const { glueReplace, glueAppend } = require('../glue');
const { info } = require('../builder.logger');

module.exports = {
    resolve: function(req, args) {
        const backendDir = args.backendDir;
        const templates = path.resolve(backendDir, 'templates');
        const static = path.resolve(backendDir, 'static');
        req.push(templates, static);
    },
    resolveFiles: function(req, args) {
        const backendDir = args.backendDir;
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
    glue: function(args) {
        const backendDir = args.backendDir;
        const database = args.database;
        const requirements = path.resolve(backendDir, 'requirements.txt');
        const db = path.resolve(backendDir, 'database.py');
        const gitignore = path.resolve(backendDir, '..', '.gitignore');
        const readme = path.resolve(args.projectDir, 'README.md');
        glueReplace('python', readme, {
            'ProjectBackend': [
                'Using `flask` as the backend, to start the server first activate the venv:',
                '```sh',
                'cd backend && source venv/bin/activate',
                '```',
                '',
                'Then start the development server:',
                '```sh',
                'python app.py',
                '```',
                '',
                'To deactivate the venv:',
                '```sh',
                'deactivate',
                '```',
            ]
        });
        info(`Successfully glue flask in file: ${readme}`, true);
        glueAppend(gitignore, "__pycache__");
        info(`Successfully glue flask in file: ${gitignore}`, true);
        if(database === 'MongoDB') {
            glueReplace('python', requirements, {
                'DatabaseDependency': 'pymongo'
            });
            info(`Successfully glue flask and MongoDB in file: ${requirements}`, true);
            glueReplace('python', db, {
                'DatabaseImport': 'import pymongo',
                'DatabaseConfig': [
                    'host = "127.0.0.1"',
                    'port = 27017',
                    'timeout = 5000',
                    'client = pymongo.MongoClient(host=host, port=port, serverSelectionTimeoutMS=timeout)'
                ],
                'DatabaseTest': 'client.list_database_names()'
            });
            info(`Successfully glue flask and MongoDB in file: ${db}`, true);
        }
        else if(database === 'MySQL') {
            glueReplace('python', requirements, {
                'DatabaseDependency': 'mysql-connector'
            });
            info(`Successfully glue flask and mysql in file: ${requirements}`, true);
            glueReplace('python', db, {
                'DatabaseImport': 'import mysql.connector as connector',
                'DatabaseConfig': [
                    'host="localhost"',
                    'port=3306',
                    'user="root"',
                    'password="password"',
                    'connection = connector.connect(host=host, port=port, user=user, password=password)',
                    'cursor = connection.cursor()'
                ],
                'DatabaseTest': [
                    'databases = ("show databases")',
                    'cursor.execute(databases)',
                    'li=[]',
                    'for (databases) in cursor:',
                    '   li.append(databases[0])'
                ]
            });
            info(`Successfully glue flask and mysql in file: ${db}`, true);
        }
    },
    preBuild: function(args) {
        info(`No pre build for flask`, true);
    },
    build: function(args) {
        const backendDir = args.backendDir;
        const venv = path.resolve(backendDir, 'venv');
        const activate = path.resolve(venv, 'bin', 'activate');
        const req = path.resolve(backendDir, 'requirements.txt');
        info(`Setting up virtualenv for flask backend ...`, false, true);
        execCommand(`virtualenv ${venv}`);
        info(`Installing dependencies in virtualenv ...`, false, true);
        execCommand(`source ${activate} && pip install -r ${req}`);
    },
    postBuild: function(args) {
        info(`No post build for flask`, true);
    },
}