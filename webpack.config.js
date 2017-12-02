const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV ? JSON.stringify(process.env.NODE_ENV) : JSON.stringify('development')
const isDev = NODE_ENV === JSON.stringify('development')

const plugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({'process.env': {NODE_ENV}}),
  new ExtractTextPlugin({
    filename: 'bundle.css',
    disable: false,
    allChunks: true,
  }),
  new OptimizeCssAssetsPlugin({
    cssProcessorOptions: {
      preset: ['default', {
        discardComments: {removeAll: true},
        mergeIdents: true,
        calc: false,
      }],
      map: isDev,
    },
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.ProvidePlugin({
    EventSource: 'imports-loader?this=>global!exports-loader?global.EventSource!event-source-polyfill',
  }),
]

let config = {
  entry: {app: path.join(process.cwd(), 'src/index.js')},

  output: {
    path: path.join(process.cwd(), 'static'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: isDev,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {path: './postcss.config.js'},
                sourceMap: isDev,
              },
            },
          ],
        }),
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins,
  devtool: isDev ? 'source-map' : false,
}

module.exports = config
