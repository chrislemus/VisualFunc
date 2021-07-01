import classes from './fib4.module.css';
import StepsDropdownFilter from './StepsDropdownFilter';
import { code as defaultCode, defaultFilteredSteps } from './constants';
// import esprima from 'esprima';
var esprima = require('esprima');
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
  const [stateCounter, setStateCounter] = useState(0);
  const [filteredSteps, setFilteredSteps] = useState(defaultFilteredSteps);
  const dataToDisplay = [['Step Counter:', stateCounter]];
  console.log(esprima.parseScript('answer = 42'));
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
          <button onClick={() => console.log('hi')}>console.log hi</button>
          <button onClick={() => setStateCounter(stateCounter + 1)}>
            Step
          </button>
        </div>
        <textarea
          id="code"
          spellCheck="false"
          rows={7}
          onChange={(e) => setCode(e.target.value)}
          value={code}
        />
        <div className={classes.codePresentation}>f</div>
      </div>
    </div>
  );
}
