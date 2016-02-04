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
      useref = require('gulp-useref'),
      uglify = require('gulp-uglify'),
         iff = require('gulp-if'),
        csso = require('gulp-csso'),
     es6Path = 'src/scripts/script.js',
 compilePath = 'src/scripts/compiled';

var options = {
    dist: 'dist',
    src: 'src'
};



var index = 1;

gulp.task('renameImages', function() {
    return gulp.src(options.src + '/img/*/*')
        .pipe(rename(function(path) {
            if (index > 10) {
                index = 1;
            }
            path.basename = path.dirname + index++;
        }))
        .pipe(gulp.dest(options.src + '/img'));
});

gulp.task('watchFiles', function() {
    gulp.watch([es6Path], ['traceur', 'babel']);
});

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

// Create clean task.
gulp.task('clean', function() {
    return del([options.dist]);
});

// Takes html file and runs through useref, tells html
// what script and style files have based on index.html
gulp.task('html', function() {
    gulp.src(options.src + '/index.html')
        // if files end in .js, apply uglify method
        .pipe(iff('*.js', uglify()))
        // if files end in .css, applu csso
        .pipe(iff('*.css', csso()))
        .pipe(useref())
        .pipe(gulp.dest(options.dist));
});

gulp.task('build', ['renameImages', 'html'], function() {
    return gulp.src([
            'index.html',
            options.src + '/memory.appcache',
            options.src + '/img/*/*',
            options.src + '/img/*.svg'
        ], {
            base: options.src
        })
        .pipe(gulp.dest(options.dist));
});

gulp.task('deploy', function() {
    return gulp.src(options.dist + '**/*')
        .pipe(pages());
});

gulp.task('serve', ['watchFiles']);

// Build task is a dependency of default task so can run command "gulp".
gulp.task('default', ['clean', 'traceur', 'babel'], function() {
    gulp.start('build');
});