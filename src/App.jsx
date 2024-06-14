import { useState, useRef, useCallback, useEffect } from "react";
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import './style.css';
import useCompileCode from "./hooks/useComplieCode";
import { DEFAULT_CODE } from "./configuration/compilerConfiguration";

const CodeEditor = () => {
  const [compilerLanguage, setCompilerLanguage] = useState('js');
  const [text, setText] = useState(DEFAULT_CODE[compilerLanguage]);
  const [buttonText, setButtonText] = useState('Copy');
  const preRef = useRef(null);
  const textRef = useRef(null);
  const highlighted = highlight(text, languages[compilerLanguage], compilerLanguage);
  const { outputLink, compiling, compileError, compileCode } = useCompileCode(text);

  useEffect(() => {
    setText(DEFAULT_CODE[compilerLanguage]);
  }, [compilerLanguage]);

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleKeyDown = (e) => {   // This function is for tab 
    if (e.key === 'Tab' && !e.shiftKey) {   // for only tab for forward shift
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const start = text.substring(0, selectionStart);
      const end = text.substring(selectionEnd);
      // Insert 2 spaces at the cursor position
      const newText = `${start}  ${end}`;
      setText(newText);

      setTimeout(() => {
        textRef.current.focus();
        textRef.current.setSelectionRange(selectionEnd + 2, selectionEnd + 2);
      }, 0);

    } else if (e.key === 'Tab' && e.shiftKey) {    // for backword shift
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const lineStart = text.lastIndexOf('\n', selectionStart - 1) + 1;
      if (text.substring(lineStart, lineStart + 2) === '  ') {
        const newText = `${text.substring(0, lineStart)}${text.substring(lineStart + 2)}`;
        setText(newText);
        e.target.selectionStart = e.target.selectionEnd = selectionStart - 2;
      }
    }
    else if (e.key === 'Enter') {   // for new line indentation
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const start = text.substring(0, selectionStart);
      const end = text.substring(selectionEnd);
      const lineStart = text.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = text.substring(lineStart, selectionStart);
      const indentMatch = currentLine.match(/^\s*/);
      const indent = indentMatch ? indentMatch[0] : '';
      let newText;
      if (currentLine.trim().endsWith('{')) {
        // Add an extra indentation level for opening brace
        newText = `${start}\n${indent}  \n${indent}${end}`;
        setText(newText);
        setTimeout(() => {
          textRef.current.focus();
          textRef.current.setSelectionRange(selectionStart + indent.length + 3, selectionStart + indent.length + 3);
        }, 0);
      } else {
        newText = `${start}\n${indent}${end}`;
        setText(newText);
        setTimeout(() => {
          textRef.current.focus();
          textRef.current.setSelectionRange(selectionStart + indent.length + 1, selectionStart + indent.length + 1);
        }, 0);
      }
    }
  }
  const copyToClipboard = useCallback(() => {    // this is for copying entire content 
    textRef.current.select();
    navigator.clipboard.writeText(text);
    setButtonText('✔'); // Change button text to '✔'

    // Reset button text to 'Copy' after 2 seconds
    setTimeout(() => {
      setButtonText('Copy');
    }, 2000);
  }, []);

  const handleClick = async () => {
    compileCode(text, compilerLanguage);
  }

  return (
    <div className="code-editor-parent-container">
      <h3>react-simple-code-editor</h3>
      <button className='compile-btn' onClick={handleClick}>Run</button>

      <pre
        className="overlay-code"
        {...{ dangerouslySetInnerHTML: { __html: highlighted + '<br />' } }}
        ref={preRef}
      />
      <textarea
        ref={textRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        onScroll={(e) => {
          preRef.current.scrollTop = e.target.scrollTop;
        }}
      ></textarea>
      <button onClick={copyToClipboard}>{buttonText}</button>
      <select
        value={compilerLanguage}
        onChange={(e) => setCompilerLanguage(e.target.value)}
        style={{ marginBottom: '10px' }}
      >
        <option value="js">JavaScript (Node)</option>
        <option value="py">Python (3.8)</option>
        <option value="java">Java (14)</option>
        <option value="c">C</option>
        <option value="cpp">C++ (17)</option>
      </select>
      <div className='compile-result'>
        {compiling
          ? <>
            <p>Compiling...</p>
          </>
          : <>
            {compileError && <p>{compileError}</p>}
            {outputLink && <a href={outputLink} target="_blank" rel="noreferrer">Output Link</a>}
          </>
        }
      </div>
    </div>
  )
}

export default CodeEditor;

