import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Play, Pause, Wifi, WifiOff } from 'lucide-react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import { STORAGE_KEYS } from '../../constants';

interface VADRecorderProps {
    websocketUrl?: string;
    onRecordingStart?: () => void;
    onRecordingStop?: () => void;
    onDataSent?: (chunk: AudioChunk) => void;
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
}

interface VADRecorderState {
    isRecording: boolean;
    isPaused: boolean;
    isConnected: boolean;
    recordingTime: number;
    audioLevel: number;
    chunksSent: number;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const VADRecorder: React.FC<VADRecorderProps> = ({
    websocketUrl = 'ws://localhost:8080/audio',
    onRecordingStart,
    onRecordingStop,
    onDataSent,
    isMobile = false,
    isTablet = false,
}) => {
    const [state, setState] = useState<VADRecorderState>({
        isRecording: false,
        isPaused: false,
        isConnected: false,
        recordingTime: 0,
        audioLevel: 0,
        chunksSent: 0,
        connectionStatus: 'disconnected'
    });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const vadThreshold = 0.1;

    const initializeWebSocket = useCallback(() => {
        try {
            setState(prev => ({ ...prev, connectionStatus: 'connecting' }));
            
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            
            // For initial connection, we can only use the base URL
            // Authentication will be sent as first message after connection
            websocketRef.current = new WebSocket(websocketUrl);
            
            websocketRef.current.onopen = () => {
                setState(prev => ({ 
                    ...prev, 
                    isConnected: true, 
                    connectionStatus: 'connected' 
                }));
                console.log('WebSocket connected');
                
                // Send authentication as first message after connection
                if (accessToken && websocketRef.current) {
                    const authMessage = {
                        type: 'authentication',
                        access_token: accessToken,
                        timestamp: Date.now()
                    };
                    websocketRef.current.send(JSON.stringify(authMessage));
                    console.log('Authentication message sent');
                }
            };
            
            websocketRef.current.onclose = () => {
                setState(prev => ({ 
                    ...prev, 
                    isConnected: false, 
                    connectionStatus: 'disconnected' 
                }));
                console.log('WebSocket disconnected');
            };
            
            websocketRef.current.onerror = (error) => {
                setState(prev => ({ 
                    ...prev, 
                    connectionStatus: 'error' 
                }));
                console.error('WebSocket error:', error);
            };
            
            websocketRef.current.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    console.log('Received from server:', response);
                } catch (error) {
                    console.log('Raw message from server:', event.data);
                }
            };
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
            setState(prev => ({ ...prev, connectionStatus: 'error' }));
        }
    }, [websocketUrl]);

    const initializeAudio = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            
            audioContextRef.current = new AudioContext({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);
            
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            analyserRef.current.smoothingTimeConstant = 0.8;
            
            source.connect(analyserRef.current);
            
            // Start audio level monitoring
            const updateAudioLevel = () => {
                if (analyserRef.current && state.isRecording) {
                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);
                    
                    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                    const normalizedLevel = average / 255;
                    
                    setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
                    
                    if (normalizedLevel > vadThreshold) {
                        // Voice detected - could trigger additional processing
                        console.log('Voice activity detected');
                    }
                    
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

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            const stream = await initializeAudio();
            
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 16000
            });
            
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorderRef.current.onstart = () => {
                setState(prev => ({ ...prev, isRecording: true, recordingTime: 0 }));
                onRecordingStart?.();
                
                // Start recording timer
                recordingIntervalRef.current = setInterval(() => {
                    setState(prev => ({ ...prev, recordingTime: prev.recordingTime + 1 }));
                }, 1000);
            };
            
            mediaRecorderRef.current.onstop = () => {
                setState(prev => ({ ...prev, isRecording: false }));
                onRecordingStop?.();
                
                if (recordingIntervalRef.current) {
                    clearInterval(recordingIntervalRef.current);
                }
            };
            
            // Start recording with 100ms chunks for real-time processing
            mediaRecorderRef.current.start(100);
            
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    }, [initializeAudio, onRecordingStart, onRecordingStop]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && state.isRecording) {
            mediaRecorderRef.current.stop();
            
            // Stop all tracks
            if (mediaRecorderRef.current.stream) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [state.isRecording]);

    // Pause/Resume recording
    const togglePause = useCallback(() => {
        if (mediaRecorderRef.current) {
            if (state.isPaused) {
                mediaRecorderRef.current.resume();
                setState(prev => ({ ...prev, isPaused: false }));
            } else {
                mediaRecorderRef.current.pause();
                setState(prev => ({ ...prev, isPaused: true }));
            }
        }
    }, [state.isPaused]);

    // Send audio chunk via WebSocket
    const sendAudioChunk = useCallback(async (chunk: Blob) => {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            try {
                const arrayBuffer = await chunk.arrayBuffer();
                const audioChunk: AudioChunk = {
                    id: `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: Date.now(),
                    data: arrayBuffer,
                    isVoice: state.audioLevel > vadThreshold,
                    duration: 0.1, // 100ms chunks
                    sampleRate: 16000
                };
                
                // Send as binary data
                websocketRef.current.send(arrayBuffer);
                
                // Also send metadata as JSON
                const metadata = {
                    type: 'audio_chunk',
                    id: audioChunk.id,
                    timestamp: audioChunk.timestamp,
                    isVoice: audioChunk.isVoice,
                    duration: audioChunk.duration,
                    sampleRate: audioChunk.sampleRate,
                    size: arrayBuffer.byteLength
                };
                
                websocketRef.current.send(JSON.stringify(metadata));
                
                setState(prev => ({ ...prev, chunksSent: prev.chunksSent + 1 }));
                onDataSent?.(audioChunk);
                
            } catch (error) {
                console.error('Failed to send audio chunk:', error);
            }
        }
    }, [state.audioLevel, onDataSent]);

    // Send accumulated chunks
    const sendAccumulatedChunks = useCallback(() => {
        if (audioChunksRef.current.length > 0 && websocketRef.current) {
            audioChunksRef.current.forEach(chunk => {
                sendAudioChunk(chunk);
            });
            audioChunksRef.current = [];
        }
    }, [sendAudioChunk]);

    // Format time display
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Initialize WebSocket on component mount
    useEffect(() => {
        initializeWebSocket();
        
        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
        };
    }, [initializeWebSocket]);

    // Send chunks periodically while recording
    useEffect(() => {
        if (state.isRecording && !state.isPaused) {
            const chunkInterval = setInterval(() => {
                sendAccumulatedChunks();
            }, 1000); // Send accumulated chunks every second
            
            return () => clearInterval(chunkInterval);
        }
    }, [state.isRecording, state.isPaused, sendAccumulatedChunks]);

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

    const statusStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: Size.Small,
        fontSize: Size.Small,
        fontFamily: font.Regular,
    };

    const controlsStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Size.Medium,
        padding: Size.Medium,
    };

    const buttonStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Size.Small,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: isMobile ? '40px' : '50px',
        height: isMobile ? '40px' : '50px',
    };

    const recordButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: state.isRecording ? Colors.TEXT_ERROR_COLOR : Colors.ACCENT_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        width: isMobile ? '60px' : '70px',
        height: isMobile ? '60px' : '70px',
    };

    const infoStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Small,
        padding: Size.Medium,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT + '20',
        borderRadius: Size.Small,
        border: `1px solid ${Colors.ACCENT_COLOR_LIGHT}`,
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
        backgroundColor: state.audioLevel > vadThreshold ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
        width: `${Math.min(state.audioLevel * 100, 100)}%`,
        transition: 'width 0.1s ease',
    };

    const getConnectionStatusColor = () => {
        switch (state.connectionStatus) {
            case 'connected': return Colors.ACCENT_COLOR;
            case 'connecting': return Colors.SECONDARY_TEXT_COLOR;
            case 'error': return Colors.TEXT_ERROR_COLOR;
            default: return Colors.DISABLED_TEXT_COLOR;
        }
    };

    const getConnectionStatusIcon = () => {
        switch (state.connectionStatus) {
            case 'connected': return <Wifi size={16} color={Colors.ACCENT_COLOR} />;
            case 'connecting': return <Wifi size={16} color={Colors.SECONDARY_TEXT_COLOR} />;
            case 'error': return <WifiOff size={16} color={Colors.TEXT_ERROR_COLOR} />;
            default: return <WifiOff size={16} color={Colors.DISABLED_TEXT_COLOR} />;
        }
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={titleStyle}>
                    <Mic size={20} color={Colors.ACCENT_COLOR} />
                    VAD Audio Recorder
                </div>
                <div style={statusStyle}>
                    {getConnectionStatusIcon()}
                    <span style={{ color: getConnectionStatusColor() }}>
                        {state.connectionStatus}
                    </span>
                </div>
            </div>

            <div style={controlsStyle}>
                {!state.isRecording ? (
                    <button
                        style={recordButtonStyle}
                        onClick={startRecording}
                        disabled={!state.isConnected}
                        title="Start Recording"
                    >
                        <Mic size={24} />
                    </button>
                ) : (
                    <>
                        <button
                            style={buttonStyle}
                            onClick={togglePause}
                            title={state.isPaused ? "Resume" : "Pause"}
                        >
                            {state.isPaused ? <Play size={20} /> : <Pause size={20} />}
                        </button>
                        <button
                            style={recordButtonStyle}
                            onClick={stopRecording}
                            title="Stop Recording"
                        >
                            <Square size={24} />
                        </button>
                    </>
                )}
            </div>

            <div style={infoStyle}>
                <div style={infoRowStyle}>
                    <span>Recording Time:</span>
                    <span style={{ fontFamily: font.Medium }}>
                        {formatTime(state.recordingTime)}
                    </span>
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
                    <span style={{ fontFamily: font.Medium }}>
                        {state.chunksSent}
                    </span>
                </div>
                
                <div style={infoRowStyle}>
                    <span>VAD Status:</span>
                    <span style={{ 
                        color: state.audioLevel > vadThreshold ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
                        fontFamily: font.Medium 
                    }}>
                        {state.audioLevel > vadThreshold ? 'Voice Detected' : 'Silence'}
                    </span>
                </div>
            </div>

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
