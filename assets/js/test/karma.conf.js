module.exports = function (config) {
  config.set({
    basePath:      '../..',
    frameworks:    ['jasmine', 'browserify'],
    files:         [
      {pattern: 'js/test/karma.conf.js', watched: false, included: false},
      {pattern: 'js/directives/*.js', watched: true, included: false},
      {pattern: 'js/services/*.js', watched: true, included: false},
      {pattern: 'js/modules/*.js', watched: true, included: false},
      'js/bootstrap.js',
      '../vendor/d3/d3.js',
      '../vendor/angular-mocks/angular-mocks.js',
      'js/test/unit/**/*.js'
    ],
    preprocessors: {
      'js/bootstrap.js': ['browserify']
    },
    browserify:    {
      debug: true
    },
    autoWatch:     true,
    browsers:      ['Chrome'],
    plugins:       [
      'karma-browserify',
      'karma-chrome-launcher',
      'karma-jasmine'
    ]
  });
};
