import { useEffect, useRef } from "react";
import { generateSegmentId } from "../utils/generator";
import { AUDIO_LEVEL, WEBSOCKET_TYPES } from "../constants";

export function useVoiceStreaming(
    websocketRef: React.MutableRefObject<WebSocket | null>,
    sessionId: string | null,
    onUserSpeakingChange?: (isSpeaking: boolean) => void,
    isMicMuted?: boolean,
    isConnected?: boolean,
    isConversationStarted?: boolean,
    isUserTurnRef?: React.MutableRefObject<boolean>
) {
    const segmentIdRef = useRef<string | null>(null);
    const segmentStartedRef = useRef<boolean>(false);
    const silenceTimerRef = useRef<number | null>(null);
    const speakingRef = useRef<boolean>(false);
    const lastSpeechTimeRef = useRef<number>(0);
    const segmentStartTimeRef = useRef<number>(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const lastSegmentEndTimeRef = useRef<number>(0);
    const segmentCooldownRef = useRef<number>(2000);

    useEffect(() => {
        if (!sessionId || !isConnected || !isConversationStarted || !isUserTurnRef?.current) {
            return;
        }

        let mediaStream: MediaStream;
        let audioContext: AudioContext;
        let analyser: AnalyserNode;
        let source: MediaStreamAudioSourceNode;

        async function startRecording() {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (error) {
                console.error('🎤 Failed to get microphone access:', error);
                return;
            }

            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';

            const recorder = new MediaRecorder(mediaStream, { mimeType });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                if (!segmentStartedRef.current || !segmentIdRef.current) {
                    return;
                }

                const fullBlob = new Blob(chunksRef.current, { type: mimeType });
            
                if (segmentIdRef.current && websocketRef.current?.readyState === WebSocket.OPEN) {
                    const reader = new FileReader();
            
                    reader.onloadend = () => {
                        const audioArrayBuffer = reader.result as ArrayBuffer;
            
                        const headerObj = {
                            type: "segment_audio",
                            session_id: sessionId,
                            segment_id: segmentIdRef.current,
                        };
                        const headerStr = JSON.stringify(headerObj);
                        const headerBytes = new TextEncoder().encode(headerStr);
            
                        const headerLengthBuffer = new Uint8Array(4);
                        new DataView(headerLengthBuffer.buffer).setUint32(0, headerBytes.length, false);
            
                        const totalLength = headerLengthBuffer.length + headerBytes.length + audioArrayBuffer.byteLength;
                        const framedBuffer = new Uint8Array(totalLength);
                        framedBuffer.set(headerLengthBuffer, 0);
                        framedBuffer.set(headerBytes, 4);
                        framedBuffer.set(new Uint8Array(audioArrayBuffer), 4 + headerBytes.length);
                        
                        websocketRef.current?.send(framedBuffer);
                        
                        lastSegmentEndTimeRef.current = Date.now();
                        websocketRef.current?.send(
                            JSON.stringify({
                                type: WEBSOCKET_TYPES.SEGMENT_END,
                                session_id: sessionId,
                                segment_id: segmentIdRef.current,
                                ended_at: Date.now() / 1000,
                            })
                        );
            
                        segmentIdRef.current = null;
                        segmentStartedRef.current = false;
                        segmentStartTimeRef.current = 0;
                        if (isUserTurnRef) {
                            isUserTurnRef.current = false;
                        }
                        console.log("sending segment end after setting", speakingRef.current, segmentStartedRef.current, isUserTurnRef?.current, "lastSegmentEndTime:", lastSegmentEndTimeRef.current, "currentTime:", Date.now(), "isUserTurn:", isUserTurnRef?.current);
                    };
            
                    reader.readAsArrayBuffer(fullBlob);
                } else {
                    lastSegmentEndTimeRef.current = Date.now();
                    // Set user turn to false immediately for real-time control
                    if (isUserTurnRef) {
                        isUserTurnRef.current = false;
                    }
                }
            };

            recorder.start();

            audioContext = new AudioContext();
            source = audioContext.createMediaStreamSource(mediaStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.fftSize);

            function detectSilence() {
                if (!isUserTurnRef?.current) {
                    if (speakingRef.current) {
                        speakingRef.current = false;
                        onUserSpeakingChange?.(false);
                    }
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

                const canSpeak = rms > AUDIO_LEVEL.MIN_AUDIO_LEVEL && !isMicMuted && isUserTurnRef?.current;

                if (canSpeak) {
                    lastSpeechTimeRef.current = currentTime;

                    const timeSinceLastSegment = Date.now() - lastSegmentEndTimeRef.current;
                    const canStartNewSegment = timeSinceLastSegment >= segmentCooldownRef.current;
                    
                    if (!speakingRef.current && !segmentStartedRef.current && isUserTurnRef?.current && canStartNewSegment) {
                        console.log("sending segment start", speakingRef.current, segmentStartedRef.current, isUserTurnRef?.current, canStartNewSegment, "timeSinceLastSegment:", timeSinceLastSegment, "lastSegmentEndTime:", lastSegmentEndTimeRef.current, "currentTime:", currentTime, "isUserTurn:", isUserTurnRef?.current);
                        speakingRef.current = true;
                        segmentStartTimeRef.current = currentTime;
                        const segmentId = generateSegmentId(sessionId || '');
                        segmentIdRef.current = segmentId;
                        segmentStartedRef.current = true;
                        onUserSpeakingChange?.(true);
                        
                        websocketRef.current?.send(
                            JSON.stringify({
                                type: WEBSOCKET_TYPES.SEGMENT_START,
                                session_id: sessionId,
                                segment_id: segmentId,
                                started_at: currentTime / 1000,
                            })
                        );
                    }

                    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                } else if (speakingRef.current && segmentIdRef.current) {
                    const silenceDuration = currentTime - lastSpeechTimeRef.current;
                    const totalSpeakingTime = currentTime - segmentStartTimeRef.current;

                    if (silenceDuration > 1500 && totalSpeakingTime > 2000) {
                        silenceTimerRef.current = window.setTimeout(() => {
                            speakingRef.current = false;
                            onUserSpeakingChange?.(false);

                            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                                mediaRecorderRef.current.stop();
                            }
                        }, 500);
                    }
                }

                requestAnimationFrame(detectSilence);
            }

            detectSilence();
        }

        startRecording();

        return () => {
            mediaRecorderRef.current?.stop();
            mediaStream?.getTracks().forEach((track) => track.stop());
            audioContext?.close();
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [websocketRef, sessionId, onUserSpeakingChange, isMicMuted, isConnected, isConversationStarted, isUserTurnRef]);
}