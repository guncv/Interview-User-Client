import { useSearchParams } from "react-router-dom";
import ChatHistory, { type ChatHistoryRef } from "../components/common/ChatHistory";
import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS, WEBSOCKET_TYPES } from "../constants";
import InterviewRecording from "../components/common/InterviewRecording";
import { useVoiceStreaming } from "../hook/useVoiceStreaming";
import { generateSegmentId } from "../utils/generator";
import { useSelector } from "react-redux";
import type { RootState } from "../reducers/rootReducer";

const audioQueue: ArrayBuffer[] = [];
let audioPlaying = false;
const audioCtx = new AudioContext();

async function playBinaryAudio(buffer: ArrayBuffer) {
    audioQueue.push(buffer);

    if (!audioPlaying) {
        audioPlaying = true;

        while (audioQueue.length > 0) {
            const currentBuffer = audioQueue.shift()!;

            try {
                const float32:any = convertPCM16ToFloat32(currentBuffer);
                const audioBuffer = audioCtx.createBuffer(
                    1,
                    float32.length,
                    24000
                );
                audioBuffer.copyToChannel(float32, 0);

                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                source.start();

                await new Promise<void>((resolve) => {
                    source.onended = () => resolve();
                });
            } catch (e) {
                console.error("Audio playback failed:", e);
            }
        }

        audioPlaying = false;
    }
}

function convertPCM16ToFloat32(buffer: ArrayBuffer): Float32Array {
    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);

    for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768; // Normalize to range [-1, 1]
    }

    return float32Array;
}


const InterviewSimulation = () => {
    const [searchParams] = useSearchParams();
    const sessionTokenParam = searchParams.get('session_token');
    const [websocketUrl] = useState(`ws://localhost:8080/api/v1/ws/connect/${sessionTokenParam}`);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);
    const chatHistoryRef = useRef<ChatHistoryRef>(null);

    // Get resume data from Redux store
    const resumeData = useSelector((state: RootState) => state.resume);

    useVoiceStreaming(websocketRef, sessionId);

    const handleWebSocketMessage = useCallback((response: any) => {
        switch (response.type) {
            case WEBSOCKET_TYPES.CONNECTION_ESTABLISHED:
                setSessionId(response.session_id);
                break;
            case WEBSOCKET_TYPES.USER_PARTIAL_TRANSCRIPT:
                chatHistoryRef.current?.handlePartialTranscript(response.segment_id, response.transcript, "user");
                break;
            case WEBSOCKET_TYPES.INTERVIWER_RESPONSE:
                const segment_id = generateSegmentId(sessionId || '');
                chatHistoryRef.current?.handlePartialTranscript(segment_id, response.message, "interviewer");
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
                        console.log("Received audio blob");
                        const buffer = await event.data.arrayBuffer();
                        const view = new DataView(buffer);
                
                        const headerLength = view.getUint32(0, false);
                        const headerBytes = new Uint8Array(buffer.slice(4, 4 + headerLength));
                        const headerJson = new TextDecoder("utf-8").decode(headerBytes);
                        const header = JSON.parse(headerJson);
                
                        const audioData = buffer.slice(4 + headerLength);
                        console.log("header", header);
                
                        if (header.type === WEBSOCKET_TYPES.INTERVIEWER_AUDIO_CHUNKING) {
                            console.log("Playing audio data");
                            await playBinaryAudio(audioData);
                        }
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
        <div style={{ width: '100%', height: '100%', padding: '20px' }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '50%', height: '100%' }}>
                    <ChatHistory ref={chatHistoryRef} session_token={sessionTokenParam || ''} />
                </div>

                <div style={{ width: '50%', height: '100%' }}>
                    <InterviewRecording 
                        websocketUrl={websocketUrl}
                        sessionToken={sessionTokenParam || ''}
                        currentResumeId={resumeData.resumeById.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default InterviewSimulation;
