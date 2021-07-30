/* eslint-disable no-sync */
/* eslint-disable global-require */
(function () {

  'use strict';

  const nodeResolve = require('@rollup/plugin-node-resolve').nodeResolve;
  const commonjs = require('@rollup/plugin-commonjs');
  const fs = require('fs');

  if(!fs.existsSync('./rollup')) {
    fs.mkdirSync('./rollup');
  }

  const pkg = JSON.parse(fs.readFileSync('./package.json'));
  const config = {
    input: pkg.main,
    output: {},
    plugins: [nodeResolve()],
    external: []// Object.keys(pkg.dependencies || {})
  };

  //CJS VESION
  if(process.env.NODE_ENV === 'preprocessed') {
    
    config.output = {
      file: 'rollup/preprocessed.cjs.js',
      format: 'cjs'
    };
    config.plugins.push(commonjs());
  
  } else if(process.env.NODE_ENV === 'transformed') {
    
    config.output = {
      file: 'rollup/transformed.es.js',
      format: 'es'
    };
  
  } else {
    
    config.output = {
      file: 'rollup/default.cjs.js',
      format: 'cjs'
    };
    config.plugins.push(commonjs());

  }

  module.exports = config;

}())
