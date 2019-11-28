/**
 * Responsible for building react frontend
 */
const path = require('path');
const { info } = require('../builder.logger');
const { execCommand, mergeRequired } = require('../builder.helper');
const { glueAppend } = require('../glue');

module.exports = {
    resolve: function(req, args) {
        const frontendDir = args.frontendDir;
        const css = path.resolve(frontendDir, 'css');
        const js = path.resolve(frontendDir, 'js');
        req.push(css, js);
    },
    resolveFiles: function(req, args) {
        const frontendDir = args.frontendDir;
        const reactDir = path.resolve(__dirname, 'templates', 'react');
        const webpackDir = path.resolve(__dirname, 'templates', 'webpack');
        const package = path.resolve(reactDir, 'package.min.txt');
        const babel = path.resolve(reactDir, 'babel.min.txt');
        const app = path.resolve(reactDir, 'app.min.txt');
        const index = path.resolve(reactDir, 'index.min.txt');
        const webpackCommon = path.resolve(webpackDir, 'common.min.txt');
        const webpackDev = path.resolve(webpackDir, 'dev.min.txt');
        const webpackProd = path.resolve(webpackDir, 'prod.min.txt');
        req.push({
            source: package,
            target: path.resolve(frontendDir, 'package.json')
        }, {
            source: webpackCommon,
            target: path.resolve(frontendDir, 'webpack.common.js')
        }, {
            source: webpackDev,
            target: path.resolve(frontendDir, 'webpack.dev.js')
        }, {
            source: webpackProd,
            target: path.resolve(frontendDir, 'webpack.prod.js')
        }, {
            source: babel,
            target: path.resolve(frontendDir, '.babelrc')
        }, {
            source: app,
            target: path.resolve(frontendDir, 'js', 'App.jsx')
        }, {
            source: index,
            target: path.resolve(frontendDir, 'js', 'index.jsx')
        });
    },
    glue: function(args) {
        const frontendDir = args.frontendDir;
        const gitignore = path.resolve(frontendDir, '..', '.gitignore');
        glueAppend(gitignore, "node_modules");
        info(`Successfully glue react in file: ${gitignore}`, true);
    },
    preBuild: function(args) {
        info(`No pre build for react`, true);
    },
    build: function(args) {
        const frontendDir = mergeRequired(args)? args.projectDir : args.frontendDir;
        info(`Installing react dependencies ...`, false, true);
        execCommand(`cd ${frontendDir} && npm install`);
        info(`Building js file using webpack ...`, false, true);
        execCommand(`cd ${frontendDir} && npm run build`);
    },
    postBuild: function(args) {
        info(`No post build for react`, true);
    },
}