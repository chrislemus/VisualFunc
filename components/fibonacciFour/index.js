import classes from './fib4.module.css';
import StepsDropdownFilter from './StepsDropdownFilter';
import { code as defaultCode, defaultFilteredSteps } from './constants';
import Interpreter from 'js-interpreter';
import {
  useState,
  useReducer,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';

export default function Fibonacci() {
  const [code, setCode] = useState(defaultCode);
  const [myInterpreter, setMyInterpreter] = useState(new Interpreter(code));
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [stepAndRunBtnDisabledAttr, setStepAndRunBtnDisabledAttr] =
    useState('');
  const [currentStep, setCurrentStep] = useState();
  const [stateCounter, setStateCounter] = useState(0);
  const [filteredSteps, setFilteredSteps] = useState(defaultFilteredSteps);
  const [variableValues, setVariableValues] = useState([]);

  function stepButton() {
    setStateCounter(stateCounter + 1);
    const { stateStack } = myInterpreter;
    const currentStack = stateStack[stateStack.length - 1];
    const { node, scope } = currentStack;

    const scopeProperties = scope?.object?.properties;
    if (node.type === 'Identifier') {
      const identifierValue = scopeProperties?.[node.name];
      if (identifierValue?.class !== 'Function') {
        const start = stateStack.length ? node.start : 0;
        const end = stateStack.length ? node.end : 0;
        setVariableValues([
          ...variableValues,
          { start, end, value: identifierValue },
        ]);
      }
    }
    setCurrentStep(node.type);
    // if (scopeProperties && currentStep === 'Identifier') {
    //   const variableValue = scopeProperties?.[text[0]];
    //   // if (variableValue) {

    //   // }
    //   console.log(scopeProperties);
    //   console.log(currentStack);
    //   console.log(variableValue);
    // }
    console.log('========================');
    console.log('stateStack', currentStack);
    //console.log('myInterpreter', myInterpreter);
    if (currentStack.hasOwnProperty('value')) console.warn(currentStack.value);

    setStateCounter(stateCounter + 1);
    handleStepAnimation();
  }

  const handleStepAnimation = async () => {
    const { stateStack } = myInterpreter;
    const { node } = stateStack[stateStack.length - 1];

    const stepIsFiltered = filteredSteps.includes(node.type);
    const start = stateStack.length ? node.start : 0;
    const end = stateStack.length ? node.end : 0;
    setStart(start);
    setEnd(end);
    //console.log(myInterpreter);
    //if (!stepIsFiltered) createSelection(start, end); selects text area text
    const ok = await myInterpreter.step();
    if (!ok) {
      setStepAndRunBtnDisabledAttr('disabled');
    } else {
      if (stepIsFiltered) stepButton();
    }
    // consoleLogger([
    //   ['ast', ast],
    //   ['GLOBALObj', globalObject],
    //   ['GLOBALScope', globalScope],
    //   ['stateStack', stateStack],
    //   ['step text', window.getSelection().toString()],
    //   ['start/end text ref', start, end],
    // ]);
  };

  function runButton() {
    setStepAndRunBtnDisabledAttr('disabled');
    if (myInterpreter.run()) {
      // Async function hit.  There's more code to run.
      // There will be a lot of restarts due to regular expressions in Acorn.
      setTimeout(runButton, 0);
    }
  }
  function parseButton() {
    setStateCounter(0);
    setMyInterpreter(new Interpreter(code));
    setStepAndRunBtnDisabledAttr('');
  }

  const dataToDisplay = [
    ['Step Counter:', stateCounter],
    ['Step:', currentStep],
    ['Code Value:', myInterpreter.value],
    ['text Coordinates:', start + ', ' + end],
  ];

  // console.log(code.split('\n'));

  return (
    <div>
      <div className={classes.wrapper}>
        <div>
          <div className={classes.dataDisplayWrapper}>
            {dataToDisplay.map(([label, value], idx) => (
              <p key={'dataDisplay' + idx}>
                <strong>{label}</strong> {value}{' '}
              </p>
            ))}
          </div>
          <div>
            <StepsDropdownFilter
              onChange={(e) => setFilteredSteps(e.target.value)}
              filteredSteps={filteredSteps}
            />
          </div>
        </div>
        <div className={classes.buttonGroup}>
          <button onClick={parseButton}>Parse</button>
          <button onClick={stepButton} disabled={stepAndRunBtnDisabledAttr}>
            Step
          </button>
          <button onClick={runButton} disabled={stepAndRunBtnDisabledAttr}>
            Run
          </button>
        </div>
        <textarea
          id="code"
          spellCheck="false"
          rows={7}
          onChange={(e) => setCode(e.target.value)}
          value={code}
        />
        <div className={classes.codePresentation}>
          {code.split('\n').map((codeLine, idx) => {
            const style = {};
            const spacing = codeLine.match(/^\s+/)?.[0]?.length;
            if (spacing) style.paddingLeft = `${spacing * 5}px`;
            const [refIdxStart, refIdxEnd] = getCodeCoordinates(code)[idx];

            const inRange = codeLineIsInRange(
              start,
              end,
              refIdxStart,
              refIdxEnd
            );

            console.log(variableValues);
            const currentStack =
              myInterpreter?.stateStack?.[myInterpreter.stateStack.length - 1];
            const currentNode = currentStack?.node;
            const scopeProperties = currentStack?.scope?.object?.properties;

            if (inRange) {
              let slicerStart = 0;
              if (start - refIdxStart > 0) slicerStart = start - refIdxStart;
              const slicerEnd = end - refIdxStart - slicerStart;
              codeLine = codeLine.split('');
              const text = codeLine.slice(slicerStart, slicerEnd + slicerStart);

              codeLine.splice(
                slicerStart,
                slicerEnd,
                <span className={classes.codeHighlightStyles}>{text}</span>
              );
            }

            return (
              <p key={'codeLine' + idx} style={style}>
                {codeLine}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const consoleLogger = (items) => {
  items.forEach(([title, data]) => console.log(title, data));
};

const getCodeCoordinates = (code) => {
  return code.split('\n').reduce((idxRanges, text, idx) => {
    let startIdx = idx === 0 ? 0 : idxRanges[idx - 1][1] + 1;
    if (idx > 0) startIdx += 1; //alternative to account for new line
    const endIdx = startIdx + (text.length - 1);
    const newIdxRange = [startIdx, endIdx];
    return [...idxRanges, newIdxRange];
  }, []);
};

const getCharsRawIdx = (code) => {
  return code.split('\n').reduce((idxRanges, text, idx) => {
    let startIdx = idx === 0 ? 0 : idxRanges[idx - 1][1] + 1;
    if (idx > 0) startIdx += 1; //alternative to account for new line
    const endIdx = startIdx + (text.length - 1);
    const newIdxRange = [startIdx, endIdx];
    return [...idxRanges, newIdxRange];
  }, []);
};

function between(x, min, max) {
  return x >= min && x <= max;
}

function codeLineIsInRange(start, end, startAlt, endAlt) {
  return (
    between(startAlt, start, end) ||
    between(start, startAlt, endAlt) ||
    between(endAlt, start, end) ||
    between(end, startAlt, endAlt)
  );
}

const getIndexRange = (arrayLength, startNumber) => {
  const start = startNumber;
  const end = startNumber + arrayLength - 1;
  return [start, end];
};

const createNumberArray = (arrayLength, startNumber = 0) => {
  return Array.from({ length: arrayLength }, (_, i) => i + startNumber);
};

function createSelection(start, end) {
  //selects textArea text
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
}
