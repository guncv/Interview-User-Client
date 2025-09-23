import React from 'react';
import font from '../../assets/styles/Font';
import { Colors } from '../../assets/styles';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonColor = Colors.TEXT_ERROR_COLOR,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                textAlign: 'center'
            }}>
                <div style={{
                    fontFamily: font.Bold,
                    fontSize: '18px',
                    marginBottom: '8px',
                    color: Colors.PRIMARY_COLOR
                }}>
                    {title}
                </div>
                <div style={{
                    fontSize: '14px',
                    color: Colors.SECONDARY_TEXT_COLOR,
                    marginBottom: '24px',
                    lineHeight: '1.5'
                }}>
                    {message}
                </div>
                <div style={{
                    display: 'flex',
                    gap: '13px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '8px 20px',
                            border: `1px solid ${Colors.BORDER_COLOR}`,
                            backgroundColor: 'white',
                            color: Colors.PRIMARY_COLOR,
                            borderRadius: '6px',
                            fontFamily: font.Medium,
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '8px 20px',
                            border: 'none',
                            backgroundColor: confirmButtonColor,
                            color: Colors.TEXT_WHITE_COLOR,
                            borderRadius: '6px',
                            fontFamily: font.Medium,
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
