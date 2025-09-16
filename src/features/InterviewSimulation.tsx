import { useSearchParams } from "react-router-dom";
import ContentLayout from "../components/layout/ContentLayout";
import ChatHistory from "../components/common/ChatHistory";
import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS } from "../constants";

const InterviewSimulation = () => {
    const [searchParams] = useSearchParams();
    const sessionTokenParam = searchParams.get('session_token');
    const [websocketUrl, _] = useState(`ws://localhost:8080/api/v1/ws/connect/${sessionTokenParam}`);
    const websocketRef = useRef<WebSocket | null>(null);

    const initializeWebSocket = useCallback(() => {
        try {
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const wsUrl = accessToken
                ? `${websocketUrl}?access_token=${accessToken}`
                : websocketUrl;
        
            websocketRef.current = new WebSocket(wsUrl);
        
            websocketRef.current.onclose = (event) => {
                console.log("❌ WebSocket closed:", event.code, event.reason);
            };
        
            websocketRef.current.onerror = (error) => {
                console.error("⚠️ WebSocket error:", error);
            };
        
            websocketRef.current.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
            
                    switch (response.type) {
                        case "connection_established":
                        console.log("🔗 Connection established for session:", response.session_id);
                        break;
            
                        case "chat_message":
                        console.log("💬 Chat message:", response);
                        break;
            
                        case "error":
                        console.error("🚨 Server error:", response.message || response);
                        break;
            
                        default:
                        console.warn("🤔 Unknown message type:", response);
                    }
                } catch (error) {
                console.error("❌ Failed to parse WebSocket message:", error);
                }
            };
            } catch (error) {
            console.error("❌ Failed to initialize WebSocket:", error);
        }
    }, [websocketUrl]);
    
    useEffect(() => {
        initializeWebSocket();
        
        return () => {
            websocketRef.current?.close();
        };
    }, [initializeWebSocket]);
    
    return (
        <ContentLayout>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '50%', height: '100%' }}>
                    <ChatHistory session_token={sessionTokenParam || ''} />
                </div>
                
                <div style={{ width: '50%', height: '100%' }}>
                    {sessionTokenParam && <p>Query param 'session_token': {sessionTokenParam}</p>}
                </div>
            </div>
        </ContentLayout>
    );
};

export default InterviewSimulation;