/**
 * Responsible for building flask backend
 */
const path = require('path');

module.exports = {
    resolve: function(req, backendDir) {
        const templates = path.resolve(backendDir, 'templates');
        const static = path.resolve(backendDir, 'static');
        req.push(templates, static);
    },
}