var fs = require("fs");
var os = require("os");
var path = require("path");
var child_process = require("child_process");
var emitterPartialPath = "src/compiler/emitter.ts";
var programPartialPath = "src/compiler/program.ts";
var emitterPath = path.resolve(__dirname, emitterPartialPath);
var programPath = path.resolve(__dirname, programPartialPath);
var typeScriptRootPath = path.resolve(__dirname, "TypeScript/");
var typeScriptEmitterPath = path.resolve(typeScriptRootPath, emitterPartialPath);
var typeScriptProgramPath = path.resolve(typeScriptRootPath, programPartialPath);
var tsResolvedJakefile = path.resolve(typeScriptRootPath, "jakefile.js");
var tsCommand = "jake --directory " + typeScriptRootPath + " --f " + tsResolvedJakefile;

task("copy-files", [], function () {
    jake.cpR(emitterPath, typeScriptEmitterPath);
    jake.cpR(programPath, typeScriptEmitterPath);
});

desc("clean the built/local folder using the clean task and builds back typescript services");
task("build-typescript", ["clean-typescript", "typescript-local"]);

task("clean-typescript", function () {
    jake.createExec([tsCommand + " clean"]).run();
});

task("build-typescript-local", function () {
    jake.createExec([tsCommand + " local"]).run();
});

task("copy-to-node", function () {
    var source = path.resolve(typeScriptRootPath, "built/local");
    var target = path.resolve(__dirname, "node_modules/typescript/lib");
    
    jake.rmRf(target);
    jake.cpR(source, target);
});

desc("patches the emitter.ts and builds typescript services")
task("build", ["copy-files", "clean-typescript", "build-typescript-local", "copy-to-node"], { async: false });