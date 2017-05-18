var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

/**
 * This is the Webpack configuration file for production.
 */
module.exports = {
  entry: "./src/main",

  output: {
    path: __dirname + "/build/",
    filename: "app.js"
  },

  // plugins: [
  //   new ExtractTextPlugin({filename: 'style.css', allChunks: true }),
  //   new webpack.LoaderOptionsPlugin({
  //     // test: /\.xxx$/, // may apply this only for some modules
  //     options: {
  //       // Additional plugins for CSS post processing using postcss-loader
  //       // postcss:
  //       postcss: [
  //         require('autoprefixer'), // Automatically include vendor prefixes
  //         require('postcss-nested') // Enable nested rules, like in Sass
  //       ]
  //     }
  //   })
  // ],

  plugins: [
    new ProgressBarPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({filename: 'style.css', allChunks: true }),
    new webpack.LoaderOptionsPlugin({
      // test: /\.xxx$/, // may apply this only for some modules
      options: {
        // Additional plugins for CSS post processing using postcss-loader
        // postcss:
        postcss: [
          require('autoprefixer'), // Automatically include vendor prefixes
          require('postcss-nested') // Enable nested rules, like in Sass
        ]
      }
    })
  ],


  // module: {
  //   loaders: [
  //     { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
  //     { test: /\.css$/, loader: ExtractTextPlugin.extract({
  //       fallback:'style-loader', use:'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
  //     }) }
  //   ]
  // },

  // // Necessary plugins for hot load


  // Transform source code using Babel and React Hot Loader
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, loader: ExtractTextPlugin.extract({
        fallback:'style-loader', use:'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      })}
    ]
  },
}
