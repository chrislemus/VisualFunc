import SyntaxHighlighter from 'react-syntax-highlighter';
import evaljs from 'evaljs';
import classes from './fib4.module.css';

import Interpreter from 'js-interpreter';
import {
  useState,
  useReducer,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';

var code = [
  'function fib(n) {',
  ' if(n <= 1) return n;',
  ' return fib(n-1) + fib(n-2)',
  '};',
  'fib(2)',
].join('\n');

let myInterpreter;
export default function Fibonacci() {
  const stepButtonRef = useRef();
  const runButtonRef = useRef();
  const [currentNodeType, setCurrentNodeType] = useState();
  const [nodeTypes, setNodeTypes] = useState(new Set());
  const [stateCounter, setStateCounter] = useState(0);
  const [stepBtnDisableAttr, setStepBtnDisableAttr] = useState('');
  const [runBtnDisableAttr, setRunBtnDisableAttr] = useState('');

  useLayoutEffect(() => {
    myInterpreter = new Interpreter(code);
    myInterpreter.REGEXP_MODE = 1;
    myInterpreter.run();
  }, []);
  const filteredSteps = new Set([
    'EmptyStatement',
    'Program',
    'FunctionDeclaration',
  ]);
  function stepButton() {
    const { stateStack } = myInterpreter;
    const nodeType = stateStack[stateStack.length - 1].node.type;
    if (!nodeTypes.has(nodeType)) {
      let types = nodeTypes;
      types.add(nodeType);
      setNodeTypes(types);
    }
    setCurrentNodeType(nodeType);
    console.log(nodeTypes);
    setStateCounter(stateCounter + 1);

    if (myInterpreter.stateStack.length) {
      var node =
        myInterpreter.stateStack[myInterpreter.stateStack.length - 1].node;
      var start = node.start;
      var end = node.end;
    } else {
      var start = 0;
      var end = 0;
    }

    if (!filteredSteps.has(nodeType)) {
      createSelection(start, end);
    }
    try {
      var ok = myInterpreter.step();
    } finally {
      if (!ok) {
        disable('disabled');
      } else {
        if (filteredSteps.has(nodeType)) stepButton();
      }
    }
  }

  function disable(disabled) {
    setStepBtnDisableAttr(disabled);
    setRunBtnDisableAttr(disabled);
  }

  function createSelection(start, end) {
    const { ast, globalObject, globalScope, stateStack } = myInterpreter;

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

    console.log('ast', ast);
    console.log('GLOBALObj', globalObject);
    console.log('GLOBALScope', globalScope);
    console.log('stateStack', stateStack);
    console.log(myInterpreter);
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

    myInterpreter = new Interpreter(code);
    disable('');
  }

  return (
    <div>
      <div className={classes.wrapper}>
        <div>
          <p>state counter: {stateCounter}</p>
          <p>node type: {currentNodeType}</p>
          <button onClick={() => setStateCounter(0)}>
            reset state counter
          </button>
        </div>
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
