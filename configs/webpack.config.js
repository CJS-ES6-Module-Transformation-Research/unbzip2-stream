/* eslint-disable no-sync */
/* eslint-disable global-require */
(function() {

  'use strict';
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  const nodeExternals = require('webpack-node-externals');
  const path = require('path');
  const fs = require('fs');

  if(!fs.existsSync('./webpack-bundles')) {
    fs.mkdirSync('./webpack-bundles');
  }

  const pkg = JSON.parse(fs.readFileSync('./package.json'));

  const config = {
    entry: path.resolve(__dirname, '..', pkg.main),
    mode: 'production',
    output: {
      path: path.resolve(__dirname, '..', 'webpack-bundles'),
      filename: process.env.NODE_ENV + '.js',
    },
    externals: [nodeExternals()],
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'json',
        reportFilename: process.env.NODE_ENV + '.json',
        openAnalyzer: false
      })
    ],
    optimization: {
      usedExports: true,
      providedExports: true,
    }
  };

  module.exports = config

}());