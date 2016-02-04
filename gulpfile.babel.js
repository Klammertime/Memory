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
      gulpif = require('gulp-if'),
   minifyCss = require('gulp-minify-css'),
      svgmin = require('gulp-svgmin'),
    manifest = require('gulp-appcache'),
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

// SVG optimization task
gulp.task('svg', ['renameImages'], function () {
  return gulp.src(options.src + '/img/*/*')
    .pipe(svgmin())
    .pipe(gulp.dest(options.dist + '/img'));
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
gulp.task('html', ['babel'], function() {
    gulp.src(options.src + '/index.html')
        .pipe(useref())
        // if files end in .js, apply uglify method
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(options.dist));
});


gulp.task('manifest', ['html', 'svg'], function(){
  return gulp.src([options.dist + '/**/*'])
    .pipe(manifest({
  relativePath: options.dist,
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*', '*'],
      filename: 'memory.appcache',
      exclude: 'memory.appcache'
     }))
    .pipe(gulp.dest(options.dist));
});


gulp.task('build', ['manifest'], function() {
    return gulp.src([
            'index.html',
            options.src + 'img/circuit4.svg'
        ], {
            base: options.src
        })
        .pipe(gulp.dest(options.dist));
});

gulp.task('deploy', function() {
    return gulp.src(options.dist + '/**/*')
        .pipe(pages());
});

gulp.task('serve', ['watchFiles']);

// Build task is a dependency of default task so can run command "gulp".
gulp.task('default', ['clean', 'traceur'], function() {
    gulp.start('build');
});