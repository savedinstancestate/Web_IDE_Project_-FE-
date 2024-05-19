import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Alert, Modal } from 'react-bootstrap';
import './Sidebar.css';
import withAuth from '../../components/withAuth';
import { VscNewFile } from 'react-icons/vsc';
import { IoTrashOutline } from 'react-icons/io5';

const Sidebar = ({ onSelectFile }) => {
    const [files, setFiles] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [nameInput, setNameInput] = useState('');
    // const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    // const jwtToken = 'your-jwt-token-here';
    const [showModal, setShowModal] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(null);

    useEffect(() => {
        axios
            .get('/project', {
                // headers: {
                //     Authorization: `Bearer ${jwtToken}`,
                // },
            })
            .then((response) => {
                if (response.status === 200) {
                    setFiles(response.data.data.filelist);
                    setErrorMessage('');
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    setErrorMessage(error.response.data.message);
                } else {
                    console.error('파일 목록을 불러오는 중 오류가 발생했습니다:', error);
                }
            });
    }, []);

    const createFile = () => {
        if (nameInput.trim() !== '') {
            axios
                .post(
                    '/project/file',
                    {
                        fileName: { fileName: nameInput },
                    }
                    // {
                    //     headers: {
                    //         Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 포함한 Authorization 헤더 추가
                    //     },
                    // }
                )
                .then((response) => {
                    if (response.status === 200) {
                        console.log('New file created:', response.data);
                        setFiles([...files, response.data.data]);
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        alert('로그인 후 이용하실 수 있습니다.');
                    } else {
                        console.error('Error creating new file:', error);
                    }
                });
            setNameInput('');
            setShowInput(false);
        }
    };

    const confirmDelete = (fileId) => {
        setDeleteCandidate(fileId);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!deleteCandidate) return;
        try {
            const response = await axios.delete(`/project/file/${deleteCandidate}`, {
                // headers: { Authorization: `Bearer ${jwtToken}` },
                data: { fileId: deleteCandidate },
            });
            if (response.status === 200) {
                setFiles(files.filter((file) => file.fileId !== deleteCandidate));
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleFileClick = async (fileId) => {
        try {
            const response = await axios.get(
                `/project/${fileId}`
                // {
                //     headers: {
                //         Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 추가
                //     },
                // }
            );
            if (response.status === 200) {
                onSelectFile(response.data.data);
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    console.error('로그인 후 이용하실 수 있습니다:', error.response.data.message);
                } else {
                    console.error('Error fetching file content:', error.response.data.message);
                }
            } else {
                console.error('Network or other error:', error);
            }
        }
    };

    return (
        <div className="sidebar-items">
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <div className="button-group">
                <Button variant="outline-light" size="sm" onClick={() => setShowInput(true)} className="sidebar-button">
                    <VscNewFile style={{ marginRight: 10 }} />
                    파일 생성하기
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
                    <Button variant="dark" size="sm" onClick={createFile}>
                        확인
                    </Button>
                </div>
            )}

            {files.map((file) => (
                <div key={file.fileId} className="sidebar-item">
                    <span onClick={() => handleFileClick(file.fileId)}>{file.fileName}</span>
                    <button onClick={() => confirmDelete(file.fileId)} className="delete-button">
                        <IoTrashOutline />
                    </button>
                </div>
            ))}
            <Modal show={showModal} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>파일 삭제</Modal.Title>
                </Modal.Header>
                <Modal.Body>파일을 삭제합니다. 계속하시겠습니까?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        취소
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        확인
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default withAuth(Sidebar);
