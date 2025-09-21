import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Trash2, Volume2 } from 'lucide-react';
import Colors from '../../assets/styles/Color';

interface AudioChunk {
    id: string;
    blob: Blob;
    timestamp: number;
    duration?: number;
    segmentId?: string;
}

interface AudioDebugPanelProps {
    audioChunks: AudioChunk[];
    onClearChunks: () => void;
    isVisible: boolean;
}

const AudioDebugPanel: React.FC<AudioDebugPanelProps> = ({
    audioChunks,
    onClearChunks,
    isVisible
}) => {
    const [playingChunkId, setPlayingChunkId] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [volume, setVolume] = useState<number>(1);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const playChunk = async (chunk: AudioChunk) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }

        const url = URL.createObjectURL(chunk.blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.volume = volume;
        setPlayingChunkId(chunk.id);
        setCurrentTime(0);

        audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            setPlayingChunkId(null);
            setCurrentTime(0);
            URL.revokeObjectURL(url);
        });

        audio.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            setPlayingChunkId(null);
            URL.revokeObjectURL(url);
        });

        try {
            await audio.play();
        } catch (error) {
            console.error('Failed to play audio:', error);
            setPlayingChunkId(null);
            URL.revokeObjectURL(url);
        }
    };

    const pauseChunk = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayingChunkId(null);
        }
    };

    const downloadChunk = (chunk: AudioChunk) => {
        const url = URL.createObjectURL(chunk.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audio-chunk-${chunk.id}-${new Date(chunk.timestamp).toISOString().slice(11, 19)}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimestamp = (timestamp: number): string => {
        return new Date(timestamp).toLocaleTimeString();
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxHeight: '300px',
            overflow: 'hidden'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: Colors.PRIMARY_COLOR
                }}>
                    🎵 Audio Debug Panel ({audioChunks.length} chunks)
                </h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Volume2 size={16} color={Colors.SECONDARY_TEXT_COLOR} />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            style={{
                                width: '80px',
                                accentColor: Colors.ACCENT_COLOR
                            }}
                        />
                    </div>
                    <button
                        onClick={onClearChunks}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            color: Colors.TEXT_ERROR_COLOR
                        }}
                        title="Clear all chunks"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div style={{
                maxHeight: '200px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                {audioChunks.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        color: Colors.SECONDARY_TEXT_COLOR,
                        fontStyle: 'italic',
                        padding: '20px'
                    }}>
                        No audio chunks recorded yet
                    </div>
                ) : (
                    audioChunks.map((chunk) => (
                        <div
                            key={chunk.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                background: playingChunkId === chunk.id ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0, 0, 0, 0.02)',
                                borderRadius: '8px',
                                border: playingChunkId === chunk.id ? `2px solid ${Colors.ACCENT_COLOR}` : '1px solid rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <button
                                onClick={() => playingChunkId === chunk.id ? pauseChunk() : playChunk(chunk)}
                                style={{
                                    background: playingChunkId === chunk.id ? Colors.ACCENT_COLOR : 'rgba(102, 126, 234, 0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: playingChunkId === chunk.id ? 'white' : Colors.ACCENT_COLOR,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {playingChunkId === chunk.id ? <Pause size={16} /> : <Play size={16} />}
                            </button>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: Colors.PRIMARY_COLOR,
                                    marginBottom: '2px'
                                }}>
                                    Chunk {chunk.id.slice(-8)}
                                    {chunk.segmentId && ` (Segment: ${chunk.segmentId.slice(-8)})`}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: Colors.SECONDARY_TEXT_COLOR,
                                    display: 'flex',
                                    gap: '12px'
                                }}>
                                    <span>Time: {formatTimestamp(chunk.timestamp)}</span>
                                    <span>Size: {(chunk.blob.size / 1024).toFixed(1)} KB</span>
                                    {chunk.duration && <span>Duration: {formatTime(chunk.duration)}</span>}
                                </div>
                                {playingChunkId === chunk.id && (
                                    <div style={{
                                        marginTop: '4px',
                                        fontSize: '11px',
                                        color: Colors.ACCENT_COLOR
                                    }}>
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => downloadChunk(chunk)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: Colors.SECONDARY_TEXT_COLOR,
                                    transition: 'all 0.2s ease'
                                }}
                                title="Download chunk"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                    e.currentTarget.style.color = Colors.ACCENT_COLOR;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'none';
                                    e.currentTarget.style.color = Colors.SECONDARY_TEXT_COLOR;
                                }}
                            >
                                <Download size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AudioDebugPanel;
