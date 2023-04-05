import { useState, useEffect } from 'react';
import Editor from './components/Editor';
import './App.css';
import { Container, MantineProvider } from '@mantine/core';

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    if (storedNotes.length > 0) {
      setText(storedNotes[0].content);
    }
  }, []);

  const handleTextChange = (value) => {
    setText(value);
    saveNoteToLocalStorage(value);
  };

  const saveNoteToLocalStorage = (value) => {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const newNote = { timestamp: Date.now(), content: value };

    notes = [newNote, ...notes.slice(0, 9)];
    localStorage.setItem('notes', JSON.stringify(notes));
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <>
        <Editor text={text} handleTextChange={handleTextChange} />
      </>
    </MantineProvider>
  );
}

export default App;
