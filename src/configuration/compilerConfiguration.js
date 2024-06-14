export const DEFAULT_CODE = {
  js: `
    import React from "react";
    import ReactDOM from "react-dom";

    function App() {
      return (
        <h1>Hello world</h1>
      );
    }

    ReactDOM.render(<App />,
    document.getElementById("root"));`,
  py: `print 'Hello from Developer!'`
}

export const HACKER_EARTH_LANGUAGE_FORMAT = {
  'js': 'JAVASCRIPT_NODE',
  'py': 'PYTHON3_8',
  'java': 'JAVA14',
  'c': 'C',
  'cpp': 'CPP17',
}