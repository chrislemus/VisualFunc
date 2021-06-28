import SyntaxHighlighter from 'react-syntax-highlighter';
import { useState, useReducer } from 'react';
const CODE = `function fib(3) {
    function fib(n) {
    if (3 <= 1) return 3;
    if(n <= 1) return n;
    return fib(3-1) + fib(3-2)
}`;

const frames = [
  [[1], [2]],
  [[3], [4]],
];

const initialState = {
  frame: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'nextFrame':
      return {
        ...state,
        frame: state.frame + 1,
        // prevSnippetLines: [...state.prevSnippetLines, ...frames[state.frame][1]]
      };
    case 'prevFrame':
      return {
        ...state,
        frame: state.frame - 1,
      };
    default:
      throw new Error();
  }
}

export default function Fibonacci() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const valueSnippetLines = frames.map((lineSets) => lineSets[1]);
  const getPrevValueSnippetLineNumbers = () => {
    let totalLines = [];
    for (let idx = 0; idx < state.frame; idx++) {
      totalLines.push(...frames[idx][1]);
    }
    return totalLines;
  };

  const [displayValueSnippet, setDisplayValueSnippet] = useState(false);
  return (
    <div>
      <div>
        <div style={{ paddingTop: 20, display: 'flex' }}>
          <div style={{ flex: 1, width: '100%', flexDirection: 'column' }}>
            <button
              onClick={() => setDisplayValueSnippet(!displayValueSnippet)}
            >
              Display Val
            </button>
            <button
              onClick={() => {
                state.frame > 0 && dispatch({ type: 'prevFrame' });
              }}
            >
              Prev Frame
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'nextFrame' });
              }}
            >
              Next Frame
            </button>
            <SyntaxHighlighter
              style={docco}
              wrapLines
              // lineNumberStyle
              showLineNumbers
              lineProps={(lineNumber) => {
                const prevValueSnippetLineNumbers =
                  getPrevValueSnippetLineNumbers();
                const [rawLines, valueSnippetLines] = frames[state.frame];
                let style = { display: 'block' };
                valueSnippetLines.forEach((lines) => {
                  if (lines.includes && lines?.includes(lineNumber))
                    style.display = 'none';
                });
                if (prevValueSnippetLineNumbers.includes(lineNumber))
                  style.display = 'none';
                if (valueSnippetLines.includes(lineNumber)) {
                  style.backgroundColor = '#c9c9c9';
                  style.fontStyle = 'italic';
                  // style.color = 'red'
                  if (!displayValueSnippet) style.display = 'none';
                }
                if (rawLines.includes(lineNumber)) {
                  style.backgroundColor = '#dbffdb';
                }
                return { style };
              }}
            >
              {CODE}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
      {/* <p>function fib(n) {</p> */}
      {/* <SyntaxHighlighter language="javascript" style={style} >
      {codeString}
    </SyntaxHighlighter> */}
    </div>
  );
}

const docco = {
  hljs: {
    display: 'block',
    overflowX: 'auto',
    padding: '0.5em',
    color: '#000',
    background: '#f8f8ff',
  },
  'hljs-comment': {
    color: '#408080',
    fontStyle: 'italic',
  },
  'hljs-quote': {
    color: '#408080',
    fontStyle: 'italic',
  },
  'hljs-keyword': {
    color: '#954121',
  },
  'hljs-selector-tag': {
    color: '#954121',
  },
  'hljs-literal': {
    color: '#954121',
  },
  'hljs-subst': {
    color: '#954121',
  },
  'hljs-number': {
    color: '#40a070',
  },
  'hljs-string': {
    color: '#219161',
  },
  'hljs-doctag': {
    color: '#219161',
  },
  'hljs-selector-id': {
    color: '#19469d',
  },
  'hljs-selector-class': {
    color: '#19469d',
  },
  'hljs-section': {
    color: '#19469d',
  },
  'hljs-type': {
    color: '#19469d',
  },
  'hljs-params': {
    color: '#00f',
  },
  'hljs-title': {
    color: '#458',
    fontWeight: 'bold',
  },
  'hljs-tag': {
    color: '#000080',
    fontWeight: 'normal',
  },
  'hljs-name': {
    color: '#000080',
    fontWeight: 'normal',
  },
  'hljs-attribute': {
    color: '#000080',
    fontWeight: 'normal',
  },
  'hljs-variable': {
    color: '#008080',
  },
  'hljs-template-variable': {
    color: '#008080',
  },
  'hljs-regexp': {
    color: '#b68',
  },
  'hljs-link': {
    color: '#b68',
  },
  'hljs-symbol': {
    color: '#990073',
  },
  'hljs-bullet': {
    color: '#990073',
  },
  'hljs-built_in': {
    color: '#0086b3',
  },
  'hljs-builtin-name': {
    color: '#0086b3',
  },
  'hljs-meta': {
    color: '#999',
    fontWeight: 'bold',
  },
  'hljs-deletion': {
    background: '#fdd',
  },
  'hljs-addition': {
    background: '#dfd',
  },
  'hljs-emphasis': {
    fontStyle: 'italic',
  },
  'hljs-strong': {
    fontWeight: 'bold',
  },
};
