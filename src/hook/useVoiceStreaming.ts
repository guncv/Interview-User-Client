import { useEffect, useRef } from "react";
import { generateSegmentId } from "../utils/generator";

export interface AudioChunk {
    id: string;
    blob: Blob;
    timestamp: number;
    duration?: number;
    segmentId?: string;
}

async function sendingAudioChunk(
    event: any, 
    sessionId: string, 
    segmentIdRef: React.MutableRefObject<string | null>, 
    websocketRef: React.MutableRefObject<WebSocket | null>,
    onAudioChunk?: (chunk: AudioChunk) => void
) {
    const audioBuffer = await event.data.arrayBuffer();

    // Create debug audio chunk
    if (onAudioChunk && event.data instanceof Blob) {
        const audioChunk: AudioChunk = {
            id: generateSegmentId(sessionId),
            blob: event.data,
            timestamp: Date.now(),
            segmentId: segmentIdRef.current || undefined
        };
        onAudioChunk(audioChunk);
    }

    const headerObj = {
        type: 'audio_chunk',
        session_id: sessionId,
        segment_id: segmentIdRef.current,
        encoding: 'LINEAR16',
        sample_rate_hz: 16000,
        num_channels: 1
    };

    const headerStr = JSON.stringify(headerObj);
    const headerBytes = new TextEncoder().encode(headerStr);

    const headerLengthBuffer = new Uint8Array(4);
    const view = new DataView(headerLengthBuffer.buffer);
    view.setUint32(0, headerBytes.length, false);

    const framedBuffer = new Uint8Array(headerLengthBuffer.length + headerBytes.length + audioBuffer.byteLength);
    framedBuffer.set(headerLengthBuffer, 0);
    framedBuffer.set(headerBytes, headerLengthBuffer.length);
    framedBuffer.set(new Uint8Array(audioBuffer), headerLengthBuffer.length + headerBytes.length);

    websocketRef.current?.send(framedBuffer);
}

