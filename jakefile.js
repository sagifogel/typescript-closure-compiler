var fs = require("fs");
var os = require("os");
var path = require("path");
var child_process = require("child_process");
var corePartialPath = "src/compiler/core.ts";
var emitterPartialPath = "src/compiler/emitter.ts";
var programPartialPath = "src/compiler/program.ts";
var checkerPartialPath = "src/compiler/checker.ts";
var utilitiesPartialPath = "src/services/utilities.ts";
var commandLineParserPartialPath = "src/compiler/commandLineParser.ts";
var corePath = path.resolve(__dirname, corePartialPath);
var emitterPath = path.resolve(__dirname, emitterPartialPath);
var programPath = path.resolve(__dirname, programPartialPath);
var checkerPath = path.resolve(__dirname, checkerPartialPath);
var utilitiesPath = path.resolve(__dirname, utilitiesPartialPath);
var commandLineParserPath = path.resolve(__dirname, commandLineParserPartialPath);
var typeScriptRootPath = path.resolve(__dirname, "TypeScript/");
var typeScriptCorePath = path.resolve(typeScriptRootPath, corePartialPath);
var typeScriptEmitterPath = path.resolve(typeScriptRootPath, emitterPartialPath);
var typeScriptProgramPath = path.resolve(typeScriptRootPath, programPartialPath);
var typeScriptCheckerPath = path.resolve(typeScriptRootPath, checkerPartialPath);
var typeScriptUtilitiesPath = path.resolve(typeScriptRootPath, utilitiesPartialPath);
var typeScriptCommandLineParserPath = path.resolve(typeScriptRootPath, commandLineParserPartialPath);
var tsResolvedJakefile = path.resolve(typeScriptRootPath, "jakefile.js");
var tsCommand = "jake --directory " + typeScriptRootPath + " --f " + tsResolvedJakefile;

task("copy-files", [], function () {
    jake.cpR(corePath, typeScriptCorePath);
    jake.cpR(emitterPath, typeScriptEmitterPath);
    jake.cpR(programPath, typeScriptProgramPath);
    jake.cpR(checkerPath, typeScriptCheckerPath);
    jake.cpR(utilitiesPath, typeScriptUtilitiesPath);
    jake.cpR(commandLineParserPath, typeScriptCommandLineParserPath);
}, { async: false });

task("build-ts", function () {
    jake.createExec([tsCommand + " release local"]).run();
}, { async: false });

task("copy-to-local", function () {
    var source = path.resolve(typeScriptRootPath, "built/local/typescript.js");
    
    jake.cpR(source, __dirname);
}, { async: false });

desc("patches the emitter/program.ts and builds typescript services")
task("build", ["copy-files", "build-ts", "copy-to-local"], { async: false });