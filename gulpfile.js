var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var rename = require("gulp-rename");
var wrapper = require("gulp-wrapper");

gulp.task("default", function () {
    return gulp.src(["typescript.js"])
               .pipe(wrapper({
                    footer : "\n\define(\"vs/language/typescript/lib/typescriptServices\", [], function () { return ts; });"
                }))
               .pipe(rename("typescriptServices.js"))
               .pipe(gulp.dest(__dirname));
});



