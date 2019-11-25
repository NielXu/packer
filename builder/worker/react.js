/**
 * Responsible for building react frontend
 */
const path = require('path');

module.exports = {
    resolve: function(req, frontendDir) {
        const css = path.resolve(frontendDir, 'css');
        const js = path.resolve(frontendDir, 'js');
        req.push(css, js);
    },
    resolveFiles: function(req, frontendDir) {
        const reactDir = path.resolve(__dirname, 'templates', 'react');
        const package = path.resolve(reactDir, 'package.min.txt');
        req.push({
            source: package,
            target: path.resolve(frontendDir, 'package.json')
        });
    },
    build: function(frontendDir) {

    }
}