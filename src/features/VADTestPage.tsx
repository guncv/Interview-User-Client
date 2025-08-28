import React, { useState } from 'react';
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

    const [websocketUrl, setWebsocketUrl] = useState('ws://localhost:8080/api/v1/ws/connect/868b1859-93e2-4bac-a9a9-42759dacb002');
    const [receivedChunks, setReceivedChunks] = useState<AudioChunk[]>([]);
    React.useEffect(() => {
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
    };

    const handleRecordingStop = () => {
        console.log('Recording stopped');
    };

    const handleDataSent = (chunk: AudioChunk) => {
        console.log('Audio chunk sent:', chunk);
        setReceivedChunks(prev => [...prev, chunk]);
    };
    

    const clearChunks = () => {
        setReceivedChunks([]);
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
                    isMobile={isMobile}
                    isTablet={isTablet}
                />
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