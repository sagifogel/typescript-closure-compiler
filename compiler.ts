import * as path from "path";
import * as ts from "typescript";
import {readFileSync, readdirSync, statSync} from "fs";

const fileNames = [];
declare var process: any;
declare var console: any;
let currentDirPath = path.resolve("D:/Github/TSFunq/", "src");
//let currentDirPath = path.resolve(__dirname, "tests");

readdirSync(currentDirPath)
    .filter(function (file) { return path.extname(file) === '.ts'; })
    .forEach(function (file) {
        var filePath = path.join(currentDirPath, file);
        var stat = statSync(filePath);

        if (stat.isFile()) {
            fileNames.push(filePath);
        }
    });

class LanguageServiceHost implements ts.LanguageServiceHost {
    log = _ => { };
    trace = _ => { };
    error = _ => { };
    getScriptIsOpen = _ => true;
    getCurrentDirectory = () => "";
    getDefaultLibFileName = _ => "lib";
    addFile(fileName: string, body: string) {
        var snap = ts.ScriptSnapshot.fromString(body);
        snap.getChangeRange = _ => undefined;
        var existing = this.files[fileName];
        if (existing) {
            this.files[fileName].ver++;
            this.files[fileName].file = snap
        } else {
            this.files[fileName] = { ver: 1, file: snap };
        }
    }
    getCompilationSettings = ts.getDefaultCompilerOptions;
    getScriptSnapshot = fileName => this.files[fileName].file;
    getScriptVersion = fileName => this.files[fileName].ver.toString();
    getScriptFileNames(): string[] {
        var names: string[] = [];
        for (var name in this.files) {
            if (this.files.hasOwnProperty(name)) {
                names.push(name);
            }
        }
        return names;
    }
    files: { [fileName: string]: { file: ts.IScriptSnapshot; ver: number } } = {}
}

class CompilerHost extends LanguageServiceHost implements ts.CompilerHost {
    getNewLine = () => "\n";
    useCaseSensitiveFileNames = () => true;
    getCanonicalFileName = (fileName: string) => fileName;
    readFile = (fileName: string) => ts.sys.readFile(fileName);
    fileExists = (fileName: string) => ts.sys.fileExists(fileName);
    writeFile = (fileName, content) => ts.sys.writeFile(fileName, content);
    getSourceFile(filename: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile {
        var f = this.files[filename];
        if (!f) return null;
        var sourceFile = ts.createLanguageServiceSourceFile(filename, f.file, ts.ScriptTarget.ES5, f.ver.toString(), true);
        return sourceFile;
    }
}

export function compile(fileNames: string[], options: ts.CompilerOptions): void {
    var program = ts.createProgram(fileNames, options);
    var emitResult = program.emit();
    var allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        var { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    });

    var exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Process exiting with code '${exitCode}'.`);
    process.exit(exitCode);
}

compile(fileNames, {
    noEmitOnError: true,
    noImplicitAny: false,
    removeComments: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});