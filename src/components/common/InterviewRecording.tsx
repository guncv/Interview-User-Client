import React, { useState, useEffect, useRef } from "react";
import Colors from "../../assets/styles/Color";
import { HeadphoneOff, Headphones, Mic, MicOff, Settings, RotateCcw, Square } from 'lucide-react';
import CircularIconButton from './CircularIconButton';
import SettingsPopup from '../dialog/SettingsPopup';
import profileImage from "../../assets/images/profile.png";
import { useContextProvider } from "../layout/ContextProvider";

interface InterviewRecordingProps {
    websocketUrl?: string;
    sessionToken?: string;
    isAiSpeaking?: boolean;
    isUserSpeaking?: boolean;
    isUserTurn?: boolean;
    onMicMuteChange?: (isMuted: boolean) => void;
    onHeadphoneMuteChange?: (isMuted: boolean) => void;
    onReconnect?: () => void;
    websocketRef?: React.MutableRefObject<WebSocket | null>;
    elapsedTime?: number;
    isConnected?: boolean;
    isConversationStarted?: boolean;
}

type SpeakingState = 'ai' | 'user' | 'none';

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
    onReconnect,
    websocketRef,
    elapsedTime = 0,
    isConnected = false,
    isConversationStarted = false,
}) => {
    void websocketUrl;
    void sessionToken;
    const [speakingState, setSpeakingState] = useState<SpeakingState>('none');
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
    const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
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
                console.error('Failed to get microphone devices:', error);
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
                analyserRef.current.fftSize = 512;
                analyserRef.current.smoothingTimeConstant = 0.3;
                
                source.connect(gainNodeRef.current);
                gainNodeRef.current.connect(analyserRef.current);
                
                const updateAudioLevel = () => {
                    if (analyserRef.current && !isMicMuted && isConnected) {
                        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                        analyserRef.current.getByteFrequencyData(dataArray);
                        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                        const normalizedLevel = average / 255;
                        
                        
                        setAudioLevel(normalizedLevel);
                    } else {
                        setAudioLevel(0);
                    }
                    requestAnimationFrame(updateAudioLevel);
                };
                
                updateAudioLevel();
            } catch (error) {
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

    useEffect(() => {
        if (isAiSpeaking) {
            setSpeakingState('ai');
            setSessionInfo(prevInfo => ({
                ...prevInfo,
                interviewState: 'AI Speaking'
            }));
        } else if (isUserSpeaking) {
            setSpeakingState('user');
            setSessionInfo(prevInfo => ({
                ...prevInfo,
                interviewState: 'User Speaking'
            }));
        } else {
            setSpeakingState('none');
            setSessionInfo(prevInfo => ({
                ...prevInfo,
                interviewState: 'Listening'
            }));
        }
    }, [isAiSpeaking, isUserSpeaking]);


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
        
        onHeadphoneMuteChange?.(newMutedState);
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const initAudio = async () => {
        try {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }

            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { 
                    deviceId: selectedMicId === 'default' ? undefined : selectedMicId 
                } 
            });
            
            mediaStreamRef.current = stream;
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            
            gainNodeRef.current = audioContextRef.current.createGain();
            
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 512;
            analyserRef.current.smoothingTimeConstant = 0.3;
            
            source.connect(gainNodeRef.current);
            gainNodeRef.current.connect(analyserRef.current);
            
            const updateAudioLevel = () => {
                if (analyserRef.current && !isMicMuted && isConnected) {
                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                    const normalizedLevel = average / 255;
                    setAudioLevel(normalizedLevel);
                } else {
                    setAudioLevel(0);
                }
                requestAnimationFrame(updateAudioLevel);
            };
            
            updateAudioLevel();
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    };

    const handleReconnect = async () => {
        setIsReconnecting(true);
        
        try {
            if (websocketRef?.current) {
                websocketRef.current.close();
            }

            await initAudio();

            setSpeakingState('none');
            setSessionInfo(prev => ({
                ...prev,
                interviewState: 'Ready for interview'
            }));

            if (onReconnect) {
                onReconnect();
            }
        } catch (error) {
            console.error('Failed to reconnect:', error);
        } finally {
            setIsReconnecting(false);
        }
    };

    const handleEndInterview = () => {
        setShowSettings(false);
    };

    return (
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
                alignItems: 'center',
                gap: '12px',
                
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
                boxShadow: speakingState === 'ai' ? '0 8px 32px rgba(76, 175, 80, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: speakingState === 'ai' ? '2px solid #4CAF50' : '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: isMobile ? '0px' : '180px',
                transition: 'all 0.3s ease',
                animation: speakingState === 'ai' ? 'aiSpeakingPulse 2s ease-in-out infinite' : 'none'
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
                                Software Engineer
                            </div>
                        </div>
                        <div style={{
                            width: speakingState === 'ai' ? '12px' : '8px',
                            height: speakingState === 'ai' ? '12px' : '8px',
                            borderRadius: '50%',
                            backgroundColor: speakingState === 'ai' ? '#4CAF50' : '#4CAF50',
                            boxShadow: speakingState === 'ai' ? '0 0 12px rgba(76, 175, 80, 0.8)' : '0 0 8px rgba(76, 175, 80, 0.5)',
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
                        const isActive = isConnected && ((speakingState === 'user' && !isMicMuted));
                        const isConversationReady = isConnected && isConversationStarted && !isAiSpeaking && isUserTurn;
                        const baseHeight = 12;
                        const maxHeight = 80; 
                        
                        const audioInfluence = Math.pow(audioLevel * 2, 1.5);
                        const randomVariation = Math.sin((Date.now() / 120) + i * 0.8) * 0.4 + 0.6;
                        
                        let height;
                        if (isActive || audioLevel > 0.05) {
                            height = baseHeight + (audioInfluence + randomVariation * 0.3) * (maxHeight - baseHeight);

                            if (audioLevel > 0.3) {
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
                                    backgroundColor: isConversationReady ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
                                    borderRadius: '3px',
                                    transition: 'all 0.1s ease',
                                    opacity: isConversationReady ? ((audioLevel > 0.05 || isActive) ? 1 : 0.5) : 0.3,
                                    boxShadow: (audioLevel > 0.2 && isConversationReady) ? `0 0 8px ${Colors.ACCENT_COLOR}40` : 'none'
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
                    isActive={!isReconnecting}
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
                    tooltip={!isConnected ? "Connect to enable headphones" : !isConversationStarted ? "Wait for conversation to start" : (isHeadphonesMuted ? "Unmute Headphones" : "Mute Headphones")}
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
    );
};

export default InterviewRecording;