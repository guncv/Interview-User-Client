import React, { useState, useEffect, useRef } from "react";
import Colors from "../../assets/styles/Color";
import { HeadphoneOff, Headphones, Mic, MicOff, Settings, RotateCcw, Square } from 'lucide-react';
import CircularIconButton from './CircularIconButton';
import SettingsPopup from '../dialog/SettingsPopup';
import profileImage from "../../assets/images/profile.png";
import { useContextProvider } from "../layout/ContextProvider";
import { AUDIO_LEVEL } from "../../constants";

interface InterviewRecordingProps {
    websocketUrl?: string;
    sessionToken?: string;
    isAiSpeaking?: boolean;
    isUserSpeaking?: boolean;
    isUserTurn?: boolean;
    onMicMuteChange?: (isMuted: boolean) => void;
    onHeadphoneMuteChange?: (isMuted: boolean) => void;
    elapsedTime?: number;
    isConnected?: boolean;
    isConversationStarted?: boolean;
    onEndInterview?: () => void;
    onMicPermissionError?: (error: string) => void;
}

interface MicrophoneDevice {
    deviceId: string;
    label: string;
}

interface SessionInfo {
    startTime: number;
    interviewState: string;
    microphoneDevice: string;
    headphonesDevice: string;
}

const InterviewRecording: React.FC<InterviewRecordingProps> = ({
    websocketUrl,
    sessionToken,
    isAiSpeaking = false,
    isUserSpeaking = false,
    isUserTurn = false,
    onMicMuteChange,
    onHeadphoneMuteChange,
    elapsedTime = 0,
    isConnected = false,
    isConversationStarted = false,
    onEndInterview,
    onMicPermissionError,
}) => {
    void websocketUrl;
    void sessionToken;
    const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
        startTime: Date.now(),
        interviewState: 'Initializing',
        microphoneDevice: 'Default Microphone',
        headphonesDevice: 'Default Headphones'
    });
    void sessionInfo;
    const [availableMicrophones, setAvailableMicrophones] = useState<MicrophoneDevice[]>([]);
    const [selectedMicId, setSelectedMicId] = useState<string>('default');
    const [availableHeadphones, setAvailableHeadphones] = useState<MicrophoneDevice[]>([]);
    const [audioLevel, setAudioLevel] = useState<number>(0);
    const [selectedHeadphonesId, setSelectedHeadphonesId] = useState<string>('default');
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [isHeadphonesMuted, setIsHeadphonesMuted] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const { isMobile, isTablet } = useContextProvider();

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const getHeadphonesDevices = async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const headphones = devices
                .filter(device => device.kind === 'audiooutput')
                .map(device => ({
                    deviceId: device.deviceId,
                    label: device.label || `Headphones ${device.deviceId.slice(0, 8)}`
                }));
            setAvailableHeadphones(headphones);
            if (headphones.length > 0) {
                setSelectedHeadphonesId(headphones[0].deviceId);
            }
        };

        getHeadphonesDevices();
    }, []);

    useEffect(() => {
        const getMicrophoneDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputs = devices
                    .filter(device => device.kind === 'audioinput')
                    .map(device => ({
                        deviceId: device.deviceId,
                        label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`
                    }));
                
                setAvailableMicrophones(audioInputs);
                if (audioInputs.length > 0) {
                    setSelectedMicId(audioInputs[0].deviceId);
                    setSessionInfo(prev => ({
                        ...prev,
                        microphoneDevice: audioInputs[0].label
                    }));
                }
            } catch (error) {
            }
        };

        getMicrophoneDevices();
    }, []);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSessionInfo(prev => ({
                ...prev,
                elapsedTime: Date.now() - prev.startTime
            }));
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const initAudioAnalysis = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    audio: { 
                        deviceId: selectedMicId === 'default' ? undefined : selectedMicId,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    } 
                });
                
                mediaStreamRef.current = stream;
                audioContextRef.current = new AudioContext();
                const source = audioContextRef.current.createMediaStreamSource(stream);
                
                gainNodeRef.current = audioContextRef.current.createGain();
                gainNodeRef.current.gain.value = isMicMuted ? 0 : 1;
                
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 1024;
                analyserRef.current.smoothingTimeConstant = 0.3;
                
                source.connect(gainNodeRef.current);
                gainNodeRef.current.connect(analyserRef.current);
                
                const updateAudioLevel = () => {
                    if (analyserRef.current) {
                        const dataArray = new Uint8Array(analyserRef.current.fftSize);
                        analyserRef.current.getByteTimeDomainData(dataArray);
                        
                        let sum = 0;
                        for (let i = 0; i < dataArray.length; i++) {
                            const value = (dataArray[i] - 128) / 128.0;
                            sum += value * value;
                        }
                        const rms = Math.sqrt(sum / dataArray.length);
                        
                        setAudioLevel(rms);
                    } else {
                        setAudioLevel(0);
                    }
                    requestAnimationFrame(updateAudioLevel);
                };
                
                updateAudioLevel();
            } catch (error) {
                let errorMessage = "Microphone access is required for audio analysis.";
                
                if (error instanceof DOMException) {
                    switch (error.name) {
                        case 'NotAllowedError':
                            errorMessage = "Microphone access was denied. Please allow microphone access in your browser settings and refresh the page.";
                            break;
                        case 'NotFoundError':
                            errorMessage = "No microphone found. Please connect a microphone and try again.";
                            break;
                        case 'NotReadableError':
                            errorMessage = "Microphone is being used by another application. Please close other applications using the microphone and try again.";
                            break;
                        case 'OverconstrainedError':
                            errorMessage = "Microphone constraints cannot be satisfied. Please check your microphone settings.";
                            break;
                        case 'SecurityError':
                            errorMessage = "Microphone access is blocked due to security restrictions. Please check your browser settings.";
                            break;
                        default:
                            errorMessage = `Microphone access failed: ${error.message}`;
                    }
                }
                
                onMicPermissionError?.(errorMessage);
            }
        };

        if (selectedMicId) {
            initAudioAnalysis();
        }

        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [selectedMicId, isMicMuted]);



    const handleMicrophoneChange = (deviceId: string) => {
        setSelectedMicId(deviceId);
        const selectedDevice = availableMicrophones.find(mic => mic.deviceId === deviceId);
        if (selectedDevice) {
            setSessionInfo(prev => ({
                ...prev,
                microphoneDevice: selectedDevice.label
            }));
        }
    };
    const handleHeadphonesChange = (deviceId: string) => {
        setSelectedHeadphonesId(deviceId);
        const selectedDevice = availableHeadphones.find(headphones => headphones.deviceId === deviceId);
        if (selectedDevice) {
            setSessionInfo(prev => ({
                ...prev,
                headphonesDevice: selectedDevice.label
            }));
        }
    };


    const toggleMicMute = () => {
        const newMutedState = !isMicMuted;
        setIsMicMuted(newMutedState);
        
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = newMutedState ? 0 : 1;
        }
        
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !newMutedState;
            });
        }

        onMicMuteChange?.(newMutedState);
    };

    const toggleHeadphonesMute = () => {
        const newMutedState = !isHeadphonesMuted;
        setIsHeadphonesMuted(newMutedState);
        
        if (newMutedState) {
            setIsMicMuted(true);
            
            if (gainNodeRef.current) {
                gainNodeRef.current.gain.value = 0;
            }
            
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getAudioTracks().forEach(track => {
                    track.enabled = false;
                });
            }
            
            onMicMuteChange?.(true);
        }
        
        onHeadphoneMuteChange?.(newMutedState);
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const handleReconnect = () => {
        window.location.reload();
    };

    const handleEndInterview = () => {
        setShowSettings(false);
        onEndInterview?.();
    };

    const getStatusText = (): string => {
        if (!isConnected) return 'Connecting...';
        if (!isConversationStarted) return 'Waiting to start';
        if (isAiSpeaking) return 'AI speaking';
        if (isUserTurn && isUserSpeaking) return 'You are speaking';
        if (isUserTurn && !isUserSpeaking) return 'Your turn — speak now';
        if (!isUserTurn) return 'Waiting for response';
        return 'Ready';
    };

    const getStatusColor = (): string => {
        if (!isConnected) return '#FF9800'
        if (!isConversationStarted) return '#9E9E9E'
        if (isAiSpeaking) return '#4CAF50'
        if (isUserTurn && isUserSpeaking) return '#9C27B0'
        if (isUserTurn && !isUserSpeaking) return '#2196F3'
        if (!isUserTurn) return '#FF5722'
        return '#4CAF50';
    };

    const getStatusBackground = (): string => {
        if (!isConnected) return 'rgba(255, 152, 0, 0.1)';
        if (!isConversationStarted) return 'rgba(158, 158, 158, 0.1)';
        if (isAiSpeaking) return 'rgba(76, 175, 80, 0.1)';
        if (isUserTurn && isUserSpeaking) return 'rgba(156, 39, 176, 0.1)';
        if (isUserTurn && !isUserSpeaking) return 'rgba(33, 150, 243, 0.1)';
        if (!isUserTurn) return 'rgba(255, 87, 34, 0.1)';
        return 'rgba(76, 175, 80, 0.1)';
    };

    const getStatusBorderColor = (): string => {
        if (!isConnected) return 'rgba(255, 152, 0, 0.3)';
        if (!isConversationStarted) return 'rgba(158, 158, 158, 0.3)';
        if (isAiSpeaking) return 'rgba(76, 175, 80, 0.3)';
        if (isUserTurn && isUserSpeaking) return 'rgba(156, 39, 176, 0.3)';
        if (isUserTurn && !isUserSpeaking) return 'rgba(33, 150, 243, 0.3)';
        if (!isUserTurn) return 'rgba(255, 87, 34, 0.3)';
        return 'rgba(76, 175, 80, 0.3)';
    };

    const getStatusTextColor = (): string => {
        if (!isConnected) return '#FF9800';
        if (!isConversationStarted) return '#9E9E9E';
        if (isAiSpeaking) return '#4CAF50';
        if (isUserTurn && isUserSpeaking) return '#9C27B0';
        if (isUserTurn && !isUserSpeaking) return '#2196F3';
        if (!isUserTurn) return '#FF5722';
        return '#4CAF50';
    };

    const getStatusAnimation = (): string => {
        if (isAiSpeaking || (isUserTurn && isUserSpeaking)) {
            return 'statusPulse 1.5s ease-in-out infinite';
        }
        return 'none';
    };

    return (
        <>
            <style>
                {`
                @keyframes statusPulse {
                    0%, 100% { 
                        opacity: 1; 
                        transform: scale(1); 
                    }
                    50% { 
                        opacity: 0.6; 
                        transform: scale(1.2); 
                    }
                }
                `}
            </style>
            <div style={{ 
                width: isMobile || isTablet ? '100%' : '50vw',
                height: isMobile ? '30vh' : isTablet ? '35vh' : '40vh',
                position: 'relative',
                background: `${Colors.CONTENT_HOVER_COLOR}`,
                borderRadius: '24px',
                marginTop: '20px',
                padding: '0',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
                minWidth: '180px'
            }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: Colors.ACCENT_COLOR,
                    marginBottom: '2px'
                }}>
                    Time: {formatTime(elapsedTime)}
                </div>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    background: getStatusBackground(),
                    border: `1px solid ${getStatusBorderColor()}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(),
                        boxShadow: `0 0 8px ${getStatusColor()}40`,
                        animation: getStatusAnimation()
                    }}></div>
                    
                    <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getStatusTextColor(),
                        whiteSpace: 'nowrap'
                    }}>
                        {getStatusText()}
                    </div>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: isAiSpeaking ? '0 8px 32px rgba(76, 175, 80, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: isAiSpeaking ? '2px solid #4CAF50' : '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: isMobile ? '0px' : '180px',
                transition: 'all 0.3s ease',
                animation: isAiSpeaking ? 'aiSpeakingPulse 2s ease-in-out infinite' : 'none'
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                }}>
                    <img 
                        src={profileImage} 
                        alt="AI Interviewer" 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                {!isMobile && (
                    <>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: Colors.PRIMARY_COLOR,
                                marginBottom: '2px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                AI Assistant
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: Colors.SECONDARY_TEXT_COLOR,
                                fontWeight: '500'
                            }}>
                                Interviewer
                            </div>
                        </div>
                        <div style={{
                            width: isAiSpeaking ? '12px' : '8px',
                            height: isAiSpeaking ? '12px' : '8px',
                            borderRadius: '50%',
                            backgroundColor: isAiSpeaking ? '#4CAF50' : '#4CAF50',
                            boxShadow: isAiSpeaking ? '0 0 12px rgba(76, 175, 80, 0.8)' : '0 0 8px rgba(76, 175, 80, 0.5)',
                            transition: 'all 0.3s ease'
                        }}></div>
                    </>
                )}
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '32px',
                zIndex: 1
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '24px 48px',
                    borderRadius: '24px',
                    transition: 'all 0.3s ease',
                    minWidth: '320px',
                    minHeight: '120px'
                }}>
                    {Array.from({ length: 20 }, (_, i) => {
                        const isActive = isUserTurn && isConversationStarted && isConnected ;
                        const showUserWave = isActive && !isMicMuted && !isHeadphonesMuted && isUserSpeaking && !isAiSpeaking;
                    
                        const baseHeight = 12;
                        const maxHeight = 80;
                        
                        const audioInfluence = Math.pow(audioLevel * 2, 1.5);
                        const randomVariation = Math.sin((Date.now() / 120) + i * 0.8) * 0.4 + 0.6;
                        
                        let height;
                        if (showUserWave && audioLevel > AUDIO_LEVEL.MIN_AUDIO_LEVEL) {
                            height = baseHeight + (audioInfluence + randomVariation * 0.3) * (maxHeight - baseHeight);

                            if (audioLevel > AUDIO_LEVEL.MIN_AUDIO_LEVEL_FOR_SHOW_USER_WAVE) {
                                height *= 1.2;
                            }
                        } else {
                            height = baseHeight + randomVariation * 3;
                        }
                
                        return (
                            <div
                                key={i}
                                style={{
                                    width: '5px',
                                    height: `${Math.max(baseHeight, Math.min(height, maxHeight + 20))}px`,
                                    backgroundColor: isActive ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
                                    borderRadius: '3px',
                                    transition: 'all 0.1s ease',
                                    opacity: isActive ? ((audioLevel > AUDIO_LEVEL.MIN_AUDIO_LEVEL || showUserWave) ? 1 : 0.5) : 0.3,
                                    boxShadow: (audioLevel > AUDIO_LEVEL.MIN_AUDIO_LEVEL_FOR_SHOW_USER_WAVE && showUserWave) ? `0 0 8px ${Colors.ACCENT_COLOR}40` : 'none'
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px',
                padding: isMobile ? '10px 15px' : '15px 20px',
                background: `${Colors.TEXT_WHITE_COLOR}`,
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <CircularIconButton
                    icon={<RotateCcw />}
                    buttonId="reconnect"
                    onClick={handleReconnect}
                    isActive={true}
                    tooltip="Reconnect"
                    size="38px"
                    iconSize="38px"
                />
                
                <CircularIconButton
                    icon={isMicMuted ? <MicOff /> : <Mic />}
                    buttonId="mic"
                    onClick={isConnected && isConversationStarted ? toggleMicMute : undefined}
                    isActive={isConnected && isConversationStarted}
                    tooltip={!isConnected ? "Connect to enable microphone" : !isConversationStarted ? "Wait for conversation to start" : (isMicMuted ? "Unmute Microphone" : "Mute Microphone")}
                    size="38px"
                    iconSize="38px"
                />
                
                <CircularIconButton
                    icon={isHeadphonesMuted ? <HeadphoneOff /> : <Headphones />}
                    buttonId="headphones"
                    onClick={isConnected && isConversationStarted ? toggleHeadphonesMute : undefined}
                    isActive={isConnected && isConversationStarted}
                    tooltip={!isConnected ? "Connect to enable audio" : !isConversationStarted ? "Wait for conversation to start" : (isHeadphonesMuted ? "Unmute Audio (Mic & Speakers)" : "Mute All Audio (Mic & Speakers)")}
                    size="38px"
                    iconSize="38px"
                />
                
                <CircularIconButton
                    icon={<Settings />}
                    buttonId="settings"
                    onClick={isConversationStarted ? toggleSettings : undefined}
                    isActive={isConversationStarted}
                    tooltip={!isConversationStarted ? "Wait for conversation to start" : "Settings"}
                    size="38px"
                    iconSize="38px"
                />

                <CircularIconButton
                    icon={<Square />}
                    buttonId="endInterview"
                    onClick={isConversationStarted ? handleEndInterview : undefined}
                    isActive={isConversationStarted}
                    tooltip={!isConversationStarted ? "Wait for conversation to start" : "End Interview"}
                    size="38px"
                    iconSize="38px"
                    variant="danger"
                />
            </div>
            
            <SettingsPopup
                isVisible={showSettings}
                onClose={() => setShowSettings(false)}
                availableMicrophones={availableMicrophones}
                availableHeadphones={availableHeadphones}
                selectedMicId={selectedMicId}
                selectedHeadphonesId={selectedHeadphonesId}
                onMicrophoneChange={handleMicrophoneChange}
                onHeadphonesChange={handleHeadphonesChange}
            />
        </div>
        </>
    );
};

export default InterviewRecording;