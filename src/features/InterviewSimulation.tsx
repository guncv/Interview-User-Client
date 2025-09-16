import { useSearchParams } from "react-router-dom";
import ContentLayout from "../components/layout/ContentLayout";
import ChatHistory from "../components/common/ChatHistory";
import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS } from "../constants";
import InterviewRecording from "../components/common/InterviewRecording";
import { useVoiceStreaming } from "../hook/useVoiceStreaming";

const audioQueue: Blob[] = [];
let audioPlaying = false;

async function playBinaryAudio(buffer: ArrayBuffer) {
    const blob = new Blob([buffer], { type: 'audio/webm' });
    audioQueue.push(blob);

    if (!audioPlaying) {
        audioPlaying = true;
        while (audioQueue.length > 0) {
            const currentBlob = audioQueue.shift();
            const audioUrl = URL.createObjectURL(currentBlob!);
            const audio = new Audio(audioUrl);

            try {
                await audio.play();
                await new Promise((resolve) => {
                    audio.onended = resolve;
                    audio.onerror = resolve;
                });
            } finally {
                URL.revokeObjectURL(audioUrl);
            }
        }
        audioPlaying = false;
    }
}

const InterviewSimulation = () => {
    const [searchParams] = useSearchParams();
    const sessionTokenParam = searchParams.get('session_token');
    const [websocketUrl] = useState(`ws://localhost:8080/api/v1/ws/connect/${sessionTokenParam}`);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);

    useVoiceStreaming(websocketRef, sessionId);

    const handleWebSocketMessage = useCallback((response: any) => {
        switch (response.type) {
            case "connection_established":
                setSessionId(response.session_id);
                break;
            case "chat_message":
                console.log("Chat message:", response);
                break;
            case "error":
                console.error("Server error:", response.message || response);
                break;
            case "disconnect":
                console.warn("Server disconnect:", response.message || response);
                break;
            default:
                console.warn("Unknown message type:", response);
        }
    }, []);

    const initializeWebSocket = useCallback(() => {
        try {
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const wsUrl = accessToken
                ? `${websocketUrl}?access_token=${accessToken}`
                : websocketUrl;

            websocketRef.current = new WebSocket(wsUrl);

            websocketRef.current.onclose = (event) => {
                console.log("WebSocket closed:", event.code, event.reason);
            };

            websocketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            websocketRef.current.onmessage = async (event) => {
                try {
                    if (event.data instanceof Blob) {
                        const arrayBuffer = await event.data.arrayBuffer();
                        playBinaryAudio(arrayBuffer);
                    } else {
                        const data = JSON.parse(event.data);
                        handleWebSocketMessage(data);
                    }
                } catch (error) {
                    console.error("Failed to handle WebSocket message:", error);
                }
            };
        } catch (error) {
            console.error("Failed to initialize WebSocket:", error);
        }
    }, [websocketUrl, handleWebSocketMessage]);

    useEffect(() => {
        initializeWebSocket();

        return () => {
            websocketRef.current?.close();
            websocketRef.current = null;
        };
    }, [initializeWebSocket]);

    return (
        <ContentLayout>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '50%', height: '100%' }}>
                    <ChatHistory session_token={sessionTokenParam || ''} />
                </div>

                <div style={{ width: '50%', height: '100%' }}>
                    <InterviewRecording />
                </div>
            </div>
        </ContentLayout>
    );
};

export default InterviewSimulation;
