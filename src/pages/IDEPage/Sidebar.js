import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = ({ onSelectFile }) => {
    const [files, setFiles] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

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
                    data: { fileId: fileId },
                })
                .then((response) => {
                    console.log('File deleted:', fileId);
                    setFiles(files.filter((file) => file.file_pk !== fileId));
                })
                .catch((error) => {
                    console.error('Error deleting file:', error);
                });
        });
        setSelectedFiles([]);
    };

    const handleFileClick = async (fileId) => {
        try {
            const response = await axios.get(`/project/${fileId}`);
            onSelectFile(response.data);
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };

    return (
        <div className="sidebar-items">
            <div className="button-group">
                <Button variant="outline-light" size="sm" onClick={() => setShowInput(true)} className="sidebar-button">
                    +
                </Button>
                <Button variant="outline-light" size="sm" onClick={deleteFiles} className="sidebar-button">
                    -
                </Button>
            </div>
            {showInput && (
                <div className="input-container">
                    <Form.Control
                        type="text"
                        placeholder="파일 이름"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="file-input"
                    />
                    <Button variant="dark" onClick={createFile}>
                        확인
                    </Button>
                </div>
            )}

            {files.map((file) => (
                <div key={file.file_pk} className="sidebar-item">
                    <span onClick={() => handleFileClick(file.file_pk)}>{file.file_title}</span>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
