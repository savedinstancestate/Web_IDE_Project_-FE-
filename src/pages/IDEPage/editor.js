import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './editor.css';

const IDEEditor = ({ value, onChange, selectedFile, readOnly, onExecute }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSave = async () => {
        if (!selectedFile) return;
        try {
            const response = await axios.put(`/project/file/${selectedFile.fileId}`, {
                fileId: selectedFile.fileId,
                fileName: selectedFile.fileName,
                fileCode: value,
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    const handleExecute = async () => {
        try {
            const response = await axios.post('/project', {
                file: value,
                input: inputValue,
            });
            onExecute(response.data);
        } catch (error) {
            console.error('Error executing code:', error);
        }
    };

    const editorOptions = {
        fontFamily: 'Consolas, monospace',
        fontSize: 14,
        minimap: { enabled: true },
        automaticLayout: true,
        lineNumbers: 'on',
        autoIndent: 'advanced',
        folding: true,
        find: {
            seedSearchStringFromSelection: true,
            autoFindInSelection: 'always',
            addExtraSpaceOnTop: true,
        },
        readOnly: readOnly,
    };

    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme('vs-dark-custom', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {},
        });
    };

    const handleEditorDidMount = (editor, monaco) => {
        monaco.editor.setTheme('vs-dark-custom');
    };

    return (
        <div className="editor-container">
            <div className="button-container">
                <Button variant="outline-success" size="sm" onClick={handleExecute} className="run-button">
                    Run
                </Button>
                <Button variant="outline-warning" size="sm" onClick={handleSave}>
                    Save
                </Button>
            </div>
            <Editor
                height="calc(100% - 80px)"
                defaultLanguage="java"
                value={value}
                onChange={onChange}
                options={editorOptions}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
            />
            <Form className="input-form">
                <Form.Group controlId="formInput">
                    <Form.Control
                        type="text"
                        placeholder="Enter input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="input-field"
                    />
                </Form.Group>
            </Form>
        </div>
    );
};

export default IDEEditor;
