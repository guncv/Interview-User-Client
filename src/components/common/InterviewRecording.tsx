import React, { useState, useEffect, useRef } from "react";
import Colors from "../../assets/styles/Color";
import interviewImage from "../../assets/images/interview.png";
import aiInterviewer from "../../assets/images/ai_interviewer.png";
import Color from "../../assets/styles/Color";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../reducers/rootReducer";
import { FileUser, Headphones, Mic } from 'lucide-react';
import { getInterviewSessionInformation } from "../../actions/interviewAction";
import { downloadResumeBySessionToken } from "../../actions/resumeAction";

interface InterviewRecordingProps {
    websocketUrl?: string;
    sessionToken?: string;
    isAiSpeaking?: boolean;
    isUserSpeaking?: boolean;
}

type SpeakingState = 'ai' | 'user' | 'none';

interface MicrophoneDevice {
    deviceId: string;
    label: string;
}

interface SessionInfo {
    startTime: number;
    elapsedTime: number;
    interviewState: string;
    microphoneDevice: string;
    headphonesDevice: string;
}

const InterviewRecording: React.FC<InterviewRecordingProps> = ({
    websocketUrl,
    sessionToken,
    isAiSpeaking = false,
    isUserSpeaking = false,
}) => {
    void websocketUrl;
    void sessionToken;
    const [speakingState, setSpeakingState] = useState<SpeakingState>('none');
    const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
        startTime: Date.now(),
        elapsedTime: 0,
        interviewState: 'Initializing',
        microphoneDevice: 'Default Microphone',
        headphonesDevice: 'Default Headphones'
    });
    const [availableMicrophones, setAvailableMicrophones] = useState<MicrophoneDevice[]>([]);
    const [selectedMicId, setSelectedMicId] = useState<string>('default');
    const [availableHeadphones, setAvailableHeadphones] = useState<MicrophoneDevice[]>([]);
    const [audioLevel, setAudioLevel] = useState<number>(0);
    const [selectedHeadphonesId, setSelectedHeadphonesId] = useState<string>('default');
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    
    const dispatch = useDispatch();
    const interviewSessionInformation = useSelector((state: RootState) => state.interview.interviewSessionInformation);

    useEffect(() => {
        if (sessionToken) {
            dispatch(getInterviewSessionInformation(sessionToken));
        }
    }, [sessionToken, dispatch]);


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
                        deviceId: selectedMicId === 'default' ? undefined : selectedMicId 
                    } 
                });
                
                audioContextRef.current = new AudioContext();
                const source = audioContextRef.current.createMediaStreamSource(stream);
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                source.connect(analyserRef.current);
                
                const updateAudioLevel = () => {
                    if (analyserRef.current) {
                        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                        analyserRef.current.getByteFrequencyData(dataArray);
                        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                        setAudioLevel(average / 255);
                        requestAnimationFrame(updateAudioLevel);
                    }
                };
                
                // Always monitor audio level for speech detection
                updateAudioLevel();
            } catch (error) {
                console.error('Failed to initialize audio analysis:', error);
            }
        };

        if (selectedMicId) {
            initAudioAnalysis();
        }
    }, [selectedMicId]);

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

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

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

    const WaveformVisualization: React.FC<{ audioLevel: number; isActive: boolean }> = ({ audioLevel, isActive }) => {
        const bars = Array.from({ length: 12 }, (_, i) => {
            const height = isActive ? Math.max(0.1, audioLevel + Math.random() * 0.3) : 0.1;
            const delay = i * 0.1;
            
            return (
                <div
                    key={i}
                    style={{
                        width: '3px',
                        height: `${height * 30 + 5}px`,
                        backgroundColor: isActive ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
                        borderRadius: '2px',
                        animation: isActive ? `waveformBounce 0.8s ease-in-out infinite ${delay}s` : 'none',
                        opacity: isActive ? 0.8 + height * 0.2 : 0.3,
                        transition: 'all 0.2s ease'
                    }}
                />
            );
        });

        return (
            <div style={{
                display: 'flex',
                alignItems: 'end',
                gap: '2px',
                height: '40px',
                padding: '5px 10px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(5px)'
            }}>
                {bars}
            </div>
        );
    };

    const handleDownloadResume = () => {
        dispatch(downloadResumeBySessionToken(sessionToken || ''));
    };

    return (
        <div style={{padding: '20px'}}>
            <div style={{
                fontSize: '20px',
                fontWeight: '600',
                color: Colors.PRIMARY_COLOR,
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <div>
                    Session Position: {interviewSessionInformation.position}
                </div>
                
                <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: Colors.PRIMARY_COLOR,
                }}>
                    Time: {formatTime(sessionInfo.elapsedTime)}
                </div>
            </div>

            <div style={{ 
                width: '100%', 
                height: '45vh', 
                display: 'flex', 
                flexDirection: 'row', 
                background: 'linear-gradient(135deg, #E6D2FF 0%, #F0E6FF 50%, #E6D2FF 100%)',
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
                animation: speakingState !== 'none' ? 'breathingGlow 2s ease-in-out infinite' : 'none'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '15%',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(139, 21, 255, 0.1)',
                    animation: 'floatingElements 3s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '20%',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(139, 21, 255, 0.08)',
                    animation: 'floatingElements 4s ease-in-out infinite 1s'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '60%',
                    left: '10%',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(139, 21, 255, 0.06)',
                    animation: 'floatingElements 5s ease-in-out infinite 2s'
                }}></div>

                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    position: 'relative'
                }}>
                        <img
                            src={interviewImage} 
                            alt="Interview in progress" 
                            style={{
                                maxWidth: '220px',
                                maxHeight: '220px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
                                animation: speakingState === 'user' ? 'centerAISpeaking 1.8s ease-in-out infinite' : 'none',
                                transition: 'all 0.5s ease',
                                borderRadius: '12px'
                            }}
                        />
                    

                    <div style={{
                        marginTop: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        {speakingState === 'user' && (
                            <WaveformVisualization 
                                audioLevel={audioLevel} 
                                isActive={speakingState === 'user'} 
                            />
                        )}

                        {speakingState === 'user' ? (
                            <div style={{
                                backgroundColor: Color.ACCENT_COLOR,
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                fontSize: '15px',
                                fontWeight: '600',
                                boxShadow: '0 4px 12px rgba(139, 21, 255, 0.4)',
                                animation: 'pulse 1s infinite',
                                border: '2px solid rgba(255, 255, 255, 0.2)'
                            }}>
                                You are speaking...
                            </div>
                        ) : speakingState === 'ai' ? (
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                color: Colors.ACCENT_COLOR,
                                padding: '10px 20px',
                                borderRadius: '25px',
                                fontSize: '15px',
                                fontWeight: '600',
                                boxShadow: '0 2px 8px rgba(139, 21, 255, 0.2)',
                                border: '2px solid rgba(139, 21, 255, 0.3)',
                                animation: 'pulse 1.5s infinite'
                            }}>
                                AI is speaking...
                            </div>
                        ) : (
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                color: Colors.SECONDARY_TEXT_COLOR,
                                padding: '10px 20px',
                                borderRadius: '25px',
                                fontSize: '15px',
                                fontWeight: '500',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '2px solid rgba(255, 255, 255, 0.3)'
                            }}>
                                Ready for interview
                            </div>
                        )}
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    top: '25px',
                    right: '25px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
                    backdropFilter: 'blur(10px)',
                    padding: '18px', 
                    borderRadius: '18px',
                    boxShadow: speakingState === 'ai' ? '0 8px 32px rgba(139, 21, 255, 0.4), 0 0 0 2px rgba(139, 21, 255, 0.2)' : '0 6px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5)',
                    minWidth: '130px',
                    animation: speakingState === 'ai' ? 'aiSpeaking 1.5s ease-in-out infinite' : 'none',
                    transform: speakingState === 'ai' ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '10px',
                            position: 'relative',
                            zIndex: 2,
                            boxShadow: '0 4px 12px rgba(139, 21, 255, 0.3)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            padding: '4px',
                            overflow: 'hidden'
                        }}>
                            <img 
                                src={aiInterviewer} 
                                alt="AI Interviewer" 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        
                        {speakingState === 'ai' && (
                            <>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    border: '3px solid rgba(139, 21, 255, 0.4)',
                                    animation: 'soundWaves 1.2s ease-out infinite'
                                }}></div>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '85px',
                                    height: '85px',
                                    borderRadius: '50%',
                                    border: '2px solid rgba(139, 21, 255, 0.25)',
                                    animation: 'soundWaves 1.2s ease-out infinite 0.2s'
                                }}></div>
                            </>
                        )}
                    </div>
                    
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: speakingState === 'ai' ? Colors.ACCENT_COLOR : Colors.PRIMARY_COLOR,
                        textAlign: 'center',
                        marginBottom: '6px',
                        transition: 'color 0.3s ease'
                    }}>
                        AI Interviewer
                    </div>
                    
                    <div style={{
                        fontSize: '11px',
                        color: speakingState === 'ai' ? Colors.ACCENT_COLOR : Colors.SECONDARY_TEXT_COLOR,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: speakingState === 'ai' ? 'rgba(139, 21, 255, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '12px'
                    }}>
                        <div style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: speakingState === 'ai' ? '#FF6B6B' : '#4CAF50',
                            animation: speakingState === 'ai' ? 'pulse 0.8s infinite' : 'pulse 2s infinite',
                            boxShadow: `0 0 6px ${speakingState === 'ai' ? '#FF6B6B' : '#4CAF50'}`
                        }}></div>
                        {speakingState === 'ai' ? 'Speaking' : 'Listening'}
                    </div>
                </div>
                
            </div>

            <div style={{
                width: '100%',
                borderRadius: '15px',
                marginTop: '30px',
                padding: '15px 0px',
                marginBottom: '20px',
                backdropFilter: 'blur(10px)',
                gap: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start'
            }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'start', gap: '15px', width: "100%" }}>
                    <Mic style={{ fontSize: '30px' }}/>
                    <select
                        value={selectedMicId}
                        onChange={(e) => handleMicrophoneChange(e.target.value)}
                        style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(139, 21, 255, 0.2)',
                            background: 'white',
                            fontSize: '15px',
                            width: "60%",
                            fontWeight: '500',
                            color: Colors.PRIMARY_COLOR,
                            cursor: 'pointer',
                        }}
                    >
                        {availableMicrophones.map(mic => (
                            <option key={mic.deviceId} value={mic.deviceId}>
                                {mic.label}
                            </option>
                        ))}
                    </select>
                </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'start', gap: '15px', width: "100%" }}>
                        <Headphones style={{ fontSize: '30px' }}/>
                        <select
                            value={selectedHeadphonesId}
                            onChange={(e) => handleHeadphonesChange(e.target.value)}
                            style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: '1px solid rgba(139, 21, 255, 0.2)',
                                background: 'white',
                                fontSize: '15px',
                                fontWeight: '500',
                                color: Colors.PRIMARY_COLOR,
                                cursor: 'pointer',
                                width: "60%",
                            }}
                        >
                            {availableHeadphones.map(mic => (
                                <option key={mic.deviceId} value={mic.deviceId}>
                                    {mic.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'start', gap: '15px', width: "100%" }}>
                        <FileUser style={{ fontSize: '30px' }}/>
                        <span style={{
                            fontSize: '15px',
                            fontWeight: '500',
                            width: "60%",
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            Resume: {interviewSessionInformation.file_name}
                            <span style={{ fontWeight: '600', color: Colors.LINK_COLOR, textDecoration: 'underline', marginLeft: '10px', cursor: 'pointer' }}
                            onClick={() => handleDownloadResume()}>
                                Open here
                            </span>
                        </span>
                </div>
            </div>
        </div>
    );
};

export default InterviewRecording;