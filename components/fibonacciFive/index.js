import classes from './fib4.module.css';
import StepsDropdownFilter from './StepsDropdownFilter';
import { code as defaultCode, defaultFilteredSteps } from './constants';
// import acorn from 'acorn';
// import walk from 'acorn-walk';
// import { get } from 'lodash';
const acorn = require('acorn');
const walk = require('acorn-walk');
// import esprima from 'esprima';
var esprima = require('esprima');
import {
  useState,
  useReducer,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';

export default function Fibonacci() {
  const [code, setCode] = useState(defaultCode);
  const codeTextAreaRef = useRef();
  const [codeTree, setCodeTree] = useState(null);
  const [stateCounter, setStateCounter] = useState(0);
  const [filteredSteps, setFilteredSteps] = useState([]);
  const dataToDisplay = [['Step Counter:', stateCounter]];
  walk.full(acorn.parse(code), (node, callback, base, state) => {
    console.log(node);
    console.log(callback);
    // console.log(walk.findNodeAt();
    console.log(base);
    console.log(state);
    console.warn('SEPARATE');
  });
  // console.log();
  // console.log(code.split('\n'));

  const getIdentifier = (callee, scope) => {
    const { type, name } = callee;
    return scope.filter(({ id }) => id && id.name == name && id.type == type);
  };

  const parseCode = () => {
    const codeTree = esprima.parseScript(code, { loc: true });
    const funcCaller = codeTree.body[codeTree.body.length - 1];
    setGlobalScope(codeTree);
    console.log(codeTree);
    setCodeTree(codeTree);
  };

  const setGlobalScope = (codeTree) => {
    const globalScope = {};
    codeTree.body.forEach((branch, idx) => {
      const type = branch?.id?.type;
      const name = branch?.id?.name;
      if (type && name) {
        globalScope[name] = {
          type,
          scopeRef: `body[${idx}]`,
        };
      }
    });
    codeTree.globalScope = globalScope;
    return codeTree;
  };

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
          <button onClick={parseCode}>Parse</button>
          <button onClick={() => setStateCounter(stateCounter + 1)}>
            Step
          </button>
        </div>
        <textarea
          id="code"
          ref={codeTextAreaRef}
          spellCheck="false"
          rows={7}
          onChange={(e) => setCode(e.target.value)}
          value={code}
        />
        <div className={classes.codePresentation}>
          {code.split('\n').map((codeLine) => {
            const style = {};
            const spacing = codeLine.match(/^\s+/)?.[0]?.length;
            console.log(spacing);
            if (spacing) style.paddingLeft = `${spacing * 5}px`;
            return <p style={style}>{codeLine}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
