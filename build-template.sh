#!/bin/sh

### Constants
TMP_DIRNAME=".tmp_eft" # @ocd_ppl: eft stands for 'Email Friendly Template'

### Variables
force=
output_file=
less_file=
input_file=
input_file_basename=
input_file_folder=
input_file_extension=
tmp_dir=
tmp_html=
output_css_file=

### Functions
usage()
{
cat << __EOF__

Usage: ./build-template [options] [dir|file ...]

Options:

  -h, --help          output usage information
  -f, --file          input template file, should be either jade or html
  -o, --output        output file to write the compiled html
  -l, --less-file     less file to compile before compiling html, if not specified
                      script will look for the less file in input file directory.
                      If the file doesn't exist in the same directory either, it's ignored.
  --force             Force overwrite the output file if it already exists.

__EOF__
}

validate_input_file()
{
  if [ "$input_file" = "" ]; then
    # 1>&2 redirects the stdout to stderr
    echo "Please specify an input file !" 1>&2
    usage
    exit 1
  fi

  if [ ! -f $input_file ]; then
    echo "The specified input file does not exist !" 1>&2
    exit 1
  fi

  if [ "$input_file_extension" != "jade" ] && [ "$input_file_extension" != "html" ]; then
    echo "Please specify either a html file or a jade template !" 1>&2
    exit 1
  fi
}

clean_up()
{
  if [ "$tmp_dir" != "" ] && [ -d $tmp_dir ]; then
    rm -rf $tmp_dir
  fi

  if [ -f $output_css_file ]; then
    rm -r $output_css_file
  fi
}

less_to_css()
{
  less_file_folder=$(dirname $less_file)
  less_file_basename=$(basename $less_file ".less")
  output_css_file="$less_file_folder/$less_file_basename.css"

  lessc -x $less_file $output_css_file
}

jade_to_html()
{
  tmp_dir="$input_file_folder/$TMP_DIRNAME"
  if [ ! -d tmp_dir ]; then
    mkdir $tmp_dir
  fi
  tmp_html="$tmp_dir/compiled_html_$$_$RANDOM.html"
  prev_dir=$(pwd)

  cd $(dirname $input_file)
  jade -P -p . $input_file > $tmp_html
  if [[ $? != 0 ]]; then
      clean_up
      exit 1
  fi
  cd $prev_dir
}

compile_html()
{
  if [ -f $less_file ]; then
    prev_dir=$(pwd)
    cd $(dirname $less_file)
  fi

  inlinestyler_cli.py $1 $output_file
}

perform_compilation()
{
  # If input file is already compiled & overwriting is not enforced then exit
  if [ -f $output_file ] && [ "$force" != "1" ]; then
    exit
  fi

  if [ -f $less_file ]; then
    less_to_css
  fi

  if [ "$input_file_extension" = "jade" ]; then
    jade_to_html
    compile_html $tmp_html
  else
    compile_html $input_file
  fi

  clean_up
}

### Clean up any temporary files created on receiving terminate signals
trap clean_up SIGHUP SIGINT SIGTERM


### Processing CLI options
while [ "$1" != "" ]; do
  case $1 in
    -f | --file )         shift
                          input_file=$1
                          ;;
    -o | --output )       shift
                          output_file=$1
                          ;;
    -l | --less-file )    shift
                          less_file=$1
                          ;;
    --force )             force=1
                          ;;
    -h | --help )         usage
                          exit
                          ;;
    * )                   usage
                          exit 1
  esac
  shift
done

PATH=$PATH:$(dirname $0)

### Validations
input_file_extension="${input_file##*.}"
validate_input_file $input_file


### Initialization
input_file_basename=$(basename $input_file ".$input_file_extension")
input_file_folder=$(dirname $input_file)

# If less file is not specified in the options then look for the less file in
# same folder with the same basename as input file.
if [ "$less_file" = "" ]; then
  less_file="$input_file_folder/$input_file_basename.less"
fi

# If output file is not specified then compile the output file in the same folder
if [ "$output_file" = "" ]; then
  output_file="$input_file_folder/$input_file_basename.html"
fi


### Main
perform_compilation
