import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ChatApp = () => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [nickname, setNickname] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const chatRef = useRef(null); // 채팅 컨테이너 참조
    const isConnected = useRef(false);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (isConnected.current && stompClient) {
                stompClient.disconnect();
                console.log('Disconnected');
            }
        };
    }, []);

    const connectWebSocket = () => {
        const socket = new SockJS('/chat'); // 서버에 설정된 엔드포인트 '/chat'으로 SockJS 인스턴스 생성
        const client = Stomp.over(socket); // SockJS 인스턴스를 사용하여 Stomp 클라이언트 생성

        client.connect(
            {},
            (frame) => {
                // Stomp로 연결 시도
                isConnected.current = true;
                console.log('Connected: ' + frame);

                setupSubscriptions(client);
                const userInfo = { userId: 1, roomId: 1 }; // 사용자 정보 예시
                client.send('/chat/client/enter', {}, JSON.stringify(userInfo)); // 입장 메시지
                setStompClient(client); // Stomp 클라이언트 상태 업데이트
            },
            handleWebSocketError
        );
    };

    const setupSubscriptions = (client) => {
        client.subscribe('/chat/server/messages', (messageOutput) => {
            displayMessage(messageOutput.body);
        });
        client.subscribe('/chat/server/enter', (nickname) => {
            updateNickname(nickname.body);
            displayMessage(`[${nickname.body}] 님 환영합니다~`);
        });
        client.subscribe('/chat/server/exit', (nickname) => {
            displayMessage(`[${nickname.body}] 님 byebye~~`);
        });
    };

    // 웹소켓 오류 처리
    const handleWebSocketError = (error) => {
        console.error('WebSocket Error:', error);
        isConnected.current = false;
        setTimeout(connectWebSocket, 5000);
    };

    // 메시지 표시
    const displayMessage = (messageData) => {
        setMessages((prev) => [...prev, messageData]); // 상태 업데이트로 메시지 목록에 새 메시지 추가
        scrollToBottom();
    };

    // 닉네임 업데이트
    const updateNickname = (newNickname) => {
        setNickname(newNickname);
    };

    const scrollToBottom = () => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    };

    // 메시지 전송
    const sendMessage = () => {
        if (messageContent && isConnected.current) {
            const chatMessage = { messageContent, memberId: 1, chattingRoomId: 1 };
            console.log('Sending message:', chatMessage);
            stompClient.send('/chat/client/chatting', {}, JSON.stringify(chatMessage));
            setMessageContent('');
        } else {
            console.log('Failed to send message. Either not connected or no content.');
        }
    };

    return (
        <div>
            <div
                id="chat"
                style={{
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    padding: '10px',
                    width: '100%',
                    height: '400px',
                    overflowY: 'auto',
                }}
                ref={chatRef}
            >
                {messages.map((message, index) => (
                    <div key={index} style={{ wordWrap: 'break-word' }}>
                        {message}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <input type="text" value={nickname} style={{ flex: 1, marginRight: '5px' }} placeholder="Your ID" />
                <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)} // 입력값 업데이트
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={{ flex: 4 }}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} style={{ flex: 1 }}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatApp;
