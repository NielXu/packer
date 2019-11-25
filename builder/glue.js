/**
 * Glue is a module that help to make connection between different
 * frontend, backend and database. There is a special notation that
 * can help to find the tag depends on the target language.
 */
const fs = require('fs');

/**
 * Count the number of whitespaces before first character in string,
 * return an integer.
 * 
 * @param {String} s String
 */
function countWhitespaceBefore(s) {
    return s.search(/\S|$/);
}

/**
 * Return a string that fill with whitespaces with given length
 * 
 * @param {Number} count Integer
 */
function prependWhitespace(count) {
    let space = "";
    for(var i=0;i<count;i++) {
        space += " ";
    }
    return space;
}

module.exports = {
    /**
     * Find the glue notation inside the file and replace them
     * by the given strings. The search variable should be an object
     * with format `{tagName: replaceWith}`. As long as the tag is found,
     * that line will be replaced with the given string. If the `replaceWith`
     * is an array, every element of the array will be added in each line.
     * If the notation is presented but it is not what we are searching for,
     * that line will be removed.
     * 
     * The glue notation depends on lanaguage, usually it will be the comment
     * character + !Glue, for example, in python it will be `#!Glue@someTagName`
     * 
     * @param {String} lang Language: python|py, javascript|js
     * @param {String} file File location
     * @param {Object} search What to search for and replace with
     */
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
