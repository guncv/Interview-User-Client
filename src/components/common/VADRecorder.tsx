import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Play, Pause, Wifi, WifiOff } from 'lucide-react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import { STORAGE_KEYS } from '../../constants';

// Types
interface VADRecorderProps {
    websocketUrl?: string;
    onRecordingStart?: () => void;
    onRecordingStop?: () => void;
    onDataSent?: (chunk: AudioChunk) => void;
    onSegmentStart?: (segmentId: string) => void;
    onSegmentEnd?: (segmentId: string) => void;
    isMobile?: boolean;
    isTablet?: boolean;
}

export interface AudioChunk {
    id: string;
    timestamp: number;
    data: ArrayBuffer;
    isVoice: boolean;
    duration: number;
    sampleRate: number;
    segmentId: string;
}

interface VADRecorderState {
    isRecording: boolean;
    isPaused: boolean;
    isConnected: boolean;
    recordingTime: number;
    audioLevel: number;
    chunksSent: number;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    sessionId: string | null;
    serverResponses: ServerResponse[];
    currentSegmentId: string | null;
    isSegmentActive: boolean;
}

interface ServerResponse {
    id: string;
    timestamp: number;
    message: any;
    type: 'success' | 'error' | 'info' | 'warning';
}

// Constants
const VAD_THRESHOLD = 0.1;
const CHUNK_INTERVAL = 2000;
const MAX_RESPONSES = 20;
const AUDIO_CONFIG = {
    sampleRate: 48000,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
};
const INPUT_GAIN_MULTIPLIER = 1.6; // Boost mic level before quantization

// Helper Components
const ConnectionStatus: React.FC<{ status: string; isConnected: boolean; sessionId: string | null }> = ({ 
    status, 
    isConnected, 
    sessionId 
}) => {
    const getStatusColor = () => {
        switch (status) {
            case 'connected': return Colors.ACCENT_COLOR;
            case 'connecting': return Colors.SECONDARY_TEXT_COLOR;
            case 'error': return Colors.TEXT_ERROR_COLOR;
            default: return Colors.DISABLED_TEXT_COLOR;
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'connected': return <Wifi size={16} color={Colors.ACCENT_COLOR} />;
            case 'connecting': return <Wifi size={16} color={Colors.SECONDARY_TEXT_COLOR} />;
            case 'error': return <WifiOff size={16} color={Colors.TEXT_ERROR_COLOR} />;
            default: return <WifiOff size={16} color={Colors.DISABLED_TEXT_COLOR} />;
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: Size.Small,
            fontSize: Size.Small,
            fontFamily: font.Regular,
        }}>
            {getStatusIcon()}
            <span style={{ color: getStatusColor() }}>{status}</span>
            
            {isConnected && !sessionId && (
                <span style={{
                    fontSize: '10px',
                    color: Colors.SECONDARY_TEXT_COLOR,
                    fontStyle: 'italic',
                    marginLeft: Size.Small
                }}>
                    Waiting for session...
                </span>
            )}
        </div>
    );
};

