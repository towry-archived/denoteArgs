#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var Parser = require('./Parser');

if (process.argv.length < 3) {
  console.log("[ERROR] => missing the input file");
  process.exit(-1);
}

var parser = new Parser();

var file = path.resolve(process.argv[2]);
var name = path.parse(file).name;
var dir = path.parse(file).dir;

var source = fs.readFileSync(process.argv[2], {encoding: 'utf-8'});
parser.parse(source);

write(parser.getResult());

function write(results) {
  var input = fs.createReadStream(file);
  var output = fs.createWriteStream(path.resolve(path.join(dir, name + '.pretty.js')));
  var result = results.shift();
  var lineno = 0;

  input.on('data', function (data) {
    var oldoffset = 1, offset = 0, index = -1;
    do {
      index = data.indexOf('\n', offset);
      if (index != -1 && result) {
        oldoffset = offset;
        offset = index + 1;
        lineno += 1;

        if (lineno == result.loc.line) {
          var b = content(result.content);
          if (!b.length) {
            result = results.shift();
            continue;
          } 
          output.write(b);
        }
        output.write(data.slice(oldoffset, offset))
      } else {
        output.write(data.slice(offset));
        break;
      }
    } while (index != -1);
  })

  input.on('end', function () {
    output.end();
  })
}

/**
 * @return {Buffer}
 */
function content(contentStruct) {
  var start = '/**\n';
  Object.keys(contentStruct).forEach(function (key) {
    start += ' * ' + key + ': ' + contentStruct[key] + '\n';
  })
  if (start === '/**\n') return '';
  start += ' */\n'; 
  return new Buffer(start);
}
