(function (mod) {
  mod(CodeMirror);
})(function (CodeMirror) {
  'use strict';

  CodeMirror.defineMode('generic', function (config, parserConfig) {
    'use strict';

    var atoms = parserConfig.atoms || {};
    var builtin = parserConfig.builtin || {};

    function tokenBase(stream, state) {
      var ch = stream.next();

      // call hooks from the mime type
      /*if (hooks[ch]) {
       var result = hooks[ch](stream, state);
       if (result !== false) return result;
       }*/

      stream.eatWhile(/^[_\w\d]/);
      var word = stream.current().toLowerCase();

      if (atoms.hasOwnProperty(word)) {
        return 'string';
      }

      if (builtin.hasOwnProperty(word)) {
        return 'builtin';
      }

      return null;
    }

    return {
      startState: function () {
        return {tokenize: tokenBase, context: null};
      },

      token: function (stream, state) {
        if (stream.sol()) {
          if (state.context && state.context.align == null) {
            state.context.align = false;
          }
        }
        if (stream.eatSpace()) {
          return null;
        }

        var style = state.tokenize(stream, state);
        return style;
      },

      indent: function (state, textAfter) {
        var cx = state.context;
        if (!cx) {
          return CodeMirror.Pass;
        }

        var closing = textAfter.charAt(0) == cx.type;
        if (cx.align) {
          return cx.col + (closing ? 0 : 1);
        } else {
          return cx.indent + (closing ? 0 : config.indentUnit);
        }
      },

      blockCommentStart: '/*',
      blockCommentEnd: '*/',
      lineComment: null
    };
  });

  (function () {
    'use strict';

    function set(str) {
      var obj = {}, words = str.split(' ');

      for (var i = 0; i < words.length; ++i) {
        obj[words[i]] = true;
      }

      return obj;
    }

    CodeMirror.defineMIME('text/generic', {
      name: 'generic',
      keywords: set(''),
      builtin: set('good bad foo bar'),
      atoms: set('false true null unknown'),
      operatorChars: /^[>]/
    });

  }());
});
