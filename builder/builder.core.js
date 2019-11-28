/**
 * Builder core is responsible for building important directories
 * that almost all web applications will have.
 */
const path = require('path');
const fs = require('fs');
const { info, error } = require('./builder.logger');
const { glueReplace } = require('./glue');

/**
 * Resolving the frontend directories, push all the require
 * directories to the given array
 * 
 * @param {Object} reqDirs An array of required paths
 * @param {Object} reqFiles An array of required files
 * @param {Object} args An object of arguments
 */
function resolveFrontend(reqDirs, reqFiles, args) {
    const frontendDir = args.frontendDir;
    const frontend = args.frontend;
    reqDirs.push(frontendDir);
    try {
        const { resolve, resolveFiles } = require(`./worker/${frontend}`);
        resolve(reqDirs, args);
        resolveFiles(reqFiles, args);
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
 * @param {Object} args An object of arguments
 */
function resolveBackend(reqDirs, reqFiles, args) {
    const backendDir = args.backendDir;
    const backend = args.backend;
    reqDirs.push(backendDir);
    try {
        const { resolve, resolveFiles } = require(`./worker/${backend}`);
        resolve(reqDirs, args);
        resolveFiles(reqFiles, args);
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
 * @param {String} args An object of arguments
 */
function glueBackend(args) {
    const backend = args.backend;
    try {
        const { glue } = require(`./worker/${backend}`);
        glue(args);
    }
    catch(e) {
        error(`Glue is not defined in worker: ${backend}`);
        console.log(e);
        process.exit(1);
    }
}

/**
 * Glue the frontend with some files if necessary
 * 
 * @param {Object} args An object of arguments
 */
function glueFrontend(args) {
    const frontend = args.frontend;
    try {
        const { glue } = require(`./worker/${frontend}`);
        glue(args);
    }
    catch(e) {
        error(`Glue is not defined in worker: ${frontend}`);
        console.log(e);
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
 * Doing prebuild for the frontend, this is the step before
 * the actual build
 * 
 * @param {Object} args An object of arguments
 */
function preBuildFrontend(args) {
    const frontend = args.frontend;
    try {
        const { preBuild } = require(`./worker/${frontend}`);
        preBuild(args);
    }
    catch(e) {
        error(`PreBuild is not defined in worker: ${frontend}`);
        process.exit(1);
    }
}

/**
 * Doing prebuild for the backend, this is the step before
 * the actual build
 * 
 * @param {Object} args An object of arguments
 */
function preBuildBackend(args) {
    const backend = args.backend;
    try {
        const { preBuild } = require(`./worker/${backend}`);
        preBuild(args);
    }
    catch(e) {
        error(`PreBuild is not defined in worker: ${backend}`);
        console.log(e);
        process.exit(1);
    }
}

/**
 * Building the backend, executing commands and install
 * dependencies.
 * 
 * @param {Object} args An object of arguments
 */
function buildBackend(args) {
    const backend = args.backend;
    try {
        const { build } = require(`./worker/${backend}`);
        build(args);
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
 * @param {Object} args An object of arguments
 */
function buildFrontend(args) {
    const frontend = args.frontend;
    try {
        const { build } = require(`./worker/${frontend}`);
        build(args);
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
 * @param {String} reqDirs Required directories
 * @param {Object} reqFiles Required files
 * @param {Object} args An object of argument
 */
function resolveProject(reqDirs, reqFiles, args) {
    const projectDir = args.projectDir;
    const scriptsDir = args.scriptsDir;
    const database = args.database;
    reqDirs.push(scriptsDir);
    // Adding git files
    reqFiles.push({
        source: path.resolve(__dirname, 'worker', 'templates', 'git', 'gitignore.txt'),
        target: path.resolve(projectDir, '.gitignore')
    }, {
        source: path.resolve(__dirname, 'worker', 'templates', 'git', 'readme.txt'),
        target: path.resolve(projectDir, 'README.md')
    })
    if(database === 'MongoDB') {
        reqFiles.push({
            source: path.resolve(__dirname, 'worker', 'templates', 'scripts', 'start.mongo.sh'),
            target: path.resolve(scriptsDir, 'startdb.sh')
        })
    }
    else if(database === 'MySQL') {
        reqFiles.push({
            source: path.resolve(__dirname, 'worker', 'templates', 'scripts', 'start.mysql.sh'),
            target: path.resolve(scriptsDir, 'startdb.sh')
        })
    }
}

/**
 * Doing postbuild for the frontend, this is the step after
 * the successful build
 * 
 * @param {Object} args An object of arguments
 */
function postBuildFrontend(args) {
    const frontend = args.frontend;
    try {
        const { postBuild } = require(`./worker/${frontend}`);
        postBuild(args);
    }
    catch(e) {
        error(`PostBuild is not defined in worker: ${frontend}`);
        process.exit(1);
    }
}

/**
 * Doing postbuild for the backend, this is the step after
 * the successful build
 * 
 * @param {Object} args An object of arguments
 */
function postBuildBackend(args) {
    const backend = args.backend;
    try {
        const { postBuild } = require(`./worker/${backend}`);
        postBuild(args);
    }
    catch(e) {
        error(`PostBuild is not defined in worker: ${backend}`);
        process.exit(1);
    }
}

/**
 * Glue files on project level
 * 
 * @param {Object} args An object of argument
 */
function glueProject(args) {
    glueReplace('python', path.resolve(args.projectDir, 'README.md'), {
        'ProjectTitle': [
            `# ${args.projectName}`,
            'This project is generated by packer v1.0.0, it is ready to develop on local'
        ]
    });
    glueReplace('python', path.resolve(args.projectDir, 'README.md'), {
        'ProjectDatabase': [
            `Using \`${args.database}\` database, there is a script under scripts folder to start the `+ 
            `database easily, use:`,
            '```sh',
            './scripts/startdb.sh',
            '```',
            'The database container will then run on the port that defined in the script, always feel '+
            'free to change it if necessary. The container will have the name webapp_database, and to '+
            'stop it, use:',
            '```sh',
            'docker stop webapp_database',
            '```',
        ]
    })
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
        const args = {
            dir: dir,
            projectDir: projectDir,
            projectName: name,
            backend: backend,
            backendDir: path.resolve(projectDir, 'backend'),
            frontend: frontend,
            frontendDir: path.resolve(projectDir, 'frontend'),
            database: database,
            scriptsDir: path.resolve(projectDir, 'scripts'),
        }

        info(`Initializing project structure ...`, false, true);
        reqDirs.push(projectDir);
        resolveProject(reqDirs, reqFiles, args);
        resolveBackend(reqDirs, reqFiles, args);
        resolveFrontend(reqDirs, reqFiles, args);

        info(`Building project directories and files ...`, false, true);
        buildDir(reqDirs);
        buildFiles(reqFiles);

        info(`Modifying template files ...`, false, true);
        glueProject(args);
        glueBackend(args);
        glueFrontend(args);

        info(`Running prebuild ...`, false, true);
        preBuildBackend(args);
        preBuildFrontend(args);

        info(`Building backend ...`, false, true);
        buildBackend(args);
        info(`Building frontend ...`, false, true);
        buildFrontend(args);

        info(`Running post build ...`, false, true);
        postBuildBackend(args);
        postBuildFrontend(args);
    }
}