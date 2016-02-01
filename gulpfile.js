"use strict";
var gulp = require('gulp'),
    del = require('del'),
    pages = require('gulp-gh-pages'),
    rename = require('gulp-rename');

var options = {
    dist: './dist/'
};

// var temp = 1;
// var imageFiles = [];

gulp.task('renameImages', function() {
    'img/*'


        gulp.src('img/*/*')

        .pipe(rename({'img/*', suffix: temp}))
        // .pipe(rename({suffix: 'test'}))

        .pipe(gulp.dest('images'));
        temp++;
    // });
});


var imagesPath = 'img/*';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('imagesRename', function() {
   var folders = getFolders(imagesPath);

  folders.map(function(folder, ind) {
      // concat into foldername.js
      // write to output
      // minify
      // rename to folder.min.js
      // write to output again
      // gulp.src(path.join(imagesPath, folder, '/**/*.js'))
        // .pipe(concat(folder + '.js'))
        // .pipe(gulp.dest(scriptsPath))
        // .pipe(uglify())
        .pipe(rename(folder + ind + '.svg'))
        .pipe(gulp.dest('images'));
   });

// var glob = require('glob');
// var path = require('path');

// var modules = ['main-module'];
// var helpers = [];
// var dialogs = [];

// glob.sync("@(helpers|dialogs)/*.js")
// .forEach(function(file) {
//   var module = path.basename(file, path.extname(file))
//   modules.push(module);

//   switch(path.dirname(file)) {
//     case 'helpers':
//       helpers.push(module);
//       break;
//     case 'dialogs':
//       dialogs.push(module);
//       break;
//   }
// });



// // rename via hash
// gulp.src("img/*/*", { base: process.cwd() })
//   .pipe(rename({
//     dirname: "img/*",
//     basename: "aloha",
//     prefix: "bonjour-",
//     suffix: "-hola",
//     extname: ".md"
//   }))
//   .pipe(gulp.dest("images")); //





// // rename via hash
// gulp.src("./src/main/text/hello.txt", { base: process.cwd() })
//   .pipe(rename({
//     dirname: "main/text/ciao",
//     basename: "aloha",
//     prefix: "bonjour-",
//     suffix: "-hola",
//     extname: ".md"
//   }))
//   .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/bonjour-aloha-hola.md



// gulp.task('renameImages', function() {
//     var imageFiles = {
//         'movies': 'img'
//     }

//     Object.keys(imageFiles).forEach(function(key) {
//         gulp.src('img/*')

//         .pipe(rename({prefix:'img/*', suffix: 'test'}))
//         // .pipe(rename({suffix: 'test'}))

//         .pipe(gulp.dest('images'));
//     });
// });


// Create clean task.
gulp.task('clean', function() {
    del(['dist', 'images']);
});

gulp.task("build", ['renameImages'], function() {
    return gulp.src([
            "index.html",
            "memory.appcache",
            "styles/*",
            "images/*",
            "scripts/*"
        ], {
            base: "./"
        })
        .pipe(gulp.dest("dist"));
});

gulp.task('deploy', function() {
    return gulp.src(options.dist + '**/*')
        .pipe(pages());
})

// Build task is a dependency of default task so can run command "gulp".
gulp.task("default", ["clean"], function() {
    gulp.start('build')
});





