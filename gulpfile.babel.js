"use strict";
var gulp = require('gulp'),
    del = require('del'),
    pages = require('gulp-gh-pages'),
    rename = require('gulp-rename'),
    fs = require('fs'),
    path = require('path'),
    traceur = require('gulp-traceur'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    es6Path = 'scripts/script.js',
    compilePath = 'scripts/compiled';

var options = {
    dist: './dist/'
};


/* babel test */
gulp.task('traceur', function() {
    return gulp.src([es6Path])
        .pipe(plumber())
        .pipe(traceur({
            blockBinding: true
        }))
        .pipe(gulp.dest(compilePath + '/traceur'));
});

gulp.task('babel', function() {
    return gulp.src([es6Path])
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest(compilePath + '/babel'));
});

gulp.task('watch', function() {
    gulp.watch([es6Path], ['traceur', 'babel']);
});



/* end babel test */

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
            "scripts/*/*/*",
            "scripts/*",
            "img/*.svg"
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
gulp.task("default", ["clean", "traceur", "babel", "watch"], function() {
    gulp.start('build');
});