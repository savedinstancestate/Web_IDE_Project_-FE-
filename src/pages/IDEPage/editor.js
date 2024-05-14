import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const IDEEditor = ({ value, onChange, selectedFile, readOnly }) => {
    const [inputValue, setInputValue] = useState('');

    // 저장 버튼을 클릭했을 때 실행되는 함수
    const handleSave = async () => {
        if (!selectedFile) return; // 파일이 선택되지 않은 경우 함수 종료
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

    // 실행 버튼을 클릭했을 때 실행되는 함수
    const handleExecute = async () => {
        try {
            const response = await axios.post('/project', {
                file: value,
                input: inputValue,
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error executing code:', error);
        }
    };

    const editorOptions = {
        fontFamily: 'Consolas, monospace',
        fontSize: 14,
        minimap: {
            enabled: true,
        },
        automaticLayout: true,
        lineNumbers: 'on',
        autoIndent: 'advanced',
        folding: true,
        find: {
            seedSearchStringFromSelection: true,
            autoFindInSelection: 'always',
            addExtraSpaceOnTop: true,
        },
        readOnly: readOnly, // 읽기 전용 상태 설정
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
        <div>
            <div style={{ marginBottom: '10px' }}>
                <Button variant="primary" onClick={handleExecute} style={{ marginRight: '10px' }}>
                    실행
                </Button>
                <Button variant="secondary" onClick={handleSave}>
                    저장
                </Button>
            </div>
            <Editor
                height="500px"
                defaultLanguage="java"
                value={value}
                onChange={onChange}
                options={editorOptions}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
            />
            <Form>
                <Form.Group controlId="formInput">
                    <Form.Label>인풋</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="인풋을 입력하세요."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{
                            backgroundColor: '#282c34',
                            color: 'white',
                            borderColor: '#313131',
                        }}
                    />
                </Form.Group>
            </Form>
        </div>
    );
};

export default IDEEditor;
