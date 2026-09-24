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

            // 1. Add missing onError to { onSuccess: ... }
            const missingOnErrorRegex = /\{\s*onSuccess:\s*\([^)]*\)\s*=>\s*[^,}]+(?:\}[^,}]*)?\s*\}/g;
            content = content.replace(missingOnErrorRegex, (match) => {
                if (!match.includes('onError')) {
                    modified = true;
                    return match.replace(/}$/, ', onError: () => {} }');
                }
                return match;
            });

            // 2. Revert id_class_room to id if it's not Classroom
            if (fullPath.includes('List\\index.tsx') || fullPath.includes('List/index.tsx')) {
                if (!fullPath.includes('dashboardClassroom')) {
                    const idClassRoomRegex = /id_class_room/g;
                    if (idClassRoomRegex.test(content)) {
                        content = content.replace(idClassRoomRegex, 'id');
                        modified = true;
                    }
                }
            }

            // 3. Fix status boolean mismatch in FormCardDialogs
            // In FormCardDialogs, onSubmit calls handleCreate or handleUpdate:
            // handleCreate({ ...data, status: data.status === "active" })
            if (fullPath.includes('FormCardDialog')) {
                const statusRegex = /status:\s*data\.status\s*,?/g;
                if (statusRegex.test(content)) {
                    content = content.replace(statusRegex, 'status: data.status === "active",');
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed', fullPath);
            }
        }
    });
}
walk('./src');
