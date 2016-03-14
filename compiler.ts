import * as path from "path";
import * as ts from "typescript";
import {readFileSync, readdirSync, statSync} from "fs";

const fileNames = [];
declare var process: any;
declare var console: any;
let currentDirPath = path.resolve(__dirname, "tests");

readdirSync(currentDirPath)
    .filter(function (file) { return path.extname(file) === '.ts'; })
    .forEach(function (file) {
        var filePath = path.join(currentDirPath, file);
        var stat = statSync(filePath);

        if (stat.isFile()) {
            fileNames.push(filePath);
        }
    });

export function compile(fileNames: string[], options: ts.CompilerOptions): void {
    let exitCode: number;
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();

    ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
      .forEach(diagnostic => {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      });

    exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Process exiting with code '${exitCode}'.`);
    process.exit(exitCode);
}

compile(fileNames, {
    out: "sagi.js",
    noEmitOnError: true,
    noImplicitAny: false,
    removeComments: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});