const ControlButtons: React.FC<{
    isRecording: boolean;
    isPaused: boolean;
    isConnected: boolean;
    onStart: () => void;
    onStop: () => void;
    onTogglePause: () => void;
    isMobile: boolean;
    isTablet: boolean;
    isSegmentActive: boolean;
    onManualStartSegment: () => void;
    onManualEndSegment: () => void;
}> = ({ isRecording, isPaused, isConnected, onStart, onStop, onTogglePause, isMobile, isSegmentActive, onManualStartSegment, onManualEndSegment }) => {
    const buttonSize = isMobile ? '40px' : '50px';
    const recordButtonSize = isMobile ? '60px' : '70px';

    const baseButtonStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Size.Small,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: buttonSize,
        height: buttonSize,
    };

    const recordButtonStyle: React.CSSProperties = {
        ...baseButtonStyle,
        backgroundColor: isRecording ? Colors.TEXT_ERROR_COLOR : Colors.ACCENT_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        width: recordButtonSize,
        height: recordButtonSize,
    };

    const segmentButtonStyle: React.CSSProperties = {
        ...baseButtonStyle,
        backgroundColor: isSegmentActive ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        fontSize: '10px',
        width: 'auto',
        borderRadius: '20px',
        padding: '8px 16px',
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: Size.Medium,
            padding: Size.Medium,
        }}>
            {/* Main Recording Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: Size.Medium,
            }}>
                {!isRecording ? (
                    <button
                        style={recordButtonStyle}
                        onClick={onStart}
                        disabled={!isConnected}
                        title="Start Recording"
                    >
                        <Mic size={24} />
                    </button>
                ) : (
                    <>
                        <button
                            style={baseButtonStyle}
                            onClick={onTogglePause}
                            title={isPaused ? "Resume" : "Pause"}
                        >
                            {isPaused ? <Play size={20} /> : <Pause size={20} />}
                        </button>
                        <button
                            style={recordButtonStyle}
                            onClick={onStop}
                            title="Stop Recording"
                        >
                            <Square size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Manual Segment Controls */}
            {isRecording && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: Size.Small,
                    padding: Size.Small,
                    backgroundColor: Colors.ACCENT_COLOR_LIGHT + '20',
                    borderRadius: Size.Small,
                    border: `1px solid ${Colors.ACCENT_COLOR_LIGHT}`,
                }}>
                    <span style={{
                        fontSize: Size.Small,
                        fontFamily: font.Regular,
                        color: Colors.PRIMARY_COLOR,
                    }}>
                        Manual Segment Control:
                    </span>
                    <button
                        style={segmentButtonStyle}
                        onClick={onManualStartSegment}
                        disabled={isSegmentActive}
                        title="Manually start a new segment"
                    >
                        Start Segment
                    </button>
                    <button
                        style={{
                            ...segmentButtonStyle,
                            backgroundColor: isSegmentActive ? Colors.TEXT_ERROR_COLOR : Colors.DISABLED_TEXT_COLOR,
                        }}
                        onClick={onManualEndSegment}
                        disabled={!isSegmentActive}
                        title="Manually end current segment"
                    >
                        End Segment
                    </button>
                </div>
            )}
        </div>
    );
};

const InfoPanel: React.FC<{
    recordingTime: number;
    audioLevel: number;
    chunksSent: number;
    sessionId: string | null;
    vadThreshold: number;
    isSegmentActive: boolean;
    currentSegmentId: string | null;
}> = ({ recordingTime, audioLevel, chunksSent, sessionId, vadThreshold, isSegmentActive, currentSegmentId }) => {
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const infoRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: Size.Small,
        fontFamily: font.Regular,
    };

    const audioLevelBarStyle: React.CSSProperties = {
        width: '100%',
        height: '8px',
        backgroundColor: Colors.LECTURE_CONTENT_PART_COLOR,
        borderRadius: '4px',
        overflow: 'hidden',
    };

    const audioLevelFillStyle: React.CSSProperties = {
        height: '100%',
        backgroundColor: audioLevel > vadThreshold ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
        width: `${Math.min(audioLevel * 100, 100)}%`,
        transition: 'width 0.1s ease',
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: Size.Small,
            padding: Size.Medium,
            backgroundColor: Colors.ACCENT_COLOR_LIGHT + '20',
            borderRadius: Size.Small,
            border: `1px solid ${Colors.ACCENT_COLOR_LIGHT}`,
        }}>
            <div style={infoRowStyle}>
                <span>Recording Time:</span>
                <span style={{ fontFamily: font.Medium }}>{formatTime(recordingTime)}</span>
            </div>
            
            <div style={infoRowStyle}>
                <span>Audio Level:</span>
                <div style={{ width: '100px' }}>
                    <div style={audioLevelBarStyle}>
                        <div style={audioLevelFillStyle} />
                    </div>
                </div>
            </div>
            
            <div style={infoRowStyle}>
                <span>Chunks Sent:</span>
                <span style={{ fontFamily: font.Medium }}>{chunksSent}</span>
            </div>
            
            <div style={infoRowStyle}>
                <span>VAD Status:</span>
                <span style={{ 
                    color: audioLevel > vadThreshold ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
                    fontFamily: font.Medium 
                }}>
                    {audioLevel > vadThreshold ? 'Voice Detected' : 'Silence'}
                </span>
            </div>
            
            <div style={infoRowStyle}>
                <span>Segment Status:</span>
                <span style={{ 
                    color: isSegmentActive ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
                    fontFamily: font.Medium 
                }}>
                    {isSegmentActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            
            {sessionId && (
                <div style={infoRowStyle}>
                    <span>Session ID:</span>
                    <span style={{ 
                        color: Colors.ACCENT_COLOR,
                        fontSize: '10px',
                        backgroundColor: Colors.ACCENT_COLOR + '20',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                    }}>
                        {sessionId}
                    </span>
                </div>
            )}
            
            {currentSegmentId && (
                <div style={infoRowStyle}>
                    <span>Current Segment:</span>
                    <span style={{ 
                        color: Colors.ACCENT_COLOR,
                        fontSize: '10px',
                        backgroundColor: Colors.ACCENT_COLOR + '20',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                    }}>
                        {currentSegmentId.substring(0, 12)}...
                    </span>
                </div>
            )}
        </div>
    );
};

