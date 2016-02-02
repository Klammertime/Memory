"use strict";
var gulp = require('gulp'),
    del = require('del'),
    pages = require('gulp-gh-pages'),
    rename = require('gulp-rename'),
    fs = require('fs'),
    path = require('path');

var options = {
    dist: './dist/'
};

var index = 1;

gulp.task('renameImages', function() {
    return gulp.src('img/*/*')
            .pipe(rename(function(path) {
                if (index > 10) {
                    index = 1;
                }
                path.basename = path.dirname + index++;
            }))
            .pipe(gulp.dest('img'));
});

// Create clean task.
gulp.task('clean', function() {
   return del(['dist']);
});

gulp.task("build", ['renameImages'], function() {
    return gulp.src([
            "index.html",
            "memory.appcache",
            "styles/*",
            "img/*/*",
            "scripts/*"
        ], {
            base: "./"
        })
        .pipe(gulp.dest("dist"));
});

gulp.task('deploy', function() {
    return gulp.src(options.dist + '**/*')
        .pipe(pages());
});

// Build task is a dependency of default task so can run command "gulp".
gulp.task("default", ["clean"], function() {
    gulp.start('build');
});