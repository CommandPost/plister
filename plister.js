var fs = require("fs");
var plist = require("plist");
var JSONPath = require("jsonpath-plus");
var extend = require("extend");

var argv = require('minimist')(process.argv.slice(2), {
  "boolean": true
});

var filename = argv._[0];
var path = argv.path;

var data = plist.parse(fs.readFileSync(filename, 'utf8'));

var options = {
  depth: argv.depth ? argv.depth : 0
};
if (argv.exclude) options.exclude = JSON.parse(fs.readFileSync(argv.exclude, 'utf8'));
if (argv.include) options.include = JSON.parse(fs.readFileSync(argv.include, 'utf8'));

if (argv.verbose) {
  console.log("Options: " + JSON.stringify(options, null, 2));
  console.log("");
}

var obj = data;
if (path) {
  // console.log("Searching path of '" + path + "'");
  obj = JSONPath({json: obj, path: path});
}

if (options.depth) {
  obj = lookup(obj, data.$objects, options.depth, options);
}
console.log(JSON.stringify(obj, null, 2));

function lookup(value, objects, depth, options) {
  if (Array.isArray(value)) {
    var result = [];
    for (var i = 0; i < value.length; i++) {
      result[i] = lookup(value[i], objects, depth, options);
    }
    return result;
  }
  if (value && typeof value == 'object') {
    if (value.CF$UID != undefined && depth > 0) {
      var result = lookup(objects[value.CF$UID], objects, depth-1, options);
      result.$UID = value.CF$UID;
      return result;
    }
    
    var result = {};
    for (var key in value) {
      //console.log('Looking up key "' + key + '"');
      if ((!options.include || options.include.indexOf(key) >= 0) 
        && (!options.exclude || options.exclude.indexOf(key) == -1))
        result[key] = lookup(value[key], objects, depth, options);
    }
    return result;
  }
  
  return value;
}