const ServerResponses: React.FC<{
    responses: ServerResponse[];
    onClear: () => void;
}> = ({ responses, onClear }) => {
    const getResponseTypeColor = (type: 'success' | 'error' | 'info' | 'warning') => {
        switch (type) {
            case 'success': return Colors.ACCENT_COLOR;
            case 'error': return Colors.TEXT_ERROR_COLOR;
            case 'warning': return Colors.SECONDARY_TEXT_COLOR;
            case 'info':
            default: return Colors.PRIMARY_COLOR;
        }
    };

    if (responses.length === 0) return null;

    return (
        <div style={{
            padding: Size.Medium,
            backgroundColor: Colors.ACCENT_COLOR_LIGHT + '10',
            borderRadius: Size.Small,
            border: `1px solid ${Colors.ACCENT_COLOR_LIGHT}`,
            maxHeight: '200px',
            overflowY: 'auto'
        }}>
            <div style={{
                fontSize: Size.Medium,
                fontFamily: font.Medium,
                color: Colors.PRIMARY_COLOR,
                marginBottom: Size.Small,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: Size.Small }}>
                    <span>📡</span>
                    Server Responses ({responses.length})
                </div>
                <button
                    onClick={onClear}
                    style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        backgroundColor: Colors.SECONDARY_TEXT_COLOR + '20',
                        border: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: Colors.SECONDARY_TEXT_COLOR,
                        fontFamily: font.Regular
                    }}
                    title="Clear all responses"
                >
                    Clear
                </button>
            </div>
            
            {responses.slice(-5).reverse().map((response) => (
                <div key={response.id} style={{
                    padding: Size.Small,
                    marginBottom: Size.Small,
                    backgroundColor: Colors.TEXT_WHITE_COLOR,
                    borderRadius: Size.Small,
                    border: `1px solid ${getResponseTypeColor(response.type)}`,
                    borderLeft: `4px solid ${getResponseTypeColor(response.type)}`
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: Size.Small,
                        fontSize: Size.Small,
                        fontFamily: font.Regular
                    }}>
                        <span style={{
                            color: getResponseTypeColor(response.type),
                            fontFamily: font.Medium,
                            textTransform: 'uppercase',
                            fontSize: '10px'
                        }}>
                            {response.type}
                        </span>
                        <span style={{
                            color: Colors.SECONDARY_TEXT_COLOR,
                            fontSize: '10px'
                        }}>
                            {new Date(response.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                    <div style={{
                        fontSize: Size.Small,
                        fontFamily: font.Regular,
                        color: Colors.PRIMARY_COLOR,
                        wordBreak: 'break-word'
                    }}>
                        {typeof response.message === 'object' 
                            ? JSON.stringify(response.message, null, 2)
                            : String(response.message)
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};

// Main Component
const VADRecorder: React.FC<VADRecorderProps> = ({
    websocketUrl = 'ws://localhost:8080/audio',
    onRecordingStart,
    onRecordingStop,
    onDataSent,
    onSegmentStart,
    onSegmentEnd,
    isMobile = false,
    isTablet = false,
}) => {
    // State
    const [state, setState] = useState<VADRecorderState>({
        isRecording: false,
        isPaused: false,
        isConnected: false,
        recordingTime: 0,
        audioLevel: 0,
        chunksSent: 0,
        connectionStatus: 'disconnected',
        sessionId: null,
        serverResponses: [],
        currentSegmentId: null,
        isSegmentActive: false
    });

    // Refs
    // MediaRecorder no longer used; kept removed to avoid lints
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const pcmChunksRef = useRef<Int16Array[]>([]);
    const pcmTotalSamplesRef = useRef<number>(0);
    const isRecordingRef = useRef<boolean>(false);
    const isPausedRef = useRef<boolean>(false);
    const isSegmentActiveRef = useRef<boolean>(false);

    // PCM helpers
    const floatTo16BitPCM = useCallback((input: Float32Array): Int16Array => {
        const output = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            let s = input[i];
            if (s < -1) s = -1;
            if (s > 1) s = 1;
            output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        return output;
    }, []);

    const resampleFloat32 = useCallback((input: Float32Array, fromRate: number, toRate: number): Float32Array => {
        if (fromRate === toRate) return input.slice(0);
        const ratio = fromRate / toRate;
        const newLength = Math.round(input.length / ratio);
        const result = new Float32Array(newLength);
        for (let i = 0; i < newLength; i++) {
            const origin = i * ratio;
            const index = Math.floor(origin);
            const frac = origin - index;
            const s1 = input[index] ?? 0;
            const s2 = input[index + 1] ?? s1;
            result[i] = s1 + (s2 - s1) * frac;
        }
        return result;
    }, []);

    const appendPcmChunk = useCallback((chunk: Int16Array) => {
        if (chunk.length === 0) return;
        pcmChunksRef.current.push(chunk);
        pcmTotalSamplesRef.current += chunk.length;
    }, []);

    const takePcmBuffer = useCallback((): { buffer: ArrayBuffer; samples: number } | null => {
        const total = pcmTotalSamplesRef.current;
        if (total === 0) return null;
        const merged = new Int16Array(total);
        let offset = 0;
        for (const c of pcmChunksRef.current) {
            merged.set(c, offset);
            offset += c.length;
        }
        pcmChunksRef.current = [];
        pcmTotalSamplesRef.current = 0;
        return { buffer: merged.buffer, samples: merged.length };
    }, []);

    // WebSocket Management
    const initializeWebSocket = useCallback(() => {
        try {
            setState(prev => ({ ...prev, connectionStatus: 'connecting' }));
            
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const wsUrl = accessToken ? `${websocketUrl}?access_token=${accessToken}` : websocketUrl;
            
            websocketRef.current = new WebSocket(wsUrl);
            
            websocketRef.current.onopen = () => {
                setState(prev => ({
                    ...prev,
                    isConnected: true,
                    connectionStatus: 'connected'
                }));
            };
            
            websocketRef.current.onclose = () => {
                setState(prev => ({ 
                    ...prev, 
                    isConnected: false, 
                    connectionStatus: 'disconnected' 
                }));
            };
            
            websocketRef.current.onerror = () => {
                setState(prev => ({ ...prev, connectionStatus: 'error' }));
            };
            
            // Note: WebSocket ping/pong is handled automatically by the browser
            // The Go server sends ping control frames using websocket.PingMessage
            // and the browser automatically responds with pong
            websocketRef.current.onmessage = (event) => {
                console.log('WebSocket message received from server:', event.data);
                
                try {
                    const response = JSON.parse(event.data);
                    
                    const serverResponse: ServerResponse = {
                        id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        timestamp: Date.now(),
                        message: response,
                        type: response.type || 'info'
                    };
                    
                    setState(prev => ({
                        ...prev,
                        serverResponses: [...prev.serverResponses, serverResponse]
                    }));

                    if (response.type === 'connection_established' && response.session_id) {
                        setState(prev => ({ ...prev, sessionId: response.session_id }));
                    }
                    
                } catch (error) {
                    const serverResponse: ServerResponse = {
                        id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        timestamp: Date.now(),
                        message: event.data,
                        type: 'info'
                    };
                    
                    setState(prev => ({
                        ...prev,
                        serverResponses: [...prev.serverResponses, serverResponse]
                    }));
                }
            };
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
            setState(prev => ({ ...prev, connectionStatus: 'error' }));
        }
    }, [websocketUrl]);

    // Segment Management
    const startSegment = useCallback(() => {
        console.log('startSegment called');
        
        if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
            console.error('WebSocket not open, cannot start segment.');
            return;
        }

        const segmentId = `segment${Date.now()}${state.sessionId}`;
        
        const segmentStartMessage = {
            type: 'segment_start',
            session_id: state.sessionId,
            segment_id: segmentId,
        };

        try {
            websocketRef.current.send(JSON.stringify(segmentStartMessage));
            setState(prev => ({ 
                ...prev, 
                currentSegmentId: segmentId,
                isSegmentActive: true 
            }));
            onSegmentStart?.(segmentId);
            
            console.log('Segment started successfully:', {
                segmentId,
                sessionId: state.sessionId,
                message: segmentStartMessage
            });
        } catch (error) {
            console.error('Failed to start segment:', error);
        }
    }, [state.sessionId, onSegmentStart]);

    const endSegment = useCallback(() => {
        if (!websocketRef.current ||
            websocketRef.current.readyState !== WebSocket.OPEN ||
            !state.currentSegmentId) {
            console.error('WebSocket not open or no active segment, cannot end segment.');
            return;
        }

        const segmentEndMessage = {
            type: 'segment_end',
            session_id: state.sessionId,
            segment_id: state.currentSegmentId
        };

        try {
            websocketRef.current.send(JSON.stringify(segmentEndMessage));
            const endedId = state.currentSegmentId;
            setState(prev => ({ 
                ...prev, 
                currentSegmentId: null,
                isSegmentActive: false 
            }));
            if (endedId) {
                onSegmentEnd?.(endedId);
            }
            
            console.log('Segment ended:', state.currentSegmentId);
        } catch (error) {
            console.error('Failed to end segment:', error);
        }
    }, [state.sessionId, state.currentSegmentId, onSegmentEnd]);

    const initializeAudio = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONFIG });
            
            audioContextRef.current = new AudioContext({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);
            sourceNodeRef.current = source;
            mediaStreamRef.current = stream;
            
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            analyserRef.current.smoothingTimeConstant = 0.8;
            
            source.connect(analyserRef.current);
            
            const updateAudioLevel = () => {
                if (analyserRef.current && state.isRecording) {
                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);
                    
                    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                    const normalizedLevel = average / 255;
                    
                    setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
                    requestAnimationFrame(updateAudioLevel);
                }
            };
            
            if (state.isRecording) {
                updateAudioLevel();
            }
            
            return stream;
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            throw error;
        }
    }, [state.isRecording]);

    // Recording Controls
    const startRecording = useCallback(async () => {
        try {
            await initializeAudio();

            // Start segment BEFORE capturing
            startSegment();

            // Reset counters and timers
            setState(prev => ({ ...prev, isRecording: true, recordingTime: 0 }));
            isRecordingRef.current = true;
            isPausedRef.current = false;
            onRecordingStart?.();
            if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = setInterval(() => {
                setState(prev => ({ ...prev, recordingTime: prev.recordingTime + 1 }));
            }, 1000);

            // Create processor for PCM capture
            if (audioContextRef.current && sourceNodeRef.current) {
                try { await audioContextRef.current.resume(); } catch {}
                scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                scriptProcessorRef.current.onaudioprocess = (e) => {
                    if (!isRecordingRef.current || isPausedRef.current || !isSegmentActiveRef.current) return;
                    const input = e.inputBuffer.getChannelData(0);
                    // Apply a gentle gain to improve STT detectability
                    const gained = new Float32Array(input.length);
                    for (let i = 0; i < input.length; i++) {
                        let s = input[i] * INPUT_GAIN_MULTIPLIER;
                        if (s < -1) s = -1;
                        if (s > 1) s = 1;
                        gained[i] = s;
                    }
                    const ac = audioContextRef.current!;
                    const targetRate = 16000;
                    const fromRate = ac.sampleRate;
                    const floatData = fromRate === targetRate ? gained : resampleFloat32(gained, fromRate, targetRate);
                    const pcm = floatTo16BitPCM(floatData);
                    appendPcmChunk(pcm);
                };
                // Ensure processor runs by connecting to destination (silence)
                sourceNodeRef.current.connect(scriptProcessorRef.current);
                scriptProcessorRef.current.connect(audioContextRef.current.destination);
            }
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    }, [initializeAudio, onRecordingStart, startSegment, appendPcmChunk, floatTo16BitPCM, resampleFloat32, state.isRecording, state.isPaused, state.isSegmentActive]);

    const togglePause = useCallback(() => {
        if (state.isPaused) {
            setState(prev => ({ ...prev, isPaused: false }));
            isPausedRef.current = false;
            // Start a new segment when resuming
            startSegment();
        } else {
            setState(prev => ({ ...prev, isPaused: true }));
            isPausedRef.current = true;
            // End segment when pausing
            if (state.isSegmentActive) {
                endSegment();
            }
        }
    }, [state.isPaused, state.isSegmentActive, startSegment, endSegment]);

    const sendPcmBuffer = useCallback(async (arrayBuffer: ArrayBuffer, durationSeconds: number) => {
        console.log('sendPcmBuffer called:', {
            websocketOpen: websocketRef.current?.readyState === WebSocket.OPEN,
            isSegmentActive: state.isSegmentActive,
            currentSegmentId: state.currentSegmentId,
            byteLength: arrayBuffer.byteLength
        });
        if (websocketRef.current?.readyState === WebSocket.OPEN && state.isSegmentActive && state.currentSegmentId) {
            try {
                const headerObj = {
                    type: 'audio_chunk',
                    session_id: state.sessionId || '',
                    segment_id: state.currentSegmentId,
                    encoding: 'LINEAR16',
                    sample_rate_hz: 16000,
                    num_channels: 1
                };

                const headerStr = JSON.stringify(headerObj);
                const headerBytes = new TextEncoder().encode(headerStr);

                const headerLengthBuffer = new Uint8Array(4);
                const view = new DataView(headerLengthBuffer.buffer);
                view.setUint32(0, headerBytes.length, false);

                const framedBuffer = new Uint8Array(headerLengthBuffer.length + headerBytes.length + arrayBuffer.byteLength);
                framedBuffer.set(headerLengthBuffer, 0);
                framedBuffer.set(headerBytes, headerLengthBuffer.length);
                framedBuffer.set(new Uint8Array(arrayBuffer), headerLengthBuffer.length + headerBytes.length);

                websocketRef.current.send(framedBuffer);
                setState(prev => ({ ...prev, chunksSent: prev.chunksSent + 1 }));

                // Emit callback for UI consumers
                const chunkInfo: AudioChunk = {
                    id: `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    timestamp: Date.now(),
                    data: arrayBuffer,
                    isVoice: state.audioLevel > VAD_THRESHOLD,
                    duration: durationSeconds,
                    sampleRate: 16000,
                    segmentId: state.currentSegmentId!
                };
                onDataSent?.(chunkInfo);
            } catch (error) {
                console.error('Failed to send PCM buffer:', error);
            }
        } else {
            console.log('Cannot send PCM buffer - conditions not met');
        }
    }, [state.sessionId, state.currentSegmentId, state.isSegmentActive, state.audioLevel, onDataSent]);
    

    const sendAccumulatedChunks = useCallback(() => {
        const taken = takePcmBuffer();
        if (!taken) return;
        const duration = taken.samples / 16000;
        sendPcmBuffer(taken.buffer, duration);
    }, [sendPcmBuffer, takePcmBuffer]);

    const stopRecording = useCallback(async () => {
        if (!state.isRecording) return;
        isRecordingRef.current = false;
        // Send any remaining accumulated samples before stopping
        if (state.isSegmentActive) {
            sendAccumulatedChunks();
            await new Promise(resolve => setTimeout(resolve, 100));
            endSegment();
        }

        // Disconnect processor
        try {
            if (scriptProcessorRef.current && sourceNodeRef.current) {
                sourceNodeRef.current.disconnect(scriptProcessorRef.current);
                scriptProcessorRef.current.disconnect();
            }
        } catch {}
        scriptProcessorRef.current = null;

        // Stop media tracks
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
        }

        // Close audio context
        try {
            await audioContextRef.current?.close();
        } catch {}
        audioContextRef.current = null;
        analyserRef.current = null;
        sourceNodeRef.current = null;

        // Update state and timers
        setState(prev => ({ ...prev, isRecording: false }));
        onRecordingStop?.();
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
        }
    }, [state.isRecording, state.isSegmentActive, sendAccumulatedChunks, endSegment, onRecordingStop]);

    // Keep refs in sync with state changes relevant to processing
    useEffect(() => { isRecordingRef.current = state.isRecording; }, [state.isRecording]);
    useEffect(() => { isPausedRef.current = state.isPaused; }, [state.isPaused]);
    useEffect(() => { isSegmentActiveRef.current = state.isSegmentActive; }, [state.isSegmentActive]);
    

    // Effects
    useEffect(() => {
        initializeWebSocket();
        
        return () => {
            websocketRef.current?.close();
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
        };
    }, [initializeWebSocket]);

    useEffect(() => {
        if (state.serverResponses.length > MAX_RESPONSES) {
            setState(prev => ({
                ...prev,
                serverResponses: prev.serverResponses.slice(-MAX_RESPONSES)
            }));
        }
    }, [state.serverResponses.length]);

    useEffect(() => {
        if (state.isRecording && !state.isPaused && state.isSegmentActive) {
            const intervalId = setInterval(() => {
                sendAccumulatedChunks();
            }, CHUNK_INTERVAL);
            return () => clearInterval(intervalId);
        }
    }, [state.isRecording, state.isPaused, state.isSegmentActive, sendAccumulatedChunks]);

    // Styles
    const containerStyle: React.CSSProperties = {
        padding: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Large,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        borderRadius: Size.Small,
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Medium,
        minHeight: '200px',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: Size.Small,
        borderBottom: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
    };

    const titleStyle: React.CSSProperties = {
        fontSize: isMobile ? Size.Medium : Size.LargeMedium,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        display: 'flex',
        alignItems: 'center',
        gap: Size.Small,
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={titleStyle}>
                    <Mic size={20} color={Colors.ACCENT_COLOR} />
                    VAD Audio Recorder
                </div>
                <ConnectionStatus 
                    status={state.connectionStatus}
                    isConnected={state.isConnected}
                    sessionId={state.sessionId}
                />
            </div>

            <ControlButtons
                isRecording={state.isRecording}
                isPaused={state.isPaused}
                isConnected={state.isConnected}
                onStart={startRecording}
                onStop={stopRecording}
                onTogglePause={togglePause}
                isMobile={isMobile}
                isTablet={isTablet}
                isSegmentActive={state.isSegmentActive}
                onManualStartSegment={startSegment}
                onManualEndSegment={endSegment}
            />

            <InfoPanel
                recordingTime={state.recordingTime}
                audioLevel={state.audioLevel}
                chunksSent={state.chunksSent}
                sessionId={state.sessionId}
                vadThreshold={VAD_THRESHOLD}
                isSegmentActive={state.isSegmentActive}
                currentSegmentId={state.currentSegmentId}
            />

            {/* Add segment status display */}
            <div style={{
                padding: Size.Small,
                backgroundColor: state.isSegmentActive ? Colors.ACCENT_COLOR + '20' : Colors.SECONDARY_TEXT_COLOR + '20',
                borderRadius: Size.Small,
                border: `1px solid ${state.isSegmentActive ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR}`,
                fontSize: Size.Small,
                fontFamily: font.Regular,
                textAlign: 'center',
                color: state.isSegmentActive ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
            }}>
                {state.isSegmentActive ? (
                    <span>
                        🎤 Recording Segment: {state.currentSegmentId?.substring(0, 8)}...
                    </span>
                ) : (
                    <span>
                        🔇 Waiting for voice activity...
                    </span>
                )}
            </div>

            <ServerResponses
                responses={state.serverResponses}
                onClear={() => setState(prev => ({ ...prev, serverResponses: [] }))}
            />

            {!state.isConnected && (
                <div style={{
                    padding: Size.Small,
                    backgroundColor: Colors.TEXT_ERROR_COLOR + '20',
                    borderRadius: Size.Small,
                    border: `1px solid ${Colors.TEXT_ERROR_COLOR}`,
                    color: Colors.TEXT_ERROR_COLOR,
                    fontSize: Size.Small,
                    textAlign: 'center',
                    fontFamily: font.Regular,
                }}>
                    WebSocket not connected. Please check your backend server.
                </div>
            )}
        </div>
    );
};

export default VADRecorder;