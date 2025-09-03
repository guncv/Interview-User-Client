import React, { useState, useEffect } from 'react';
import { VADRecorder } from '../components/common';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import font from '../assets/styles/Font';
import type { AudioChunk } from '../components/common/VADRecorder';

const VADTestPage: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    const containerStyle: React.CSSProperties = {
        padding: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Large,
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: Colors.LECTURE_CONTENT_PART_COLOR,
    };

    const headerStyle: React.CSSProperties = {
        textAlign: 'center',
        marginBottom: Size.Large,
        padding: Size.Large,
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        borderRadius: Size.Small,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
    };

    const titleStyle: React.CSSProperties = {
        fontSize: isMobile ? Size.LargeMedium : Size.ExtraLarge,
        fontFamily: font.Bold,
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Small,
    };

    const subtitleStyle: React.CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        lineHeight: 1.5,
    };

    const configSectionStyle: React.CSSProperties = {
        marginBottom: Size.Large,
        padding: Size.Large,
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        borderRadius: Size.Small,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
    };

    const configTitleStyle: React.CSSProperties = {
        fontSize: isMobile ? Size.Medium : Size.LargeMedium,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Medium,
    };

    const inputGroupStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: Size.Small,
        alignItems: isMobile ? 'stretch' : 'center',
        marginBottom: Size.Small,
    };

    const inputStyle: React.CSSProperties = {
        flex: 1,
        padding: Size.Small,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        borderRadius: Size.Small,
        fontSize: Size.Small,
        fontFamily: font.Regular,
    };

    const labelStyle: React.CSSProperties = {
        fontSize: Size.Small,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        minWidth: isMobile ? 'auto' : '120px',
    };

    const recorderSectionStyle: React.CSSProperties = {
        marginBottom: Size.Large,
    };

    const chunksSectionStyle: React.CSSProperties = {
        padding: Size.Large,
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        borderRadius: Size.Small,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
    };

    const chunksTitleStyle: React.CSSProperties = {
        fontSize: isMobile ? Size.Medium : Size.LargeMedium,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Medium,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const chunkItemStyle: React.CSSProperties = {
        padding: Size.Small,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
        borderRadius: Size.Small,
        marginBottom: Size.Small,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT + '10',
    };

    const chunkHeaderStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Size.Small,
        fontSize: Size.Small,
        fontFamily: font.Medium,
    };

    const chunkDetailsStyle: React.CSSProperties = {
        fontSize: Size.Small,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: Size.Small,
    };

    const clearButtonStyle: React.CSSProperties = {
        padding: `${Size.Small} ${Size.Medium}`,
        backgroundColor: Colors.TEXT_ERROR_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        border: 'none',
        borderRadius: Size.Small,
        fontSize: Size.Small,
        fontFamily: font.Medium,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    };

    const clearButtonHoverStyle: React.CSSProperties = {
        backgroundColor: '#c82333',
        transform: 'translateY(-1px)',
    };

    const [websocketUrl, setWebsocketUrl] = useState('ws://localhost:8080/api/v1/ws/connect/6a9077a7-6ccd-44a6-8cec-932fb9a63728');
    const [receivedChunks, setReceivedChunks] = useState<AudioChunk[]>([]);
    const [segments, setSegments] = useState<Record<string, { id: string; chunks: AudioChunk[]; wavUrl?: string; durationSeconds?: number }>>({});
    const [segmentOrder, setSegmentOrder] = useState<string[]>([]);
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleRecordingStart = () => {
        console.log('Recording started');
        setReceivedChunks([]);
        // Clear previous segments and URLs
        setSegmentOrder([]);
        setSegments(prev => {
            // Revoke any existing object URLs
            Object.values(prev).forEach(s => { if (s.wavUrl) URL.revokeObjectURL(s.wavUrl); });
            return {};
        });
    };

    const handleRecordingStop = () => {
        console.log('Recording stopped');
    };

    const handleDataSent = (chunk: AudioChunk) => {
        console.log('Audio chunk sent:', chunk);
        setReceivedChunks(prev => [...prev, chunk]);
        if (chunk.segmentId) {
            setSegments(prev => {
                const existing = prev[chunk.segmentId] || { id: chunk.segmentId, chunks: [] as AudioChunk[] };
                const updated = { ...prev, [chunk.segmentId]: { ...existing, chunks: [...existing.chunks, chunk] } };
                if (!prev[chunk.segmentId]) {
                    setSegmentOrder(o => [...o, chunk.segmentId]);
                }
                return updated;
            });
        }
    };
    
    const handleSegmentStart = (segmentId: string) => {
        setSegments(prev => {
            if (prev[segmentId]) return prev;
            return { ...prev, [segmentId]: { id: segmentId, chunks: [] } };
        });
        setSegmentOrder(prev => prev.includes(segmentId) ? prev : [...prev, segmentId]);
    };

    const encodeWavFromChunks = (chunks: AudioChunk[], sampleRate = 16000): Blob => {
        const sorted = [...chunks].sort((a, b) => a.timestamp - b.timestamp);
        const totalPcmBytes = sorted.reduce((acc, c) => acc + c.data.byteLength, 0);
        const headerSize = 44;
        const buffer = new ArrayBuffer(headerSize + totalPcmBytes);
        const view = new DataView(buffer);

        // RIFF header
        const writeString = (offset: number, str: string) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + totalPcmBytes, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true); // Subchunk1Size for PCM
        view.setUint16(20, 1, true);  // PCM format
        view.setUint16(22, 1, true);  // channels = 1
        view.setUint32(24, sampleRate, true);
        const bytesPerSample = 2;
        const blockAlign = 1 * bytesPerSample;
        view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
        view.setUint16(32, blockAlign, true); // BlockAlign
        view.setUint16(34, 8 * bytesPerSample, true); // BitsPerSample = 16
        writeString(36, 'data');
        view.setUint32(40, totalPcmBytes, true);

        // PCM data
        let offset = headerSize;
        const out = new Uint8Array(buffer);
        for (const c of sorted) {
            out.set(new Uint8Array(c.data), offset);
            offset += c.data.byteLength;
        }

        return new Blob([buffer], { type: 'audio/wav' });
    };

    const handleSegmentEnd = (segmentId: string) => {
        setSegments(prev => {
            const seg = prev[segmentId];
            if (!seg || seg.chunks.length === 0) return prev;
            // Create WAV
            const blob = encodeWavFromChunks(seg.chunks, 16000);
            const url = URL.createObjectURL(blob);
            const durationSeconds = seg.chunks.reduce((acc, c) => acc + (c.duration || 0), 0);
            return { ...prev, [segmentId]: { ...seg, wavUrl: url, durationSeconds } };
        });
    };

    const clearChunks = () => {
        setReceivedChunks([]);
        // Revoke and clear segment URLs and data
        setSegments(prev => {
            Object.values(prev).forEach(s => { if (s.wavUrl) URL.revokeObjectURL(s.wavUrl); });
            return {};
        });
        setSegmentOrder([]);
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>VAD Audio Recorder Test</h1>
                <p style={subtitleStyle}>
                    Test the Voice Activity Detection (VAD) audio recorder with WebSocket streaming.
                    This component records audio in real-time, detects voice activity, and streams
                    chunked audio data to your backend server via WebSocket.
                </p>
            </div>

            {/* Authentication Status Section */}
            <div style={configSectionStyle}>
                <h2 style={configTitleStyle}>Authentication Status</h2>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Access Token:</label>
                    <input
                        type="text"
                        value={localStorage.getItem('access_token') ? '✅ Present' : '❌ Missing'}
                        readOnly
                        style={{
                            ...inputStyle,
                            backgroundColor: localStorage.getItem('access_token') ? '#d4edda' : '#f8d7da',
                            color: localStorage.getItem('access_token') ? '#155724' : '#721c24',
                            cursor: 'not-allowed'
                        }}
                    />
                </div>
                <p style={{
                    fontSize: Size.Small,
                    color: Colors.SECONDARY_TEXT_COLOR,
                    fontFamily: font.Regular,
                    margin: 0,
                }}>
                    🔐 Access token is required for WebSocket authentication.
                    Make sure you're signed in to establish a secure connection.
                </p>
            </div>

            <div style={configSectionStyle}>
                <h2 style={configTitleStyle}>WebSocket Configuration</h2>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Base WebSocket URL:</label>
                    <input
                        type="text"
                        value={websocketUrl}
                        onChange={(e) => setWebsocketUrl(e.target.value)}
                        placeholder="ws://localhost:8080/api/v1/ws/connect/70b5ac86-0ab6-4d8a-b1aa-0dc9d4de2e4e"
                        style={inputStyle}
                    />
                </div>

                <p style={{
                    fontSize: Size.Small,
                    color: Colors.SECONDARY_TEXT_COLOR,
                    fontFamily: font.Regular,
                    margin: 0,
                }}>
                    💡 Make sure your backend server is running and listening on the specified WebSocket endpoint.
                    The recorder will automatically connect and start streaming audio chunks when you start recording.
                    Authentication tokens are sent as the first message after WebSocket connection.
                </p>
                
                {/* Backend Requirements Note */}
                <div style={{
                    marginTop: Size.Small,
                    padding: Size.Small,
                    backgroundColor: '#fff3cd',
                    borderRadius: Size.Small,
                    border: '1px solid #ffeaa7',
                }}>
                    <p style={{
                        fontSize: Size.Small,
                        color: '#856404',
                        fontFamily: font.Regular,
                        margin: 0,
                        fontStyle: 'italic',
                    }}>
                        ⚠️ <strong>Backend Requirement:</strong> Your Go backend must handle the first WebSocket message 
                        as an authentication message with <code>type: "authentication"</code> containing the 
                        <code>access_token</code>. Only after successful authentication should audio streaming begin.
                    </p>
                </div>

                {/* Connection Status Indicator */}
                <div style={{
                    marginTop: Size.Medium,
                    padding: Size.Small,
                    backgroundColor: Colors.ACCENT_COLOR_LIGHT + '20',
                    borderRadius: Size.Small,
                    border: `1px solid ${Colors.ACCENT_COLOR_LIGHT}`,
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: Size.Small,
                        marginBottom: Size.Small,
                    }}>
                        <span style={{
                            fontSize: Size.Small,
                            fontFamily: font.Medium,
                            color: Colors.PRIMARY_COLOR,
                        }}>
                            🔌 Connection Status:
                        </span>
                    </div>
                    <div style={{
                        fontSize: Size.Small,
                        fontFamily: font.Regular,
                        color: Colors.SECONDARY_TEXT_COLOR,
                    }}>
                        {!localStorage.getItem('access_token') ? (
                            <span style={{ color: Colors.TEXT_ERROR_COLOR }}>
                                ❌ Cannot connect: Missing access token
                            </span>
                        ) : (
                            <span style={{ color: Colors.ACCENT_COLOR }}>
                                ✅ Ready to connect: Access token present
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div style={recorderSectionStyle}>
                <VADRecorder
                    websocketUrl={websocketUrl}
                    onRecordingStart={handleRecordingStart}
                    onRecordingStop={handleRecordingStop}
                    onDataSent={handleDataSent}
                    onSegmentStart={handleSegmentStart}
                    onSegmentEnd={handleSegmentEnd}
                    isMobile={isMobile}
                    isTablet={isTablet}
                />
            </div>

            {/* Segments and merged audio */}
            <div style={chunksSectionStyle}>
                <div style={chunksTitleStyle}>
                    <span>Merged Segments</span>
                </div>
                {segmentOrder.length === 0 ? (
                    <p style={{
                        fontSize: Size.Small,
                        color: Colors.SECONDARY_TEXT_COLOR,
                        fontFamily: font.Regular,
                        textAlign: 'center',
                        fontStyle: 'italic',
                    }}>
                        No segments yet.
                    </p>
                ) : (
                    segmentOrder.map((sid) => {
                        const seg = segments[sid];
                        return (
                            <div key={sid} style={chunkItemStyle}>
                                <div style={chunkHeaderStyle}>
                                    <span>Segment {sid.substring(0, 10)}...</span>
                                    <span style={{ color: Colors.SECONDARY_TEXT_COLOR, fontFamily: font.Medium }}>
                                        {seg.chunks.length} chunks{seg.durationSeconds ? ` · ${seg.durationSeconds.toFixed(2)}s` : ''}
                                    </span>
                                </div>
                                <div style={chunkDetailsStyle}>
                                    {seg.wavUrl ? (
                                        <>
                                            <audio controls src={seg.wavUrl} style={{ width: '100%' }} />
                                            <a href={seg.wavUrl} download={`segment_${sid.substring(0, 10)}.wav`} style={{
                                                padding: `${Size.Small} ${Size.Medium}`,
                                                backgroundColor: Colors.ACCENT_COLOR,
                                                color: Colors.TEXT_WHITE_COLOR,
                                                borderRadius: Size.Small,
                                                textDecoration: 'none',
                                                fontFamily: font.Medium,
                                                textAlign: 'center'
                                            }}>Download WAV</a>
                                        </>
                                    ) : (
                                        <span style={{ fontSize: Size.Small, color: Colors.SECONDARY_TEXT_COLOR }}>
                                            Segment is active or awaiting end to merge.
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div style={chunksSectionStyle}>
                <div style={chunksTitleStyle}>
                    <span>Received Audio Chunks</span>
                    <button
                        style={clearButtonStyle}
                        onClick={clearChunks}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = clearButtonHoverStyle.backgroundColor!;
                            e.currentTarget.style.transform = clearButtonHoverStyle.transform!;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = clearButtonStyle.backgroundColor!;
                            e.currentTarget.style.transform = 'none';
                        }}
                    >
                        Clear All
                    </button>
                </div>
                
                {receivedChunks.length === 0 ? (
                    <p style={{
                        fontSize: Size.Small,
                        color: Colors.SECONDARY_TEXT_COLOR,
                        fontFamily: font.Regular,
                        textAlign: 'center',
                        fontStyle: 'italic',
                    }}>
                        No audio chunks received yet. Start recording to see the data stream.
                    </p>
                ) : (
                    receivedChunks.map((chunk, index) => (
                        <div key={chunk.id} style={chunkItemStyle}>
                            <div style={chunkHeaderStyle}>
                                <span>Chunk #{index + 1}</span>
                                <span style={{
                                    color: chunk.isVoice ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
                                    fontFamily: font.Medium,
                                }}>
                                    {chunk.isVoice ? '🎤 Voice' : '🔇 Silence'}
                                </span>
                            </div>
                            <div style={chunkDetailsStyle}>
                                <div>
                                    <strong>ID:</strong> {chunk.id}
                                </div>
                                <div>
                                    <strong>Timestamp:</strong> {new Date(chunk.timestamp).toLocaleTimeString()}
                                </div>
                                <div>
                                    <strong>Duration:</strong> {chunk.duration}s
                                </div>
                                <div>
                                    <strong>Sample Rate:</strong> {chunk.sampleRate}Hz
                                </div>
                                <div>
                                    <strong>Data Size:</strong> {(chunk.data.byteLength / 1024).toFixed(2)} KB
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VADTestPage;