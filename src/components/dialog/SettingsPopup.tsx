import React from "react";
import { Mic, Headphones } from 'lucide-react';
import Colors from "../../assets/styles/Color";

interface MicrophoneDevice {
    deviceId: string;
    label: string;
}

interface SettingsPopupProps {
    isVisible: boolean;
    onClose: () => void;
    availableMicrophones: MicrophoneDevice[];
    availableHeadphones: MicrophoneDevice[];
    selectedMicId: string;
    selectedHeadphonesId: string;
    onMicrophoneChange: (deviceId: string) => void;
    onHeadphonesChange: (deviceId: string) => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({
    isVisible,
    onClose,
    availableMicrophones,
    availableHeadphones,
    selectedMicId,
    selectedHeadphonesId,
    onMicrophoneChange,
    onHeadphonesChange
}) => {
    if (!isVisible) return null;

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
            }} onClick={onClose} />
            
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                padding: '20px',
                minWidth: '500px',
                zIndex: 10000,
                border: '1px solid rgba(139, 21, 255, 0.1)'
            }}>
            <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: Colors.PRIMARY_COLOR,
                marginBottom: '16px',
                textAlign: 'center'
            }}>
                Audio Settings
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px'
                }}>
                    <Mic style={{ fontSize: '18px', color: Colors.ACCENT_COLOR }} />
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: Colors.PRIMARY_COLOR
                    }}>
                        Microphone
                    </span>
                </div>
                <select
                    value={selectedMicId}
                    onChange={(e) => onMicrophoneChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(139, 21, 255, 0.2)',
                        background: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: Colors.PRIMARY_COLOR,
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    {availableMicrophones.map(mic => (
                        <option key={mic.deviceId} value={mic.deviceId}>
                            {mic.label}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px'
                }}>
                    <Headphones style={{ fontSize: '18px', color: Colors.ACCENT_COLOR }} />
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: Colors.PRIMARY_COLOR
                    }}>
                        Headphones
                    </span>
                </div>
                <select
                    value={selectedHeadphonesId}
                    onChange={(e) => onHeadphonesChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(139, 21, 255, 0.2)',
                        background: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: Colors.PRIMARY_COLOR,
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    {availableHeadphones.map(headphones => (
                        <option key={headphones.deviceId} value={headphones.deviceId}>
                            {headphones.label}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '16px'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: Colors.ACCENT_COLOR,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        width: '200px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#7c1cd6';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = Colors.ACCENT_COLOR;
                    }}
                >
                    Done
                </button>
            </div>
        </div>
        </>
    );
};

export default SettingsPopup;
