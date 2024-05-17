import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './editor.css';
import withAuth from '../../components/withAuth';

const IDEEditor = ({ value, onChange, selectedFile, readOnly, onExecute }) => {
    const [inputValue, setInputValue] = useState('');
    // const jwtToken = 'your-jwt-token-here';

    const handleSave = async () => {
        if (!selectedFile) return; // 선택된 파일이 없다면 아무 작업도 수행하지 않음
        try {
            const response = await axios.put(
                `https://f60f01f3-6e14-4580-8fed-fd8dc5a682e1.mock.pstmn.io/project/file`,
                {
                    fileId: selectedFile.fileId,
                    fileName: selectedFile.fileName,
                    fileCode: value, // 이 'value'는 현재 편집기에서 수정중인 코드 내용입니다.
                }
                // {
                //     headers: {
                //         Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 포함한 Authorization 헤더 추가
                //     },
                // }
            );
            if (response.status === 200) {
                console.log('File saved successfully:', response.data);
                // alert('파일 저장 성공'); // 사용자에게 성공 메시지 표시
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (error) {
            if (error.response) {
                // 상태 코드 400일 때 오류 메시지 처리
                console.error('Error saving file:', error.response.data.message);
                alert(error.response.data.message); // 사용자에게 서버 응답 메시지를 보여줌
            } else {
                console.error('Network or other error:', error);
                alert('An unexpected error occurred.'); // 네트워크 오류나 기타 예외 처리
            }
        }
    };

    const handleExecute = async () => {
        if (!selectedFile) return;
        try {
            const response = await axios.post(
                'https://f60f01f3-6e14-4580-8fed-fd8dc5a682e1.mock.pstmn.io/project',
                {
                    fileId: selectedFile.fileId,
                    fileName: selectedFile.fileName,
                    fileCode: value,
                    input: inputValue,
                }
                // {
                //     headers: {
                //         Authorization: `Bearer ${jwtToken}`, // 토큰을 포함한 Authorization 헤더 추가
                //     },
                // }
            );
            if (response.status === 200) {
                onExecute(response.data.data); // 성공시 데이터를 처리
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (error) {
            if (error.response) {
                // API 명세에 따라 상태코드 400에 대한 메시지 처리
                console.error('Error executing code:', error.response.data.message);
                alert(error.response.data.message); // 사용자에게 API 응답 메시지를 보여줌
            } else {
                console.error('Network or other error:', error);
                alert('An unexpected error occurred.'); // 네트워크 오류나 기타 예외 처리
            }
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

export default withAuth(IDEEditor);
