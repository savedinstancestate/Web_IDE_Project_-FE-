import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Alert } from 'react-bootstrap';
import './Sidebar.css';
import withAuth from '../../components/withAuth';

const Sidebar = ({ onSelectFile }) => {
    const [files, setFiles] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [nameInput, setNameInput] = useState('');
    // const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    // const jwtToken = 'your-jwt-token-here';

    useEffect(() => {
        axios
            .get('https://f60f01f3-6e14-4580-8fed-fd8dc5a682e1.mock.pstmn.io/project', {
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
                    'https://f60f01f3-6e14-4580-8fed-fd8dc5a682e1.mock.pstmn.io/project/file',
                    {
                        fileName: { fileName: nameInput }, // API 명세에 맞춘 수정
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
                        setFiles([...files, response.data.data]); // 성공 응답 처리
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        alert('로그인 후 이용하실 수 있습니다.'); // 상태 코드 400일 때 오류 메시지 처리
                    } else {
                        console.error('Error creating new file:', error);
                    }
                });
            setNameInput('');
            setShowInput(false);
        }
    };

    const deleteFile = async (fileId) => {
        if (!fileId) return; // 파일 ID가 제공되지 않았다면 함수를 종료
        try {
            const response = await axios.delete(
                `https://f60f01f3-6e14-4580-8fed-fd8dc5a682e1.mock.pstmn.io/project/file/${fileId}`,
                {
                    // headers: {
                    //     Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 포함한 Authorization 헤더 추가
                    // },
                    data: {
                        fileId: fileId, // 요청 바디에 fileId 포함
                    },
                }
            );
            if (response.status === 200) {
                console.log('File deleted successfully:', response.data.message);
                // alert('파일 삭제 성공'); // 사용자에게 성공 메시지 표시
                // 성공적으로 파일을 삭제했다면 파일 목록에서 해당 파일을 제거
                setFiles(files.filter((file) => file.fileId !== fileId));
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (error) {
            if (error.response) {
                // 상태 코드 400일 때 오류 메시지 처리
                console.error('Error deleting file:', error.response.data.message);
                alert(error.response.data.message); // 사용자에게 서버 응답 메시지를 보여줌
            } else {
                console.error('Network or other error:', error);
                alert('An unexpected error occurred.'); // 네트워크 오류나 기타 예외 처리
            }
        }
    };

    const handleFileClick = async (fileId) => {
        try {
            const response = await axios.get(
                `https://f60f01f3-6e14-4580-8fed-fd8dc5a682e1.mock.pstmn.io/project/${fileId}`
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
                // 상태 코드 400 처리
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
                    +
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
                        Create
                    </Button>
                </div>
            )}

            {files.map((file) => (
                <div key={file.fileId} className="sidebar-item">
                    <span onClick={() => handleFileClick(file.fileId)}>{file.fileName}</span>
                    <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => deleteFile(file.fileId)}
                        className="sidebar-button"
                    >
                        -
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default withAuth(Sidebar);
