import React, { useState } from 'react';
import Sidebar from './Sidebar';
import IDEEditor from './editor';
import Console from './Console';
import './Home.css';
import './Sidebar.css';
import Header from '../components/header';
import ChatModal from './ChatModal';

const Home = () => {
    const [editorContent, setEditorContent] = useState('');
    const [result, setResult] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [readOnly, setReadOnly] = useState(true);
    const [inputValue, setInputValue] = useState('');

    const handleSelectFile = (file) => {
        setSelectedFile(file);
        setEditorContent(file.fileCode);
        setInputValue('');
        setResult('');
        setReadOnly(false);
    };

    const handleExecute = (output) => {
        setResult(output.result);
    };

    return (
        <div className="home editor-page">
            <Header />
            <ChatModal />
            <div style={{ display: 'flex', height: '100%' }}>
                <Sidebar onSelectFile={handleSelectFile} />
                <div className="editor-console-container">
                    <IDEEditor
                        selectedFile={selectedFile}
                        value={editorContent}
                        onChange={setEditorContent}
                        readOnly={readOnly}
                        onExecute={handleExecute}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                    />
                    <Console result={result} />
                </div>
            </div>
        </div>
    );
};

export default Home;
