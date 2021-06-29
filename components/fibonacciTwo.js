import SyntaxHighlighter from 'react-syntax-highlighter';
import evaljs from 'evaljs';
import { Interpreter } from 'eval5';
import { compile } from 'expression-runner';
import { useState, useReducer } from 'react';
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
    ui: (param) => [
      `function fib(`,
      <span style={paramStyles}>{param}</span>,
      `) {`,
    ],
    wrapperStart: true,
    frame: 0,
  },
  {
    ui: (param) => [
      `if(`,
      <span style={paramStyles}>{param}</span>,
      ` <= 1) return `,
      <span style={paramStyles}>{param}</span>,
    ],
    frame: 1,
  },
  {
    ui: (param) => (
      <Dynamic
        ui="if(%%n%% <= 1) return n;"
        param={param}
        func={() => param <= 1}
      />
    ),
    // ui: (param) => [
    //   `return fib(`,
    //   <span style={paramStyles}>{param}</span>,
    //   `-1) + fib(`,
    //   <span style={paramStyles}>{param}</span>,
    //   `-2)`,
    // ],
    frame: 2,
  },
  // {
  //   ui: (param) => [
  //     `return fib(`,
  //     <span style={paramStyles}>{param}</span>,
  //     `-1) + fib(`,
  //     <span style={paramStyles}>{param}</span>,
  //     `-2)`,
  //   ],
  //   frame: 2,
  // },
  {
    ui: () => `}`,
    wrapperEnd: true,
  },
];

const codeLinesInner = [];
export default function Fibonacci() {
  let myVars = { a: 1 };

  const classes = useStyles();
  const interpreter = new Interpreter();
  const [displayValueSnippet, setDisplayValueSnippet] = useState(false);
  const [param, setParam] = useState(2);
  const [frame, setFrame] = useState(0);
  // console.log(evaljs.evaluate('1+1 > 0'));
  let result = interpreter.evaluate('1+1');
  console.log(result);

  interpreter.evaluate('var a=100');
  interpreter.evaluate('var b=200');
  result = interpreter.evaluate('a+b');

  console.log(result);
  const getPresentation = () => {
    const settings = { codeBlocks: 0 };
    return codeLines.map((line, idx) => {
      if (line.wrapperEnd) settings.codeBlocks = settings.codeBlocks - 1;
      const padding = settings.codeBlocks * 12;
      const element = (
        <p
          key={'codeLine' + idx}
          style={{ paddingLeft: padding }}
          className={clsx({
            [classes.inFrame]: frame === line.frame,
          })}
        >
          {' '}
          {line.ui(param)}
        </p>
      );
      if (line.wrapperStart) settings.codeBlocks = settings.codeBlocks + 1;
      return element;
    });
  };

  return (
    <div>
      <div className={classes.wrapper}>
        <div>
          <input onChange={(e) => setParam(e.target.value)} value={param} />
        </div>
        <div>
          <p>
            Frame: <strong>{frame}</strong>
          </p>
          <button onClick={() => setFrame(frame - 1)}>prev frame</button>
          <button onClick={() => setFrame(frame + 1)}>next frame</button>
        </div>

        <div>{getPresentation()}</div>
      </div>
    </div>
  );
}

function Dynamic(props) {
  const [displayVal, setDisplayVal] = useState(false);
  const toggleInfo = () => setDisplayVal(!displayVal);
  const withVal = props.ui.replace(/(%%).(%%)/g, props.param);
  console.log();
  if (displayVal) {
    return <span onClick={toggleInfo}>{withVal}</span>;
  } else {
    return <span onClick={toggleInfo}>{props.ui}</span>;
  }
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
    background: '#bae2ff',
  },
  param: {
    color: 'red',
    fontWeight: 'bold',
  },
}));
