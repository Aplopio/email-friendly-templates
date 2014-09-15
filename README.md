# grunt-email-friendly-templates

> Grunt plugin to convert Jade/HTML templates to email friendly templates. Also compiles LESS to CSS if a file is specified.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-email-friendly-templates --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-email-friendly-templates');
```

## Dependencies
This plugin uses LESS compiler v1.3.3 (we'll update this soon)
[https://www.npmjs.org/package/jade](Jade compiler)
[https://github.com/peterbe/premailer](Premailer)

## The "email_friendly_templates" task

### Overview
In your project's Gruntfile, add a section named `email_friendly_templates` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  email_friendly_templates: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
In this example, the `foo.jade` & `foo.less` is compiled to email friendly HTML
template `foo.html`. Internally the specified LESS file is compiled to CSS file before compiling the template.

```jade
// foo.jade
html
  head
    link(rel="stylesheet", href="./foo.css")

  body
    h1 Some heading
    a(href="#") some link
    .container
      .nested-element
        span Some span
```

```less
// foo.less
h1{
    color: red;
}

.container {
    background: red;

    .nested-element {
        border: 1px solid white;
    }
}
```

```html
<!-- compiled foo.html -->
<html>
  <head>
    </head>
  <body>
    <h1 style="color:red">Some heading</h1>
    <a href="#">some link</a>
    <div style="background:red">
      <div style="border:1px solid white"><span>Some span</span></div>
    </div>
  </body>
</html>

```

```js
grunt.initConfig({
  email_friendly_templates: {
    options: {},
    files: {
      // Must be either a Jade file or HTML file
      src: 'foo.jade',
      // Output file path for the compiled HTML, if not specified file is
      // compiled in the same folder
      dest: 'foo.html',
      // If a LESS file path is specified then it is compiled to CSS first
      // before compiling the template. Do not specify this option if the styles
      // are defined in head tag
      less: 'foo.less',
       // If a compiled file already exists then that is overwritten. Default value
       // is false
      overwrite: true
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
