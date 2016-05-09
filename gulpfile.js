var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var file = require("gulp-file");
var order = require("gulp-order");
var concat = require("gulp-concat");
var wrapper = require("gulp-wrapper");

gulp.task('default', function () {
    var lib = fs.readFileSync(path.resolve(__dirname, "lib"));
    var libDeclaration = "var lib_d_ts = \"" + lib + "\";";
    
    return gulp.src(["typescript.js", "compiler.js"])
               .pipe(file("lib.ts", libDeclaration))
               .pipe(order([
                    "typescript.js",
                    "lib.ts",
                    "compiler.js",
                ]))
               .pipe(concat("tscc.browser.js"))
               .pipe(wrapper({
                    header : "function compileTypeScript(options) {\n",
                    footer : "\n\treturn compile(options.source);\n}"
                }))
               .pipe(gulp.dest(__dirname));
});

