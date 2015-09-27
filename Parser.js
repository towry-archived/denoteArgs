var esprima = require('esprima');

function Parser () {
  this._results = [];
}

module.exports = Parser;

Parser.prototype.parse = function (source) {
  var ast = esprima.parse(source, {
    loc: true
  });

  if (!ast || typeof ast !== 'object') {
    throw new Error("Source could not be parsed");
  }

  this.walkExpressions(ast.body);

  return ast;
}

Parser.prototype.walkExpressions = function (statements) {
  var loc;
  statements.forEach(function (statement) {
    if (statement.type != 'ExpressionStatement') {
      return;
    }

    var expression = statement.expression;

    if (expression.type != 'CallExpression') {
      return;
    }
    if (expression.arguments.length < 3) {
      return;
    }
    if (expression.arguments[0].type != 'Literal') {
      return;
    }
    if (expression.arguments[1].type != 'ArrayExpression') {
      return;
    }
    if (expression.arguments[2].type != 'FunctionExpression') {
      return;
    }

    var result = {};
    result.loc = expression.loc.start;
    result.content = {};

    var deps = expression.arguments[1].elements;
    var args = expression.arguments[2].params;

    if (args.length < deps.length || deps.length === 0) {
      return;
    }

    var n = args.length - 1;
    for (var i = deps.length - 1; i > 0; i--, n--) {
      result.content[deps[i].value] = args[n].name;
    }

    this._results.push(result);
  }.bind(this));
}

Parser.prototype.getResult = function () {
  return this._results;
}
