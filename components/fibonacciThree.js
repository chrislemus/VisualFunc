import SyntaxHighlighter from 'react-syntax-highlighter';
import evaljs from 'evaljs';
import { Interpreter } from 'eval5';

import { compile } from 'expression-runner';
import { useState, useReducer, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const paramStyles = {
  fontWeight: 'bold',
  color: 'red',
};
const CODE = `function fib(n) {
    if(n <= 1) return n;
    return fib(n-1) + fib(n-2)
}`;

function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

const codeLines = [
  {
    ui: 'function fib(%%n%%) {',
    wrapperStart: true,
    frame: 0,
  },
  {
    ui: 'if(%%n%% <= 1) return %%n%%;',
    frame: 1,
  },
  {
    ui: 'return fib(%%n%%-1) + fib(%%n%%-2)',
    frame: 2,
  },
  {
    ui: `}`,
    wrapperEnd: true,
  },
];

export default function Fibonacci() {
  const classes = useStyles();
  const interpreter = new Interpreter();
  const [displayValueSnippet, setDisplayValueSnippet] = useState(false);
  const [codeBlocks, setCodeBlocks] = useState(0);
  const addCodeBlock = () => setCodeBlocks(codeBlocks + 1);
  const removeCodeBlock = () => setCodeBlocks(codeBlocks - 1);
  const [params, setParams] = useState({ n: 2 });
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showVal, setShowVal] = useState(true);
  const toggleValue = () => setShowVal(!showVal);
  useEffect(() => {
    // const { globalContext } = interpreter;
    for (const [key, value] of Object.entries(params)) {
      interpreter.evaluate(`var ${key} = ${value}`);
    }
  }, [params]);
  // console.log(evaljs.evaluate('1+1 > 0'));
  // let result = interpreter.evaluate('1+1');
  // console.log(result);
  //   interpreter.evaluate('var a=4');
  //   interpreter.evaluate('var b=200');
  //   interpreter.evaluate(`function fib(n) {
  //     if(n <= 1) return n;
  //     return fib(n-1) + fib(n-2)
  // }`);
  //   result = interpreter.evaluate('fib(a)');

  //   console.log(result);
  //   console.log(interpreter);

  console.log(interpreter);
  console.log(interpreter.context.fib(8));
  console.log(interpreter);

  return (
    <div>
      <div className={classes.wrapper}>
        <div>
          <input
            onChange={(e) => setParams({ ...params, n: e.target.value })}
            value={params.n}
          />
        </div>
        <div>
          <p>
            Frame: <strong>{currentFrame}</strong>
          </p>
          <button onClick={() => setCurrentFrame(currentFrame - 1)}>
            prev frame
          </button>
          <button onClick={() => setCurrentFrame(currentFrame + 1)}>
            next frame
          </button>
        </div>

        <div>
          {codeLines.map((data, idx) => (
            <Presentation
              key={'functionItem' + idx}
              data={data}
              classes={classes}
              currentFrame={currentFrame}
              interpreter={interpreter}
              toggleValue={toggleValue}
              showVal={showVal}
              // param={param}
              codeBlocks={codeBlocks}
              addCodeBlock={addCodeBlock}
              removeCodeBlock={removeCodeBlock}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const Presentation = (props) => {
  const {
    classes,
    data,
    currentFrame,
    interpreter,
    // param,
    codeBlocks,
    toggleValue,
    showVal,
    removeCodeBlock,
    addCodeBlock,
  } = props;
  let codeString = data.ui;

  const variables = codeString
    .match(/(%%).(%%)/g)
    ?.map((variable) => variable?.replaceAll(/%%/g, ''));

  // console.log(interpreter.currentContext);
  // const uiString = variable;
  // console.log(variables);
  // console.log(

  // );

  if (codeString.matchAll(/(%%.%%)/g)) {
    codeString = codeString.split(/(%%.%%)/g).map((str, idx) => {
      if (str.match(/(%%.%%)/g)) {
        const sanitized = str.replaceAll(/%%/g, '');
        return (
          <strong
            onClick={toggleValue}
            key={`code-text-${sanitized}-${idx}`}
            style={{
              color: '#a300de',
              background: '#e8e8e8',
              padding: '1px 3px',
              cursor: 'pointer',
            }}
          >
            {showVal ? interpreter.currentContext[sanitized] : sanitized}
          </strong>
        );
      } else {
        return str;
      }
    });
  }
  // console.log(data.ui.match(/(%%).(%%)/));
  //console.log(data.ui.replace(/(%%).(%%)/, 'hi'));
  // if (data.wrapperEnd) removeCodeBlock();
  const padding = codeBlocks * 12;
  const element = (
    <p
      style={{ paddingLeft: padding }}
      className={clsx({
        [classes.inFrame]: currentFrame === data.frame,
      })}
    >
      {' '}
      {codeString}
    </p>
  );
  // if (data.wrapperStart) addCodeBlock();
  return element;
};

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
