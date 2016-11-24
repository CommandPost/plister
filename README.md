# plister
A simple node.js script that helps with parsing FCPX Clipboard plist files into more readable JSON files.

# Usage
1. Check out this project
2. Run:
```node plister.js <filename> [options]```

#Options
* ```--depth=X``` - where 'X' is the number of CF$UID references to expand to. Defaults to 0.
* ```--include=<filename>``` - where <filename> is the path to a JSON file which contains an array of keys to exclude from output.
* ```--exclude=<filename>``` - where <filename> is the path to a JSON file which contains an array of keys to include in the output.
* ```--path=<JSON Path>``` - where <JSON Path> is the [JSON Path](http://goessner.net/articles/JsonPath/) to identify the starting node of the object graph. The leading '$.' is optional. e.g. '$top.root'

#Examples

List the contents of the ```$top``` element down to 5 CF$UID references:

~~~ node plister.js myfile.plist --depth=5 ~~~