export function useVoiceStreaming(
    websocketRef: React.MutableRefObject<WebSocket | null>,
    sessionId: string | null,
    onUserSpeakingChange?: (isSpeaking: boolean) => void,
    isMicMuted?: boolean,
    isConnected?: boolean,
    isConversationStarted?: boolean,
    isAiSpeaking?: boolean,
    isVoiceInputEnabled?: boolean,
    onUserSegmentEnd?: () => void,
    isUserTurn?: boolean,
    onAudioChunk?: (chunk: AudioChunk) => void
) {
    const segmentIdRef = useRef<string | null>(null);
    const silenceTimerRef = useRef<number | null>(null);
    const chunkEndTimerRef = useRef<number | null>(null);
    const speakingRef = useRef<boolean>(false);
    const lastSpeechTimeRef = useRef<number>(0);
    const segmentStartTimeRef = useRef<number>(0);
    const onSegmentStarted = useRef<boolean>(false);

    useEffect(() => {
        if (!sessionId || !isConnected || !isConversationStarted) {
            return;
        }

        let mediaStream: MediaStream;
        let mediaRecorder: MediaRecorder;
        let audioContext: AudioContext;
        let analyser: AnalyserNode;
        let source: MediaStreamAudioSourceNode;

        async function startRecording() {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const getSupportedMimeType = (): string => {
                const types = [
                    'audio/webm;codecs=opus',
                    'audio/webm',
                    'audio/mp4',
                    'audio/wav',
                    'audio/ogg'
                ];
                
                for (const type of types) {
                    if (MediaRecorder.isTypeSupported(type)) {
                        return type;
                    }
                }
                return 'audio/webm';
            };

            const mimeType = getSupportedMimeType();

            mediaRecorder = new MediaRecorder(mediaStream, { mimeType });
            mediaRecorder.ondataavailable = async (event) => {
                if (
                    event.data.size > 0 &&
                    websocketRef.current?.readyState === WebSocket.OPEN &&
                    speakingRef.current &&
                    sessionId &&
                    segmentIdRef.current &&
                    !isMicMuted
                ) {
                    await sendingAudioChunk(event, sessionId, segmentIdRef, websocketRef, onAudioChunk);
                }
            };

            mediaRecorder.start(2000);

            audioContext = new AudioContext();
            source = audioContext.createMediaStreamSource(mediaStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.3;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.fftSize);

            function detectSilence() {
                if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN || !sessionId) {
                    if (chunkEndTimerRef.current) {
                        clearTimeout(chunkEndTimerRef.current);
                        chunkEndTimerRef.current = null;
                    }
                    if (silenceTimerRef.current) {
                        clearTimeout(silenceTimerRef.current);
                        silenceTimerRef.current = null;
                    }
                    speakingRef.current = false;
                    onUserSpeakingChange?.(false);
                    segmentIdRef.current = null;
                    
                    requestAnimationFrame(detectSilence);
                    return;
                }

                analyser.getByteTimeDomainData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    const value = (dataArray[i] - 128) / 128.0;
                    sum += value * value;
                }
                const rms = Math.sqrt(sum / dataArray.length);
                const currentTime = Date.now();

                if (rms > 0.05 && !isMicMuted && !isAiSpeaking && isVoiceInputEnabled && isUserTurn) {
                    console.log('rms is greater than 0.05 threshold - user turn detected', { 
                        rms, 
                        isMicMuted, 
                        isAiSpeaking, 
                        isVoiceInputEnabled,
                        isUserTurn,
                        speakingRef: speakingRef.current 
                    });
                    lastSpeechTimeRef.current = currentTime;
                    
                    if (!speakingRef.current && !onSegmentStarted.current) {
                        console.log('User is speaking to start user speaking');
                            onSegmentStarted.current = true;
                            speakingRef.current = true;
                            segmentStartTimeRef.current = currentTime;
                            onUserSpeakingChange?.(true);
                        
                        if (sessionId) {
                            const newSegmentId = generateSegmentId(sessionId);
                            segmentIdRef.current = newSegmentId;
                            
                            if (websocketRef.current?.readyState === WebSocket.OPEN) {
                                websocketRef.current.send(
                                    JSON.stringify({
                                        type: 'segment_start',
                                        session_id: sessionId,
                                        segment_id: newSegmentId,
                                        started_at: currentTime / 1000
                                    })
                                );
                            }
                        }
                    }

                    if (chunkEndTimerRef.current) {
                        clearTimeout(chunkEndTimerRef.current);
                        chunkEndTimerRef.current = null;
                    }
                    if (silenceTimerRef.current) {
                        clearTimeout(silenceTimerRef.current);
                        silenceTimerRef.current = null;
                    }
                } else if (speakingRef.current && segmentIdRef.current) {
                    const silenceDuration = currentTime - lastSpeechTimeRef.current;
                    const totalSpeakingTime = currentTime - segmentStartTimeRef.current;
                    const minSpeakingTime = 2000;
                    
                    if (silenceDuration >= 2000 && totalSpeakingTime >= minSpeakingTime && !chunkEndTimerRef.current) {
                        chunkEndTimerRef.current = window.setTimeout(() => {
                            console.log('Silence duration is greater than 2 seconds and total speaking time is greater than 2 seconds');
                            if (mediaRecorder && mediaRecorder.state === 'recording') {
                                mediaRecorder.requestData();
                            }
                            
                            setTimeout(() => {
                                if (sessionId && segmentIdRef.current && websocketRef.current?.readyState === WebSocket.OPEN) {
                                    websocketRef.current.send(
                                        JSON.stringify({
                                            type: 'segment_end',
                                            session_id: sessionId,
                                            segment_id: segmentIdRef.current,
                                            ended_at: Date.now() / 1000
                                        })
                                    );
                                }
                                
                        speakingRef.current = false;
                        onUserSpeakingChange?.(false);
                        onSegmentStarted.current = false;
                        segmentIdRef.current = null;
                        segmentStartTimeRef.current = 0;
                        chunkEndTimerRef.current = null;
                        
                        onUserSegmentEnd?.();
                            }, 100);
                        }, 500);
                    }
                    
                } else {
                    // Debug why user speaking is not detected
                    if (rms > 0.05) {
                        console.log('Voice detected but user speaking blocked', {
                            rms,
                            isMicMuted,
                            isAiSpeaking,
                            isVoiceInputEnabled,
                            isUserTurn,
                            speakingRef: speakingRef.current
                        });
                    }
                    
                    if (chunkEndTimerRef.current) {
                        clearTimeout(chunkEndTimerRef.current);
                        chunkEndTimerRef.current = null;
                    }
                    if (silenceTimerRef.current) {
                        clearTimeout(silenceTimerRef.current);
                        silenceTimerRef.current = null;
                    }
                }

                requestAnimationFrame(detectSilence);
            }

            detectSilence();
        }

        startRecording();

        return () => {
            mediaRecorder?.stop();
            mediaStream?.getTracks().forEach((track) => track.stop());
            audioContext?.close();
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (chunkEndTimerRef.current) clearTimeout(chunkEndTimerRef.current);
        };
    }, [websocketRef, sessionId, onUserSpeakingChange, isMicMuted, isConnected, isConversationStarted, isAiSpeaking, isVoiceInputEnabled, onUserSegmentEnd, isUserTurn]);
}
