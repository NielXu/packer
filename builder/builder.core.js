/**
 * Builder core is responsible for building important directories
 * that almost all web applications will have.
 */
const path = require('path');
const fs = require('fs');
const { info, error } = require('./builder.logger');

/**
 * Resolving the frontend directories, push all the require
 * directories to the given array
 * 
 * @param {Object} reqDirs An array of required paths
 * @param {Object} reqFiles An array of required files
 * @param {String} frontend One of the frontend option
 * @param {String} dir Working directory
 */
function resolveFrontend(reqDirs, reqFiles, frontend, dir) {
    const frontendDir = path.resolve(dir, 'frontend');
    reqDirs.push(frontendDir);
    try {
        const { resolve, resolveFiles } = require(`./worker/${frontend}`);
        resolve(reqDirs, frontendDir);
        resolveFiles(reqFiles, frontendDir);
    }
    catch(e) {
        error(`Worker not found: ${frontend}`);
        process.exit(1);
    }
}

/**
 * Resolving the backend directories, push all the require
 * directories to the given array.
 * 
 * @param {Object} reqDirs An array of required paths
 * @param {Object} reqFiles An array of required files
 * @param {String} backend One of the backend option
 * @param {String} dir Working directory
 */
function resolveBackend(reqDirs, reqFiles, backend, dir) {
    const backendDir = path.resolve(dir, 'backend');
    reqDirs.push(backendDir);
    try {
        const { resolve, resolveFiles } = require(`./worker/${backend}`);
        resolve(reqDirs, backendDir);
        resolveFiles(reqFiles, backendDir);
    }
    catch(e) {
        error(`Worker not found: ${backend}`);
        process.exit(1);
    }
}

/**
 * Build the require directories using `fs.mkdirSync`.
 * The order of the array does matter since directories
 * depend with each other.
 * 
 * @param {Object} reqDirs An array of required paths
 */
function buildDir(reqDirs) {
    reqDirs.forEach(e => {
        fs.mkdirSync(e);
        info(`Successfully created directory: ${e}`, true);
    });
}

/**
 * Glue the database and backend, the database configurations
 * and test codes might be different for different backends and
 * databases
 * 
 * @param {String} dir Working directory
 * @param {String} backend One of the backend option
 * @param {String} database One of the database option
 */
function glueBackend(dir, backend, database) {
    const backendDir = path.resolve(dir, 'backend');
    try {
        const { glue } = require(`./worker/${backend}`);
        glue(backendDir, database);
    }
    catch(e) {
        error(`Glue is not defined in worker: ${backend}`);
        process.exit(1);
    }
}

/**
 * Glue the frontend with some files if necessary
 * 
 * @param {String} dir Working directory
 * @param {String} frontend One of the frontend option
 * @param {String} database One of the database option
 */
function glueFrontend(dir, frontend, database) {
    const frontendDir = path.resolve(dir, 'frontend');
    try {
        const { glue } = require(`./worker/${frontend}`);
        glue(frontendDir, database);
    }
    catch(e) {
        error(`Glue is not defined in worker: ${frontend}`);
        process.exit(1);
    }
}

/**
 * Build the require files using `fs.copyFileSync`, the files
 * will be copied to the working directory.
 * 
 * @param {Object} reqFiles An array of required files
 */
function buildFiles(reqFiles) {
    reqFiles.forEach(e => {
        fs.copyFileSync(e.source, e.target);
        info(`Successfully created file: ${e.target}`, true);
    });
}

/**
 * Building the backend, executing commands and install
 * dependencies.
 * 
 * @param {String} dir Project directory
 * @param {String} backend One of the backend option
 */
function buildBackend(dir, backend) {
    const backendDir = path.resolve(dir, 'backend');
    try {
        const { build } = require(`./worker/${backend}`);
        build(backendDir);
    }
    catch(e) {
        error(`Build is not defined in worker: ${backend}`);
        process.exit(1);
    }
}

/**
 * Building the frontend, executing commands and install
 * dependencies.
 * 
 * @param {String} dir Project directory
 * @param {String} frontend One of the frontend option
 */
function buildFrontend(dir, frontend) {
    const frontendDir = path.resolve(dir, 'frontend');
    try {
        const { build } = require(`./worker/${frontend}`);
        build(frontendDir);
    }
    catch(e) {
        error(`Build is not defined in worker: ${frontend}`);
        process.exit(1);
    }
}

/**
 * Resolve files and directories on project level, this
 * is different from the backend and frontend resolving.
 * 
 * @param {String} dir The project directory
 * @param {Object} reqDirs Required directories
 * @param {Object} reqFiles Required files
 * @param {String} backend One of the backend option
 * @param {String} frontend One of the frontend option
 * @param {String} database One of the database option
 */
function resolveProject(dir, reqDirs, reqFiles, backend, frontend, database) {
    const scripts = path.resolve(dir, 'scripts');
    reqDirs.push(scripts);
    // Adding git files
    reqFiles.push({
        source: path.resolve(__dirname, 'worker', 'templates', 'git', 'gitignore.txt'),
        target: path.resolve(dir, '.gitignore')
    }, {
        source: path.resolve(__dirname, 'worker', 'templates', 'git', 'readme.txt'),
        target: path.resolve(dir, 'README.md')
    })
    if(database === 'MongoDB') {
        reqFiles.push({
            source: path.resolve(__dirname, 'worker', 'templates', 'scripts', 'start.mongo.sh'),
            target: path.resolve(scripts, 'startdb.sh')
        })
    }
    else if(database === 'MySQL') {
        reqFiles.push({
            source: path.resolve(__dirname, 'worker', 'templates', 'scripts', 'start.mysql.sh'),
            target: path.resolve(scripts, 'startdb.sh')
        })
    }
}

/**
 * The step after successfully building the frontend and the
 * backend.
 * 
 * @param {String} dir Project directory
 */
function postBuild(dir) {

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
     * @param {String} database One of the database option
     * 
     * @throws Exception if directory already exists
     */
    build: function(dir, name, backend, frontend, database) {
        const projectDir = path.resolve(dir, name);
        info(`Running packer with configurations: `, true);
        info(`\tProject directory: ${projectDir}`, true);
        info(`\tProject name: ${name}`, true);
        info(`\tBackend choice: ${backend}`, true);
        info(`\tFrontend choice: ${frontend}`, true);
        info(`\tDatabase choice: ${database}`, true);
        
        let reqDirs = [], reqFiles = [];
        if(fs.existsSync(projectDir)) {
            throw `Project '${name}' already exists under directory '${path.resolve(dir)}'`;
        }

        info(`Initializing project structure ...`, false, true);
        reqDirs.push(projectDir);
        resolveProject(projectDir, reqDirs, reqFiles, backend, frontend, database);
        resolveBackend(reqDirs, reqFiles, backend, projectDir);
        resolveFrontend(reqDirs, reqFiles, frontend, projectDir);

        info(`Building project directories and files ...`, false, true);
        buildDir(reqDirs);
        buildFiles(reqFiles);

        info(`Modifying template files ...`, false, true);
        glueBackend(projectDir, backend, database);
        glueFrontend(projectDir, frontend, database);

        info(`Building backend ...`, false, true);
        buildBackend(projectDir, backend);

        info(`Building frontend ...`, false, true);
        buildFrontend(projectDir, frontend);

        info(`Running post build ...`, false, true);
        postBuild(projectDir);
    }
}