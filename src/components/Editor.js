import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import './Editor.css';
import {
  ActionIcon,
  Box,
  Card,
  Container,
  Grid,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
} from '@mantine/core';
import {
  IconBold,
  IconItalic,
  IconPhoto,
  IconLink,
  IconZoomIn,
  IconZoomOut,
} from '@tabler/icons-react';

const Editor = ({ text, handleTextChange }) => {
  const [value, setValue] = useState(text);
  const [selectedHeading, setSelectedHeading] = useState('');
  const [fontSize, setFontSize] = useState(22);
  const [history, setHistory] = useState([text]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const textareaRef = useRef();

  useEffect(() => {
    setValue(text);
  }, [text]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    handleTextChange(newValue);

    // Update history and historyIndex
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(newValue);
      return newHistory;
    });
    setHistoryIndex((prevIndex) => prevIndex + 1);
  };

  const getMarkdownText = () => {
    const rawMarkup = marked(value, { sanitize: true });
    return { __html: rawMarkup };
  };

  const increaseFontSize = () => {
    setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 8) {
      setFontSize(fontSize - 2);
    }
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

  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      event.preventDefault();

      if (historyIndex > 0) {
        setHistoryIndex((prevIndex) => prevIndex - 1);
        const newValue = history[historyIndex - 1];
        setValue(newValue);
        handleTextChange(newValue);
      }
    }
  };

  const handleHeadingClick = (level) => {
    if (level === '') return; // Do nothing if no valid level is selected

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    const headingSyntax = '#'.repeat(level) + ' ';

    if (selectedText) {
      const newText = headingSyntax + selectedText;
      const updatedValue = [
        value.slice(0, start),
        newText,
        value.slice(end),
      ].join('');

      setValue(updatedValue);
      handleTextChange(updatedValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + newText.length;
        textarea.focus();
      }, 0);
    } else {
      insertText(headingSyntax);
    }
    setSelectedHeading('');
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
      default:
        break;
    }
  };

  const renderOutput = () => {
    return <div dangerouslySetInnerHTML={getMarkdownText()} />;
  };

  const renderHeadingDropdown = () => {
    const headingOptions = [
      { value: '', label: 'Heading', disabled: true },
      ...Array.from({ length: 6 }, (_, i) => {
        const level = i + 1;
        return { value: level, label: `H${level}` };
      }),
    ];

    return (
      <Select
        className="heading-dropdown"
        placeholder="Heading"
        data={headingOptions}
        value={selectedHeading}
        onChange={(value) => handleHeadingClick(value)}
      />
    );
  };

  return (
    <>
      <Grid p={30} maw="100%">
        <Grid.Col span={8}>
          <Card>
            <Group position="left" sx={{ backgroundColor: '#f0f8ff' }} p={20}>
              {renderHeadingDropdown()}
              <ActionIcon
                variant="default"
                component="button"
                onClick={() => handleButtonClick('bold')}
              >
                <IconBold />
              </ActionIcon>
              <ActionIcon
                variant="default"
                component="button"
                onClick={() => handleButtonClick('italic')}
              >
                <IconItalic />
              </ActionIcon>
              <ActionIcon
                variant="default"
                component="button"
                onClick={() => handleButtonClick('link')}
              >
                <IconLink />
              </ActionIcon>
              <ActionIcon
                variant="default"
                component="button"
                onClick={() => handleButtonClick('image')}
              >
                <IconPhoto />
              </ActionIcon>
              <ActionIcon
                variant="default"
                component="button"
                onClick={increaseFontSize}
              >
                <IconZoomIn />
              </ActionIcon>
              <ActionIcon
                variant="default"
                component="button"
                onClick={decreaseFontSize}
              >
                <IconZoomOut />
              </ActionIcon>
            </Group>
            <Textarea
              className="mde-textarea"
              ref={textareaRef}
              value={value}
              minRows={35}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              size={`${fontSize}px`}
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" radius="md" withBorder mih="80%">
            {renderOutput()}
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Editor;
