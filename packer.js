const inquirer = require('inquirer');
const fs = require('fs');
const { build } = require('./builder/builder.core');
const { error, print, info } = require('./builder/builder.logger');

console.log();
console.log('Welcome to packer v1.0.0');
console.log('Please follow the instructions below to setup your web applications');
console.log();

var questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Your project name:',
    },
    {
        type: 'input',
        name: 'workdir',
        message: 'Your working directory:',
        validate: function(workdir) {
            const valid = fs.existsSync(workdir);
            return valid || 'Path does not exists';
        }
    },
    {
        type: 'list',
        name: 'backend',
        message: 'Please choose your backend:',
        choices: ['flask', 'express']
    },
    {
        type: 'list',
        name: 'frontend',
        message: 'Please choose your frontend:',
        choices: ['react']
    },
    {
        type: 'list',
        name: 'database',
        message: 'Please choose your database:',
        choices: ['MongoDB', 'MySQL', 'PostgreSQL']
    },
];

inquirer.prompt(questions).then(answers => {
    try {
        build(answers.workdir, answers.name, answers.backend,
            answers.frontend, answers.database);
        info(`Project built successfully`, false, true);
    }
    catch(e) {
        error("Erorr happened when building your web application");
        print(`Error message:\n${e}`);
    }
});
