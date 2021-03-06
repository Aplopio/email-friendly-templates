/*
 * grunt-email-friendly-templates
 * https://github.com/Aplopio/email-friendly-templates
 *
 * Copyright (c) 2014 Aplopio
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').execSync;

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
      done = this.async(),
      script_dir = (this.data.script_dir || cwd) + '/node_modules/grunt-email-friendly-templates',
      script_path =  script_dir  + '/build-template.sh';

    // Iterate over all specified file groups.
    this.files.forEach(function(f, index, array) {
      var options = f.orig,
          input_filepath = path.resolve(cwd, options.src[0]),
          less_filepath = options.less,
          overwrite = !! options.overwrite,
          output_filepath = options.dest,
          script_arguments = ' -f ' + input_filepath + ' -s ' + path.resolve(script_dir);

      if (!grunt.file.exists(input_filepath)) {
        grunt.log.warn('Source file "' + input_filepath + '" not found.');
        return;
      }

      if ( output_filepath ) {
        script_arguments += ' -o ' + path.resolve(cwd, output_filepath);
      }

      if ( less_filepath ) {
        script_arguments += ' --less-file ' + path.resolve(cwd, less_filepath);
      }

      if ( overwrite ) {
        script_arguments += ' --force ';
      }

      exec( 'bash ' + script_path + script_arguments, {stdio:[0,1,2]});
      grunt.log.writeln(options.src[0] + ' compilation complete.');

    });

  });

};
