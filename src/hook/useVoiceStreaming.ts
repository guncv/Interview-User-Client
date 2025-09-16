import { useEffect, useRef } from "react";
import { generateSegmentId } from "../utils/generator";

export function useVoiceStreaming(
    websocketRef: React.MutableRefObject<WebSocket | null>,
    sessionId: string | null
) {
    const segmentIdRef = useRef<string | null>(null);
    const silenceTimerRef = useRef<number | null>(null);
    const speakingRef = useRef<boolean>(false);

    useEffect(() => {
        let mediaStream: MediaStream;
        let mediaRecorder: MediaRecorder;
        let audioContext: AudioContext;
        let analyser: AnalyserNode;
        let source: MediaStreamAudioSourceNode;

        async function startRecording() {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Check for supported MIME types for MediaRecorder
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
            return 'audio/webm'; // Fallback
        };

        const mimeType = getSupportedMimeType();
        console.log("Using audio MIME type:", mimeType);

        // MediaRecorder for sending audio chunks
        mediaRecorder = new MediaRecorder(mediaStream, { mimeType });
        mediaRecorder.ondataavailable = async (event) => {
            if (
                event.data.size > 0 &&
                websocketRef.current?.readyState === WebSocket.OPEN &&
                speakingRef.current &&
                sessionId &&
                segmentIdRef.current
            ) {
                const audioBuffer = await event.data.arrayBuffer();

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

                websocketRef.current.send(framedBuffer);
            }
        };

        mediaRecorder.start(300);

        audioContext = new AudioContext();
        source = audioContext.createMediaStreamSource(mediaStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.fftSize);

        function detectSilence() {
            analyser.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                const value = (dataArray[i] - 128) / 128.0;
                sum += value * value;
            }
            const rms = Math.sqrt(sum / dataArray.length);

            if (rms > 0.02) {
            // User is speaking
            if (!speakingRef.current) {
                speakingRef.current = true;
                if (sessionId) {
                const newSegmentId = generateSegmentId(sessionId);
                segmentIdRef.current = newSegmentId;
                websocketRef.current?.send(
                    JSON.stringify({
                    type: 'segment_start',
                    session_id: sessionId,
                    segment_id: newSegmentId,
                    started_at: Date.now() / 1000 // Add timestamp like VADRecorder
                    })
                );
                }
            }

            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
            }
            } else {
                if (speakingRef.current && !silenceTimerRef.current) {
                    silenceTimerRef.current = window.setTimeout(() => {
                    speakingRef.current = false;
                    if (sessionId && segmentIdRef.current) {
                        websocketRef.current?.send(
                        JSON.stringify({
                            type: 'segment_end',
                            session_id: sessionId,
                            segment_id: segmentIdRef.current,
                            ended_at: Date.now() / 1000 // Add timestamp like VADRecorder
                        })
                        );
                    }
                    segmentIdRef.current = null;
                    silenceTimerRef.current = null;
                    }, 2000);
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
        };
    }, [websocketRef, sessionId]);
}
