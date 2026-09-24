const fs = require('fs');
const path = require('path');
function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('store\\index.ts') || fullPath.endsWith('store/index.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('Filter')) {
        let lines = content.split('\n');
        let newModelLine = '';
        let modelName = '';
        lines.forEach(line => {
          if (line.includes('@api/')) {
            const match = line.match(/import { (.*)ResponseModel/);
            if (match) {
              modelName = match[1].trim() + 'ResponseModel';
              newModelLine = `import { type ${modelName} } from ` + line.split('from ')[1];
            }
          }
        });
        if (modelName) {
          let newContent = `import { create } from "zustand";\n${newModelLine}\ninterface FilterType { page: number; limit: number; search: string; sort: string; order_by: string; }\ninterface PaginationType { total_data: number; total_pages: number; page: number; limit: number; }\n\ninterface State {\n    data: ${modelName}[];\n    isLoading: boolean;\n    filters: FilterType;\n    search: { value: string };\n    pagination: PaginationType;\n}\n\nconst useStore = create<{ state: State; setState: (fn: (p: State) => State) => void }>((set) => ({\n    state: {\n        data: [],\n        isLoading: false,\n        filters: { page: 1, limit: 10, search: "", sort: "created_at", order_by: "desc" },\n        search: { value: "" },\n        pagination: { total_data: 0, total_pages: 1, page: 1, limit: 10 },\n    },\n    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),\n}));\n\nexport default useStore;\n`;
          fs.writeFileSync(fullPath, newContent);
          console.log('Rewritten store:', fullPath);
        }
      }
    }
  });
}
walk('./src');
