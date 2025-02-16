import { useState } from 'react';
import Editor from '@monaco-editor/react';

function Status() {
  const [code, setCode] = useState(`// 여기에 코드를 작성하세요
function example() {
  console.log("Hello World!");
}
`);

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>코드 에디터</h2>
      <div style={{ 
        border: '1px solid #ddd',
        borderRadius: '4px',
        height: 'calc(100vh - 150px)',
        overflow: 'hidden'
      }}>
        <Editor
          height="100%"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            snippetSuggestions: 'inline',
            tabCompletion: 'on',
          }}
        />
      </div>
    </div>
  );
}

export default Status;
