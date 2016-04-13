/* A module to take care of a variety of settings we'll use
* for our gulpfile. Key is to comment these well!
*/

module.exports = function() {
  var client = './src/client/'; // DRY
  var clientApp = client + 'app/';
  var scripts = './src/client/scripts/'; // DRY
  var config = {
    temp:'./.tmp/',
    // all js to vet, refer to it as config.alljs
    /**
     * Files paths
     * @type {Array}
     */
    alljs: [
      './src/**/*.js',
      // gets anything at root such as gulpfile.js
      './*.js'
    ],
    client: client,
    index: client + 'index.html',
    js: [
        clientApp + '**/*.module.js', // I don't have one
        clientApp + '**/**.js',
        '!' + clientApp + '**/*.spec.js' // don't get these files
    ],
    dist: 'dist',
    src: 'src',
    sass: client + 'styles/styles.scss',
    es6Path: scripts + 'script.js',
    compilePath: scripts + 'compiled/',

    /**
     * Bower and NPM locations
     */
    // bower: {
    //     json: require('./bower.json'),
    //     directory: './bower_components/',
    //     ignorePath: '../..'
    // }
  };

  config.getWiredepDefaultOptions = function() {
      var options = {
          // bowerJson: config.bower.json,
          directory: config.bower.directory,
          ignorePath: config.bower.ignorePath
      };
      return options
  };
  return config;
};