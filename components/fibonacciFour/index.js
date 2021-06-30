import classes from './fib4.module.css';
import StepsDropdownFilter from './StepsDropdownFilter';
import { code, defaultFilteredSteps } from './constants';
import Interpreter from 'js-interpreter';
import {
  useState,
  useReducer,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';

export default function Fibonacci() {
  const [myInterpreter, setMyInterpreter] = useState(new Interpreter(code));
  const [stepAndRunBtnDisabledAttr, setStepAndRunBtnDisabledAttr] =
    useState('');
  const [currentStep, setCurrentStep] = useState();
  const [stateCounter, setStateCounter] = useState(0);
  const [filteredSteps, setFilteredSteps] = useState(defaultFilteredSteps);

  async function stepButton() {
    setStateCounter(stateCounter + 1);
    const { stateStack } = myInterpreter;
    const currentStack = stateStack[stateStack.length - 1];
    const currentNode = currentStack?.node;
    const currentScope = currentStack.scope.object.properties;
    const stepIsFiltered = filteredSteps.includes(currentNode.type);
    setCurrentStep(currentNode.type);
    // console.log(currentStack);
    if (currentStack.hasOwnProperty('value')) console.warn(currentStack.value);

    setStateCounter(stateCounter + 1);
    let start = stateStack.length ? currentNode.start : 0;
    let end = stateStack.length ? currentNode.end : 0;

    if (!stepIsFiltered) createSelection(start, end);

    const ok = await myInterpreter.step();
    if (!ok) {
      setStepAndRunBtnDisabledAttr('disabled');
    } else {
      if (stepIsFiltered) stepButton();
    }
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
    // consoleLogger([
    //   ['ast', ast],
    //   ['GLOBALObj', globalObject],
    //   ['GLOBALScope', globalScope],
    //   ['stateStack', stateStack],
    //   ['step text', window.getSelection().toString()],
    //   ['start/end text ref', start, end],
    // ]);
  }

  function runButton() {
    setStepAndRunBtnDisabledAttr('disabled');
    if (myInterpreter.run()) {
      // Async function hit.  There's more code to run.
      // There will be a lot of restarts due to regular expressions in Acorn.
      setTimeout(runButton, 0);
    }
  }
  function parseButton() {
    var code = document.getElementById('code').value;
    setStateCounter(0);
    setMyInterpreter(new Interpreter(code));
    setStepAndRunBtnDisabledAttr('');
  }

  return (
    <div>
      <div className={classes.wrapper}>
        <div>
          <p>state counter: {stateCounter}</p>
          <p>Current Step Name: {currentStep}</p>
          <div>
            <StepsDropdownFilter
              onChange={(e) => setFilteredSteps(e.target.value)}
              filteredSteps={filteredSteps}
            />
          </div>
        </div>
        <div>
          <button onClick={parseButton}>Parse</button>
          <button onClick={stepButton} disabled={stepAndRunBtnDisabledAttr}>
            Step
          </button>
          <button onClick={runButton} disabled={stepAndRunBtnDisabledAttr}>
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

const consoleLogger = (items) => {
  items.forEach(([title, data]) => console.log(title, data));
};
