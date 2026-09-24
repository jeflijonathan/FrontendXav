const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Fix the syntax error from previous script
            const syntaxErrorRegex = /,\s*onError:\s*\(\)\s*=>\s*\{\}\s*\}\s*,\s*onError:/g;
            if (syntaxErrorRegex.test(content)) {
                content = content.replace(syntaxErrorRegex, '}, onError:');
                modified = true;
            }

            // In FormCardDialogs, they use new Service().getAll({ onSuccess: ... }) which lacks onError
            // This is another syntax error I need to fix.
            if (fullPath.includes('FormCardDialog')) {
                // Find { onSuccess: (res) => { ... } } and add onError if it lacks it
                const getAllRegex = /getAll\(\s*\{\s*onSuccess:\s*\([^)]*\)\s*=>\s*(?:[^{]+|\{[^}]*\})\s*\}\s*,/g;
                content = content.replace(getAllRegex, (match) => {
                    if (!match.includes('onError')) {
                        modified = true;
                        return match.replace(/\}\s*,$/, ', onError: () => {} },');
                    }
                    return match;
                });
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed', fullPath);
            }
        }
    });
}
walk('./src');
