(function (mod) {
  mod(CodeMirror);
})(function (CodeMirror) {
  'use strict';

  var Pos = CodeMirror.Pos;

  function getData(editor, what) {
    var mode = editor.doc.modeOption;
    if (mode === 'generic') {
      mode = 'text/generic';
    }
    return CodeMirror.resolveMode(mode.name)[what];
  }

  function getText(item) {
    return typeof item === 'string' ? item : item.text;
  }

  function match(string, word) {
    var len = string.length;
    var sub = getText(word).substr(0, len);
    return string.toUpperCase() === sub.toUpperCase();
  }

  function addMatches(result, search, wordlist, formatter) {
    for (var word in wordlist) {
      if (!wordlist.hasOwnProperty(word)) {
        continue;
      }

      if (wordlist.slice) {
        word = wordlist[word];
      }

      if (match(search, word)) {
        result.push(formatter(word));
      }
    }
  }

  CodeMirror.registerHelper('hint', 'generic', function (editor, options) {
    var builtin = getData(editor, 'builtin');
    var cur = editor.getCursor();
    var result = [];
    var token = editor.getTokenAt(cur), start, end, search;
    if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }

    if (token.string.match(/^[.`\w@]\w*$/)) {
      search = token.string;
      start = token.start;
      end = token.end;
    } else {
      start = end = cur.ch;
      search = '';
    }

    addMatches(result, search, builtin, function (w) {
      return w;
    });

    return {
      list: result,
      from: Pos(cur.line, start),
      to: Pos(cur.line, end)
    };
  });
});
