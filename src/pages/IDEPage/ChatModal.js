import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ChatApp from './chat.js';
import { PiWechatLogoFill } from 'react-icons/pi';

const ChatModal = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                variant="secondary"
                onClick={handleShow}
                style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1050 }}
            >
                <PiWechatLogoFill size="30px" />
            </Button>

            <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ChatApp />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ChatModal;
