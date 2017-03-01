/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {

  /*
   * Cache generated modules and chunks to improve performance for multiple incremental builds.
   * This is enabled by default in watch mode.
   * You can pass false to disable it.
   *
   * See: http://webpack.github.io/docs/configuration.html#cache
   */
   //cache: false,

  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {

    /*
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     */
    extensions: ['', '.ts', '.js', '.json'],

    // Make sure root is src
    root: helpers.root('src'),
    // aliases
    alias: {
      samUIKit: helpers.root('src') + '/ui-kit',
      samDirectives: helpers.root('src') + '/ui-kit/directives',
      samComponents: helpers.root('src') + '/ui-kit/components',
      samElements: helpers.root('src') + '/ui-kit/elements',
      samFormControls: helpers.root('src') + '/ui-kit/form-controls',
      samFormTemplates: helpers.root('src') + '/ui-kit/form-templates',
      samPipes: helpers.root('src') + '/ui-kit/pipes',
      samWrappers: helpers.root('src') + '/ui-kit/wrappers'
    },
    // remove other default values
    modulesDirectories: ['node_modules'],

  },

  /*
   * Options affecting the normal modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    loaders: []
  },
  plugins: [],
  /*
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: 'window',
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

};
