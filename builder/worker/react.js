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
}