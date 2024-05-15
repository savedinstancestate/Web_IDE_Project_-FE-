import React, { useState } from 'react';
import Sidebar from './Sidebar';
import IDEEditor from './editor';
import Console from './Console';
import './Home.css';
import './Sidebar.css';

const Home = () => {
    const [editorContent, setEditorContent] = useState('');
    const [result, setResult] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [readOnly, setReadOnly] = useState(true);

    const handleSelectFile = (file) => {
        setSelectedFile(file);
        setEditorContent(file.content);
        setReadOnly(false);
    };

    const handleExecute = (output) => {
        setResult(output);
    };

    return (
        <div className="home">
            <Sidebar onSelectFile={handleSelectFile} />
            <div className="editor-console-container">
                <IDEEditor
                    selectedFile={selectedFile}
                    value={editorContent}
                    onChange={setEditorContent}
                    readOnly={readOnly}
                    onExecute={handleExecute}
                />
                <Console result={result} />
            </div>
        </div>
    );
};

export default Home;
