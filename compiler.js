
function reportDiagnostic(diagnostic) {
    var output = "";
    var newLine = ts.getNewLineCharacter({});
    if (diagnostic.file) {
        var loc = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
        output += diagnostic.file.fileName + "(" + (loc.line + 1) + "," + (loc.character + 1) + "): ";
    }
    var category = ts.DiagnosticCategory[diagnostic.category].toLowerCase();
    output += category.toLowerCase() + " TS" + diagnostic.code + ": " + flattenDiagnosticMessageText(diagnostic.messageText, newLine) + newLine;
    return output;
}

function flattenDiagnosticMessageText(messageText, newLine) {
    if (typeof messageText === "string") {
        return messageText;
    }
    else {
        var diagnosticChain = messageText;
        var result = "";
        var indent = 0;
        while (diagnosticChain) {
            if (indent) {
                result += newLine;
                for (var i = 0; i < indent; i++) {
                    result += "  ";
                }
            }
            result += diagnosticChain.messageText;
            indent++;
            diagnosticChain = diagnosticChain.next;
        }
        return result;
    }
}

function reportDiagnostics(diagnostics) {
    var result = [];
    var newLine = ts.getNewLineCharacter({});

    for (var i = 0; i < diagnostics.length; i++) {
        result.push(reportDiagnostic(diagnostics[i]));
    }

    return result.join(newLine);
}
function compile(input) {
    var options = {
        noEmitOnError: true,
        emitInterfaces: true,
        emitAnnotations: true,
        emitOneSideEnum: true,
        isolatedModules: false,
        target: ts.ScriptTarget.ES5,
        allowNonTsExtensions: true,
        module: ts.ModuleKind.CommonJS
    };

    var transpileOptions = { reportDiagnostics: true };
    var inputFileName = transpileOptions.fileName || "input.ts";
    var sourceFile = ts.createSourceFile(inputFileName, input, options.target);
    var libSourceFile = ts.createSourceFile("lib.d.ts", lib_d_ts, options.target);
    if (transpileOptions.moduleName) {
        sourceFile.moduleName = transpileOptions.moduleName;
    }
    sourceFile.renamedDependencies = transpileOptions.renamedDependencies;
    var newLine = ts.getNewLineCharacter(options);
    var outputText;
    var sourceMapText;
    var compilerHost = {
        getSourceFile: function (fileName, target) { return fileName === ts.normalizeSlashes(inputFileName) ? sourceFile : libSourceFile; },
        writeFile: function (name, text, writeByteOrderMark) {
            if (ts.fileExtensionIs(name, ".map")) {
                ts.Debug.assert(sourceMapText === undefined, "Unexpected multiple source map outputs for the file '" + name + "'");
                sourceMapText = text;
            }
            else {
                ts.Debug.assert(outputText === undefined, "Unexpected multiple outputs for the file: " + name);
                outputText = text;
            }
        },
        getDefaultLibFileName: function () { return libSourceFile.fileName; },
        useCaseSensitiveFileNames: function () { return false; },
        getCanonicalFileName: function (fileName) { return fileName; },
        getCurrentDirectory: function () { return ""; },
        getNewLine: function () { return newLine; },
        fileExists: function (fileName) { return fileName === inputFileName; },
        readFile: function (fileName) { return ""; }
    };

    var program = ts.createProgram([inputFileName], options, compilerHost);
    var emitResult = program.emit();
    var diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    return { result: outputText, diagnostics: reportDiagnostics(diagnostics), sourceMapText: sourceMapText };
}