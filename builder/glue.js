/**
 * Glue is a module that help to make connection between different
 * frontend, backend and database. There is a special notation that
 * can help to find the tag depends on the target language.
 */
const fs = require('fs');

function countWhitespaceBefore(s) {
    return s.search(/\S|$/);
}

function prependWhitespace(count) {
    let space = "";
    for(var i=0;i<count;i++) {
        space += " ";
    }
    return space;
}

module.exports = {
    glueReplace: function(lang, file, search) {
        const content = fs.readFileSync(file, 'utf-8').split("\n");
        let newContent = [];
        let gluePattern = "";
        if(lang === 'python' || lang === 'py') {
            gluePattern = "#!Glue";
        }
        else if(lang === 'javascript' || lang === 'js') {
            gluePattern = "//!Glue";
        }
        else {
            console.log(`Unable to identify languange: ${lang}`);
            process.exit(1);
        }
        for(var i=0;i<content.length;i++) {
            const line = content[i].trim().replace("\n", "");
            if(line.startsWith(gluePattern)) {
                const foundTag = line.split("@")[1];
                if(!foundTag) {
                    console.log(`Incorrect Glue format in file: ${file}`);
                    process.exit(1);
                }
                if(foundTag in search) {
                    const spaces = countWhitespaceBefore(content[i]);
                    const repl = search[foundTag];
                    if(typeof repl === 'string') {
                        newContent.push(prependWhitespace(spaces) + repl);   
                    }
                    else {
                        for(var j=0;j<repl.length;j++) {
                            newContent.push(prependWhitespace(spaces) + repl[j]);
                        }
                    }
                }
            }
            else {
                newContent.push(content[i]);
            }
        }
        let final = "";
        for(var k=0;k<newContent.length;k++) {
            final += newContent[k] + "\n";
        }
        fs.writeFileSync(file, final);
    }
}
