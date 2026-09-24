const { Project, SyntaxKind } = require("ts-morph");

const project = new Project({
    tsConfigFilePath: "tsconfig.app.json",
});

const sourceFiles = project.getSourceFiles("src/**/*.ts").concat(project.getSourceFiles("src/**/*.tsx"));

for (const sourceFile of sourceFiles) {
    let keepGoing = true;
    let modifiedAny = false;

    while (keepGoing) {
        keepGoing = false;
        
        // Fix Property access in list pages
        if (sourceFile.getFilePath().includes("List/index.tsx")) {
            const dataAccesses = sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression);
            for (const access of dataAccesses) {
                if (access.wasForgotten()) continue;
                const name = access.getName();
                if (name === "id") {
                    access.getNameNode().replaceWithText("id_class_room");
                    keepGoing = true;
                    modifiedAny = true;
                    break;
                }
            }
        }
        if (keepGoing) continue;

        const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
        for (const callExpr of callExpressions) {
            if (callExpr.wasForgotten()) continue;

            const expression = callExpr.getExpression();
            if (expression && expression.getKind() === SyntaxKind.PropertyAccessExpression) {
                const propAccess = expression;
                const innerExpr = propAccess.getExpression();
                if (!innerExpr) continue;
                
                const exprName = innerExpr.getText();
                const methodName = propAccess.getName();

                if (exprName.endsWith("Service") || exprName.endsWith("Service()")) {
                    const args = callExpr.getArguments();
                    
                    if (methodName === "create") {
                        if (args.length === 3) {
                            const payload = args[0].getText();
                            const onSuccess = args[1].getText();
                            const onError = args[2].getText();
                            callExpr.replaceWithText(`${exprName}.${methodName}(${payload}, { onSuccess: ${onSuccess}, onError: ${onError} })`);
                            keepGoing = true;
                            modifiedAny = true;
                            break;
                        }
                    } else if (methodName === "update") {
                        if (args.length === 4) {
                            const id = args[0].getText();
                            const payload = args[1].getText();
                            const onSuccess = args[2].getText();
                            const onError = args[3].getText();
                            callExpr.replaceWithText(`${exprName}.${methodName}(${id}, ${payload}, { onSuccess: ${onSuccess}, onError: ${onError} })`);
                            keepGoing = true;
                            modifiedAny = true;
                            break;
                        }
                    } else if (methodName === "delete") {
                        if (args.length === 3) {
                            const id = args[0].getText();
                            const onSuccess = args[1].getText();
                            const onError = args[2].getText();
                            callExpr.replaceWithText(`${exprName}.${methodName}(${id}, { onSuccess: ${onSuccess}, onError: ${onError} })`);
                            keepGoing = true;
                            modifiedAny = true;
                            break;
                        }
                    } else if (methodName === "getAll") {
                        if (args.length === 2 && !args[0].getText().includes("onSuccess") && !args[1].getText().includes("onSuccess")) {
                            const params = args[0].getText();
                            const onSuccess = args[1].getText();
                            callExpr.replaceWithText(`${exprName}.${methodName}({ onSuccess: ${onSuccess} }, { params: ${params} })`);
                            keepGoing = true;
                            modifiedAny = true;
                            break;
                        } else if (args.length === 3) {
                            const params = args[0].getText();
                            const onSuccess = args[1].getText();
                            const onError = args[2].getText();
                            callExpr.replaceWithText(`${exprName}.${methodName}({ onSuccess: ${onSuccess}, onError: ${onError} }, { params: ${params} })`);
                            keepGoing = true;
                            modifiedAny = true;
                            break;
                        }
                    } else if (methodName === "getById") {
                        if (args.length === 3) {
                            const id = args[0].getText();
                            const onSuccess = args[1].getText();
                            const onError = args[2].getText();
                            callExpr.replaceWithText(`${exprName}.${methodName}(${id}, { onSuccess: ${onSuccess}, onError: ${onError} })`);
                            keepGoing = true;
                            modifiedAny = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    if (modifiedAny) {
        sourceFile.saveSync();
        console.log("Refactored", sourceFile.getFilePath());
    }
}
