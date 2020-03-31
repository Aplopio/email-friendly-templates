#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

PY3 = sys.version_info[0] == 3

try:
    from inlinestyler.utils import inline_css
except ImportError:
    sys.stderr.write("inlinestyler is missing. `pip install inlinestyler == 0.2.0`")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.stderr.write("python inlinestyler_cli.py input_file_fullpath.html output_file_fullpath.html")
    else:
        with open(sys.argv[1]) as input_file:
            content = input_file.read()
            output = inline_css(content)

            with open(sys.argv[2], 'w') as output_file:
                if PY3:
                    output_file.write(str(output.decode("utf-8")))
                else:
                    output_file.write(str(output.encode('utf-8')))
        print("completed")
        exit(0)
