import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = ({ onSelectFile }) => {
    const [files, setFiles] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 파일 목록 상태 추가

    useEffect(() => {
        axios
            .get('/project')
            .then((response) => {
                setFiles(response.data.filelist);
            })
            .catch((error) => {
                console.error('Error fetching files:', error);
            });
    }, []);

    const createFile = () => {
        if (nameInput.trim() !== '') {
            axios
                .post('/project/file', { fileName: nameInput })
                .then((response) => {
                    console.log('New file created:', response.data);
                    setFiles([...files, response.data]);
                })
                .catch((error) => {
                    console.error('Error creating new file:', error);
                });
            setNameInput('');
            setShowInput(false);
        }
    };

    const deleteFiles = () => {
        selectedFiles.forEach((fileId) => {
            axios
                .request({
                    url: `/project/file/${fileId}`,
                    method: 'DELETE',
                    data: {
                        fileId: fileId,
                    },
                })
                .then((response) => {
                    console.log('File deleted:', fileId);
                    setFiles(files.filter((file) => file.file_pk !== fileId));
                })
                .catch((error) => {
                    console.error('Error deleting file:', error);
                });
        });
        setSelectedFiles([]); // 선택된 파일 목록 초기화
    };

    const handleFileClick = async (fileId) => {
        try {
            const response = await axios.get(`/project/${fileId}`);
            onSelectFile(response.data); // 에디터에 선택된 파일 전달
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };

    return (
        <div className="sidebar-items">
            <div className="sidebar-item">
                <Button variant="dark" onClick={() => setShowInput(true)}>
                    +
                </Button>
                {showInput && (
                    <div>
                        <Form.Control
                            type="text"
                            placeholder="파일 이름"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            style={{
                                marginTop: '10px',
                                marginBottom: '10px',
                                backgroundColor: '#282c34',
                                color: 'white',
                                borderColor: '#313131',
                            }}
                        />
                        <Button variant="dark" onClick={createFile}>
                            확인
                        </Button>
                    </div>
                )}
            </div>
            <div className="sidebar-item">
                <Button variant="dark" onClick={deleteFiles}>
                    -
                </Button>
            </div>
            {files.map((file) => (
                <div key={file.file_pk} className="sidebar-item">
                    <span onClick={() => handleFileClick(file.file_pk)}>{file.file_title}</span>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
