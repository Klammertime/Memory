'use strict';
var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');

/* gets file gulp.config and gets config, but since the function
* was not executed yet, we execute it here: */
  var config = require('./gulp.config')();
/* Gets plugins as being used creates variable using $.
* name of plugin after 'gulp-',
* TODO: what about ones with a 2nd dash, i think camelcase works */
  var $ = require('gulp-load-plugins')({lazy: true});

// from pluralsight course
gulp.task('vet', function() {
  log('Analyzing source with JSHint and JSCS');

    return gulp
      .src(config.alljs)
      // if we type --verbose in command line
      // it will print, args lets you pass in
      // command line arguments
      .pipe($.if(args.verbose, $.print()))
      .pipe($.jscs())
      .pipe($.jshint())
      // jshint needs a reporter, pass flag verbose true
      // tells w code about error
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function() {
  log('Compiling Sass --> CSS');

  return gulp
      .src(config.sass)
      // plumber good way to keep piping working & show error messages
      .pipe($.plumber())
      .pipe($.scss())
      // get last 2 versions of browsers, and only >5% of the market
      .pipe($.autoprefixer({broswers: ['last 2 versions', '> 5%']}))
      .pipe(gulp.dest(config.temp));
});

// use done as callback so that since styles needs to wait
// for 'clean-styles' to be done first, del takes a 2nd param
// that is a callback fcn seen in cleanFiles
gulp.task('clean-styles', function(done) {
    var files = config.temp + '**/*.css';
    cleanFiles(files, done);
});

gulp.task('sass-watcher', function() {
  gulp.watch([config.sass], ['styles']);
});

gulp.task('wiredep', function() {
  var options = config.getWiredepDefaultOptions(); //TODO
  var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index) //TODO index.html
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client)); //TODO
});

function cleanFiles(path, done) {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path, done); // del has callback as 2nd param
}

gulp.task('renameImages', function() {
  var index = 1;
    return gulp.src(config.client + 'img/*/*')
        .pipe($.rename(function(path) {
            if (index > 10) {
                index = 1;
            }
            path.basename = path.dirname + index++;
        }))
        .pipe(gulp.dest(config.client + 'img'));
});

// SVG optimization task
gulp.task('svg', ['renameImages'], function () {
  return gulp.src(config.client + 'img/*/*')
    .pipe($.svgmin())
    .pipe($.flexSvg())

    .pipe(gulp.dest(config.dist + '/img'));
});

gulp.task('babel', function() {
    return gulp.src([config.es6Path])
        .pipe($.plumber())
        .pipe($.babel())
        .pipe(gulp.dest(config.compilePath + 'babel'));
});

// Create clean task.
gulp.task('clean', function() {
    return del([config.dist]);
});

// Takes html file and runs through useref, tells html
// what script and style files have based on index.html
gulp.task('html', ['babel'], function() {
    return gulp.src(config.client + 'index.html', {since: $.memoryCache.lastMtime('js')})
        .pipe($.useref())
        .pipe($.if('*.js', $.cached('linting')))
        .pipe($.if('*.js', $.jshint()))
        .pipe($.if('*.js', $.jshint.reporter()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(gulp.dest(config.dist));
});

// gulp.task('watchFiles', function() {
//     return gulp.watch(es6Path)
//         .on('change', $.cache.update('js'));
// });

// gulp.task('manifest', ['svg', 'html'], function(){
//   return gulp.src([config.dist + '/**/*'])
//     .pipe(manifest({
//   relativePath: './',
//       hash: true,
//       preferOnline: true,
//       network: ['http://*', 'https://*', '*', 'http://*.*.*/*/*', 'https://*.*/*/*/*'],
//       filename: 'memory.appcache',
//       exclude: 'memory.appcache'
//      }))
//     .pipe(gulp.dest(config.dist));
// });


gulp.task('build', ['svg', 'html'], function() {
    return gulp.src([
        ], {
            base: config.client
        })
        .pipe($.buster())
        .pipe(gulp.dest(config.dist));
});

gulp.task('deploy', function() {
    return gulp.src(config.dist + '/**/*')
    .pipe($.ghPages());
});

gulp.task('serve', function() {
  startBrowserSync();
});

function startBrowserSync() {
  // check to see if it's already running, several tabs open etc
  if($.browserSync.active) {
    return;
  }

  log('Starting browser-sync on port' + port);

  var options = {
    proxy: 'localhost:' + port,
    port: 3000,
    // were saying watch anything that moves, but limiting
    // it to client folder - wait, i don't have a client
    // folder or do I?
    files: [config.client + '**/**.*'],
      ghostMode: {
        clicks: true,
        location: false,
        forms: true,
        scroll: true
      },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    // have to watch some files and load after them
    reloadDelay: 1000
  };
}

////////////
// Logging method that's reusable
function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
          $.util.log($.util.colors.blue(msg[item]));
      }
    }
   } else {
      $.util.log($.util.colors.blue(msg));
   }
}


// Build task is a dependency of default task so can run command "gulp".
gulp.task('default', ['clean'], function() {
    gulp.start('build');
});