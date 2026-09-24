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

            // 1. Fix verbatimModuleSyntax: import { XResponseModel } to import type { XResponseModel }
            // Only do this if it's not already import type or import { type ... }
            const typeImportRegex = /import\s+\{\s*([a-zA-Z0-9_,\s]*(?:ResponseModel|Request)[a-zA-Z0-9_,\s]*)\s*\}\s+from\s+["']([^"']+)["']/g;
            content = content.replace(typeImportRegex, (match, p1, p2) => {
                if (match.includes('import type') || match.includes('type ')) return match;
                modified = true;
                return `import type { ${p1.trim()} } from "${p2}"`;
            });

            // 2. Fix static method calls: Service.getAll -> new Service().getAll
            const serviceCallRegex = /([A-Z][a-zA-Z]+Service)\.(create|update|delete|getAll|getById)\(/g;
            content = content.replace(serviceCallRegex, (match, p1, p2) => {
                modified = true;
                return `new ${p1}().${p2}(`;
            });

            // 3. Fix implicit any in (res) => and (err) =>
            const resRegex = /\(\s*res\s*\)\s*=>/g;
            content = content.replace(resRegex, () => {
                modified = true;
                return `(res: any) =>`;
            });
            const errRegex = /\(\s*err\s*\)\s*=>/g;
            content = content.replace(errRegex, () => {
                modified = true;
                return `(err: any) =>`;
            });

            // 4. Fix EffectiveWeekService import
            if (content.includes('import { EffectiveWeekService }')) {
                content = content.replace('import { EffectiveWeekService }', 'import EffectiveWeekService');
                modified = true;
            }
            if (content.includes('import { ScheduleService }')) {
                content = content.replace('import { ScheduleService }', 'import ScheduleService');
                modified = true;
            }

            // 5. Fix status boolean assignment in forms
            if (fullPath.includes('hook') && (fullPath.includes('useCreate') || fullPath.includes('useUpdate'))) {
                const statusRegex = /status:\s*data\.status\s*,/g;
                content = content.replace(statusRegex, () => {
                    modified = true;
                    return `status: data.status === "active",`;
                });
            }

            if (fullPath.includes('Update') && fullPath.includes('FormCardDialog')) {
                const resetStatusRegex = /status:\s*detail\.status\s*\|\|\s*"active"/g;
                content = content.replace(resetStatusRegex, () => {
                    modified = true;
                    return `status: detail.status ? "active" : "inactive"`;
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
