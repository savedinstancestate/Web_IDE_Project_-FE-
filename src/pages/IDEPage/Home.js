import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import IDEEditor from './editor';
import Console from './Console';
import './Home.css';
import './Sidebar.css';

const Home = () => {
    const [editorContent, setEditorContent] = useState('');
    const [result, setResult] = useState(''); // 결과를 관리하는 상태 추가
    const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태 추가
    const [readOnly, setReadOnly] = useState(true); // 읽기 전용 상태 추가

    const handleSelectFile = (file) => {
        setSelectedFile(file);
        setEditorContent(file.content);
        setReadOnly(false); // 파일을 선택하면 읽기 전용 상태 해제
    };

    return (
        <div className="home">
            <Sidebar onSelectFile={handleSelectFile} />
            <div className="editor-position">
                {/* 에디터 */}
                <div>
                    <IDEEditor
                        selectedFile={selectedFile}
                        value={editorContent}
                        onChange={setEditorContent}
                        readOnly={readOnly} // 읽기 전용 상태 전달
                    />
                </div>
                {/* 콘솔 */}
                <div style={{ marginTop: '20px' }}>
                    <Console result={result} /> {/* 결과를 콘솔에 전달 */}
                </div>
            </div>
        </div>
    );
};

export default Home;
