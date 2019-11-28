/**
 * Responsible for building express backend
 */
const path = require('path');
const { glueReplace } = require('../glue');
const { mergePackage, STRATEGY_BackendPriority, execCommand } = require('../builder.helper');
const { info } = require('../builder.logger');

module.exports = {
    resolve: function(req, args) {
        const static = path.resolve(args.backendDir, 'static');
        req.push(static);
    },
    resolveFiles: function(req, args) {
        const backendDir = args.backendDir;
        const expressDir = path.resolve(__dirname, 'templates', 'express');
        const database = path.resolve(expressDir, 'db.min.txt');
        const index = path.resolve(expressDir, 'index.min.txt');
        const html = path.resolve(expressDir, 'index.html.min.txt');
        const package = path.resolve(expressDir, 'package.min.txt');
        req.push({
            source: index,
            target: path.resolve(backendDir, 'index.js')
        }, {
            source: database,
            target: path.resolve(backendDir, 'database.js')
        }, {
            source: html,
            target: path.resolve(backendDir, 'static', 'index.html')
        }, {
            source: package,
            target: path.resolve(backendDir, 'package.json')
        });
    },
    glue: function(args) {
        const backendDir = args.backendDir;
        const database = args.database;
        const db = path.resolve(backendDir, 'database.js');
        const package = path.resolve(backendDir, 'package.json');
        const readme = path.resolve(args.projectDir, 'README.md');
        glueReplace('python', readme, {
            'ProjectBackend': [
                'Using `express` as the backend, to start the server use:',
                '```sh',
                'npm start',
                '```',
                '',
                'To start the server in debug mode with more information:',
                '```sh',
                'npm run start:debug',
                '```',
                '',
                'The server will be run running on localhost:5000 by default'
            ]
        });
        info(`Successfully glue express in file: ${readme}`, true);
        if(database === 'MongoDB') {
            glueReplace('javascript', package, {
                'DatabaseDependency': '"mongodb": "^3.3.2"'
            })
            info(`Successfully glue express and MongoDB in file: ${package}`, true);
            glueReplace('javascript', db, {
                'DatabaseImport': "const MongoClient = require('mongodb').MongoClient;",
                'DatabaseConfig': [
                    'const host = "localhost"',
                    'const port = 27017',
                    'const dbName = "webapp"',
                    'const url = `mongodb://${host}:${port}`;'
                ],
                'DatabaseTest': [
                    'let conn = await MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});',
                    'await conn.db(dbName).admin().listDatabases();',
                    'conn.close();'
                ]
            });
            info(`Successfully glue express and MongoDB in file: ${db}`, true);
        }
        else if(database === 'MySQL') {
            glueReplace('javascript', package, {
                'DatabaseDependency': '"mysql": "^2.17.1"'
            });
            info(`Successfully glue express and MySQL in file: ${package}`, true);
            glueReplace('javascript', db, {
                'DatabaseImport': "const mysql = require('mysql');",
                'DatabaseConfig': [
                    'const host = "localhost";',
                    'const port = 3306;',
                    'const user = "root";',
                    'const password = "password";',
                    'const connection = mysql.createConnection({host:host, port:port, user:user, password:password});'
                ],
                'DatabaseTest': [
                    "connection.query('show databases', function(error, results, fields) {",
                    '   if(err) throw err',
                    '});'
                ],
            });
            info(`Successfully glue express and MySQL in file: ${db}`, true);
        }
    },
    preBuild: function(args) {
        mergePackage(args, STRATEGY_BackendPriority);
    },
    build: function(args) {
        const projectDir = args.projectDir;
        info(`Installing express dependencies ...`, false, true);
        execCommand(`cd ${projectDir} && npm install`);
    },
    postBuild: function(args) {
        info(`No post build for express`, true);
    },
}