import SyntaxHighlighter from 'react-syntax-highlighter';
import evaljs from 'evaljs';
import Interpreter from 'js-interpreter';
import {
  useState,
  useReducer,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

// const CODE = `function fib(n) {
//     if(n <= 1) return n;
//     return fib(n-1) + fib(n-2)
// }`;
var code = [
  'var result = [];',
  'function fibonacci(n, output) {',
  '  var a = 1, b = 1, sum;',
  '  for (var i = 0; i < n; i++) {',
  '    output.push(a);',
  '    sum = a + b;',
  '    a = b;',
  '    b = sum;',
  '  }',
  '}',
  'fibonacci(16, result);',
  "alert(result.join(', '));",
].join('\n');
let myInterpreter;
export default function Fibonacci() {
  const classes = useStyles();

  const stepButtonRef = useRef();
  const runButtonRef = useRef();
  const [stepBtnDisableAttr, setStepBtnDisableAttr] = useState('');
  const [runBtnDisableAttr, setRunBtnDisableAttr] = useState('');

  useLayoutEffect(() => {
    const initAlert = (interpreter, globalObject) => {
      var wrapper = function (text) {
        return window.alert(arguments.length ? text : '');
      };
      interpreter.setProperty(
        globalObject,
        'alert',
        interpreter.createNativeFunction(wrapper)
      );
    };
    myInterpreter = new Interpreter(code, initAlert);
    myInterpreter.REGEXP_MODE = 1;
    myInterpreter.run();
    // setInitAlert(initAlert);
  }, []);
  // function initAlert(interpreter, globalObject) {
  //   var wrapper = function (text) {
  //     return window.alert(arguments.length ? text : '');
  //   };
  //   interpreter.setProperty(
  //     globalObject,
  //     'alert',
  //     interpreter.createNativeFunction(wrapper)
  //   );
  // }

  // function initAlert(interpreter, globalObject) {
  //   var wrapper = function (text) {
  //     return alert(arguments.length ? text : '');
  //   };
  //   interpreter.setProperty(
  //     globalObject,
  //     'alert',
  //     interpreter.createNativeFunction(wrapper)
  //   );
  // }

  function stepButton() {
    console.log(myInterpreter);
    if (myInterpreter.stateStack.length) {
      var node =
        myInterpreter.stateStack[myInterpreter.stateStack.length - 1].node;
      var start = node.start;
      var end = node.end;
    } else {
      var start = 0;
      var end = 0;
    }
    createSelection(start, end);
    try {
      var ok = myInterpreter.step();
    } finally {
      if (!ok) {
        disable('disabled');
      }
    }
  }

  function disable(disabled) {
    setStepBtnDisableAttr(disabled);
    setRunBtnDisableAttr(disabled);
  }

  function createSelection(start, end) {
    var field = document.getElementById('code');
    if (field.createTextRange) {
      var selRange = field.createTextRange();
      selRange.collapse(true);
      selRange.moveStart('character', start);
      selRange.moveEnd('character', end);
      selRange.select();
    } else if (field.setSelectionRange) {
      field.setSelectionRange(start, end);
    } else if (field.selectionStart) {
      field.selectionStart = start;
      field.selectionEnd = end;
    }
    field.focus();
    console.log(start, end);
    console.log(window.getSelection().toString());
  }

  function runButton() {
    disable('disabled');
    if (myInterpreter.run()) {
      // Async function hit.  There's more code to run.
      // There will be a lot of restarts due to regular expressions in Acorn.
      setTimeout(runButton, 0);
    }
  }

  function parseButton() {
    var code = document.getElementById('code').value;
    const initAlert = (interpreter, globalObject) => {
      var wrapper = function (text) {
        return window.alert(arguments.length ? text : '');
      };
      interpreter.setProperty(
        globalObject,
        'alert',
        interpreter.createNativeFunction(wrapper)
      );
    };
    myInterpreter = new Interpreter(code, initAlert);
    disable('');
  }

  return (
    <div>
      <div className={classes.wrapper}>
        <div>
          <button onClick={parseButton}>Parse</button>
          <button onClick={stepButton} disabled={stepBtnDisableAttr}>
            Step
          </button>
          <button onClick={runButton} disabled={runBtnDisableAttr}>
            Run
          </button>
        </div>
        <textarea id="code" spellCheck="false" rows={30}>
          {code}
        </textarea>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '5rem',
    // '& div': {
    //   paddingLeft: '1rem',
    // },
  },
  inFrame: {
    background: '#e0fff6',
  },
  param: {
    color: 'red',
    fontWeight: 'bold',
  },
}));
