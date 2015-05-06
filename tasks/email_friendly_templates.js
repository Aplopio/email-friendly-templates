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
      is_completed = [],
      path = require('path'),
      cwd = process.cwd(),
      done = this.async(),
      script_path = cwd + '/node_modules/grunt-email-friendly-templates/build-template.sh';

    for(var i = 0; i < this.files.length; i++) {
      is_completed.push(false);
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(f, index, array) {
      var options = f.orig,
          input_filepath = path.resolve(cwd, options.src[0]),
          less_filepath = options.less,
          overwrite = !! options.overwrite,
          output_filepath = options.dest,
          script_arguments = ' -f ' + input_filepath;

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

      exec( 'bash ' + script_path + script_arguments, function(err, stdout, stderr) {
        if ( stdout ) {
          grunt.log.writeln( stdout );
        }

        if ( err || stderr ) {
          grunt.log.warn( ' in ' + input_filepath );
          grunt.log.warn( err || stderr );
        } else {
          grunt.log.writeln('Email friendly templates compilation complete.');
        }
        is_completed[index] = true;
      });
    });
    var intervelId = setInterval(function(){
      var completed = is_completed.reduce(
        function(acc, curr){
          return acc && curr;
        }, true);
      if( completed ) {
        clearInterval(intervelId);
        done();
      } else {
        grunt.log.writeln('Status: ' + is_completed);
      }
    }, 1000);
  });

};
