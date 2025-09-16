import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatHistoryBySessionToken } from "../../actions/interviewAction";
import type { RootState } from "../../reducers/rootReducer";
import Colors from "../../assets/styles/Color";

interface ChatHistoryProps {
    session_token: string;
}

const ChatHistory = ({ session_token }: ChatHistoryProps) => {
    const dispatch = useDispatch();
    const chatHistory = useSelector((state: RootState) => state.interview.chatHistory);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    useEffect(() => {
        dispatch(getChatHistoryBySessionToken(session_token));
    }, []);

    
    return (
        <div ref={chatContainerRef} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            maxHeight: '100%',
            overflowY: 'auto',
            borderRadius: '8px',
        }}>
            {chatHistory.chat_history.map((chat) => (
                <div
                    key={chat.id}
                    style={{
                        display: 'flex',
                        justifyContent: chat.actor === 'interviewer' ? 'flex-start' : 'flex-end',
                        marginBottom: '8px'
                    }}
                >
                    <div
                        style={{
                            maxWidth: '70%',
                            padding: '12px 16px',
                            borderRadius: '18px',
                            backgroundColor: chat.actor === 'user' ? Colors.ACCENT_COLOR : Colors.TEXT_WHITE_COLOR,
                            color: chat.actor === 'user' ? Colors.TEXT_WHITE_COLOR : Colors.PRIMARY_COLOR,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            wordWrap: 'break-word',
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            fontSize: '12px',
                            opacity: 0.7,
                            marginBottom: '4px',
                            fontWeight: '500'
                        }}>
                            {chat.actor === 'user' ? 'You' : 'Interviewer'}
                        </div>
                        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                            {chat.transcript_text}
                        </div>
                        <div style={{
                            fontSize: '10px',
                            opacity: 0.6,
                            marginTop: '4px',
                            textAlign: 'right'
                        }}>
                            {chat.start_at} - {chat.end_at}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatHistory;