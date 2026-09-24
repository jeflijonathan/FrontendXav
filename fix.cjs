const fs = require('fs');
const path = require('path');
function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      if (content.includes('from "@types"')) {
        content = content.replace(/from "@types"/g, 'from "@common/types"');
        changed = true;
      }
      if (content.includes('import { ClassService }')) {
        content = content.replace(/import \{ ClassService \} from/g, 'import ClassService from');
        changed = true;
      }
      if (content.includes('import { TeacherSubjectService }')) {
        content = content.replace(/import \{ TeacherSubjectService \} from/g, 'import TeacherSubjectService from');
        changed = true;
      }
      if (content.includes('import { SchoolInformationService }')) {
        content = content.replace(/import \{ SchoolInformationService \} from/g, 'import SchoolInformationService from');
        changed = true;
      }
      if (content.includes('import { MajorService }')) {
        content = content.replace(/import \{ MajorService \} from/g, 'import MajorService from');
        changed = true;
      }
      if (content.includes('import { ClassroomService }')) {
        content = content.replace(/import \{ ClassroomService \} from/g, 'import ClassroomService from');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  });
}
walk('./src');
