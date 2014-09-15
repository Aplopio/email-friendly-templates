/*
 * grunt-email-friendly-templates
 * https://github.com/Aplopio/email-friendly-templates
 *
 * Copyright (c) 2014 Aplopio
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('email_friendly_templates', 'Grunt plugin to convert Jade/HTML templates to email friendly templates. Also compiles LESS to CSS if a file is specified.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        punctuation: '.',
        separator: ', '
      }),
      path = require('path'),
      cwd = process.cwd(),
      script_path = cwd + '/node_modules/grunt-email-friendly-templates/build-template.sh';

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var options = f.orig,
          input_filepath = path.resolve(cwd, options.src[0]),
          less_filepath = options.less,
          overwrite = !! options.overwrite,
          output_filepath = path.resolve(cwd, options.dest),
          script_arguments;

      if (!grunt.file.exists(input_filepath)) {
        grunt.log.warn('Source file "' + input_filepath + '" not found.');
        return;
      }

      script_arguments = ' -f ' + input_filepath + ' -o ' + output_filepath;

      if ( less_filepath ) {
        script_arguments += ' --less-file ' + path.resolve(cwd, less_filepath);
      }

      if ( overwrite ) {
        script_arguments += ' --force ';
      }

      debugger;

      exec( 'sh ' + script_path + script_arguments, function(err, stdout, stderr) {
        if ( err ) {
          grunt.warn( err );
        }
        grunt.log.writeln('Email friendly templates compilation complete.')
      });

    });
  });

};