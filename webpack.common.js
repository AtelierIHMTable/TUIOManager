const path = require('path');
const fs = require('fs');

const includePaths = [
  fs.realpathSync(`${__dirname}/src`),
  fs.realpathSync(`${__dirname}/core`),
];

const resolvePaths = [
  fs.realpathSync(`${__dirname}/node_modules/`),
];

module.exports = () => (
  {
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: 'tuiomanager.js',
    },
    resolve: {
      extensions: ['.js'],
      modules: resolvePaths,
      enforceExtension: false,
    },
    resolveLoader: {
      modules: resolvePaths,
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          use: [
            {
              loader: 'babel-loader',
              query: {
                babelrc: false,
                presets: [
                  'env',
                ].map(dep => require.resolve(`@babel/preset-${dep}`)),
              },
            },
            {
              loader: 'eslint-loader',
            },
          ],
          include: includePaths,
          exclude: /node_modules/,
        },
        {
          test: /\.json$/,
          loader: 'json',
        },
      ],
    },
    plugins: [],
  }
);
