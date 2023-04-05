import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import './Editor.css';

const Editor = ({ text, handleTextChange }) => {
  const [value, setValue] = useState(text);
  const [previewMode, setPreviewMode] = useState(true);
  const textareaRef = useRef();

  useEffect(() => {
    setValue(text);
  }, [text]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    handleTextChange(newValue);
  };

  const getMarkdownText = () => {
    const rawMarkup = marked(value, { sanitize: true });
    return { __html: rawMarkup };
  };

  const insertText = (syntax) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);

    let newText;
    switch (syntax) {
      case 'bold':
        newText = selectedText ? `**${selectedText}**` : '**bold**';
        break;
      case 'italic':
        newText = selectedText ? `_${selectedText}_` : '_italic_';
        break;
      case 'link':
        newText = selectedText
          ? `[${selectedText}](https://example.com)`
          : '[link](https://example.com)';
        break;
      case 'image':
        newText = selectedText
          ? `![${selectedText}](https://example.com/image.jpg)`
          : '![alt text](https://example.com/image.jpg)';
        break;
      default:
        newText = syntax;
    }

    const updatedValue = [
      value.slice(0, start),
      newText,
      value.slice(end),
    ].join('');
    setValue(updatedValue);
    handleTextChange(updatedValue);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + newText.length;
      textarea.focus();
    }, 0);
  };

  const handleButtonClick = (type) => {
    switch (type) {
      case 'bold':
        insertText('**bold**');
        break;
      case 'italic':
        insertText('_italic_');
        break;
      case 'link':
        insertText('[link](https://example.com)');
        break;
      case 'image':
        insertText('![alt text](https://example.com/image.jpg)');
        break;
      case 'toggle':
        setPreviewMode(!previewMode);
        break;
      default:
        break;
    }
  };

  const renderOutput = () => {
    if (previewMode) {
      return (
        <div
          className="preview"
          dangerouslySetInnerHTML={getMarkdownText()}
        ></div>
      );
    } else {
      return <pre className="raw-markdown">{value}</pre>;
    }
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={() => handleButtonClick('bold')}>Bold</button>
        <button onClick={() => handleButtonClick('italic')}>Italic</button>
        <button onClick={() => handleButtonClick('link')}>Link</button>
        <button onClick={() => handleButtonClick('image')}>Image</button>
        <button onClick={() => handleButtonClick('toggle')}>
          Toggle Preview
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="editor"
        value={value}
        onChange={handleChange}
      />
      {renderOutput()}
    </div>
  );
};

export default Editor;
