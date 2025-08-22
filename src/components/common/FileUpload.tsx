import { Upload, FileText, X } from 'lucide-react';
import { useRef } from 'react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';

interface FileUploadProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
    error?: string;
    isMobile?: boolean;
    isTablet?: boolean;
    accept?: string;
    maxSize?: number; // in bytes
    placeholder?: string;
    subtext?: string;
}

const FileUpload = ({ 
    file, 
    onFileChange, 
    error, 
    isMobile = false, 
    isTablet = false,
    accept = ".pdf",
    maxSize = 10 * 1024 * 1024, // 10MB default
    placeholder = "Click to upload or drag and drop",
    subtext = "PDF up to 10MB"
}: FileUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            onFileChange(selectedFile);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            onFileChange(droppedFile);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const fileUploadAreaStyle: React.CSSProperties = {
        border: `2px dashed ${Colors.ACCENT_COLOR}`,
        borderRadius: Size.Small,
        padding: isMobile ? Size.Medium : isTablet ? Size.Large : Size.Large,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: `linear-gradient(135deg, ${Colors.ACCENT_COLOR_LIGHT} 0%, ${Colors.TEXT_WHITE_COLOR} 100%)`,
        height: isMobile ? '200px' : isTablet ? '220px' : '250px',
        display: 'flex',
        width: '100%',
        maxWidth: isMobile ? '100%' : isTablet ? '350px' : '400px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        flex: 'none',
    };

    const fileUploadIconStyle: React.CSSProperties = {
        width: isMobile ? '35px' : isTablet ? '40px' : '45px',
        height: isMobile ? '30px' : isTablet ? '35px' : '40px',
        color: Colors.ACCENT_COLOR,
        margin: '0 auto',
        marginBottom: Size.Medium,
        transition: 'all 0.3s ease',
    };

    const fileUploadTextStyle: React.CSSProperties = {
        fontSize: isMobile ? Size.Small : isTablet ? Size.Medium : Size.Medium,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Small,
        textAlign: 'center',
        padding: isMobile ? '0 10px' : isTablet ? '0 15px' : '0',
    };

    const fileUploadSubtextStyle: React.CSSProperties = {
        fontSize: Size.Small,
        fontFamily: font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        opacity: 0.8,
        textAlign: 'center',
        padding: isMobile ? '0 10px' : isTablet ? '0 15px' : '0',
    };

    const selectedFileStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? Size.Small : isTablet ? Size.Small : Size.Small,
        borderRadius: Size.Small,
        border: `2px solid ${Colors.ACCENT_COLOR}`,
        marginTop: Size.Medium,
        transition: 'all 0.3s ease',
        flexWrap: isMobile ? 'wrap' : isTablet ? 'nowrap' : 'nowrap',
        gap: isMobile ? Size.Small : isTablet ? Size.Small : Size.Small,
    };

    const fileInfoStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: Size.Small,
        fontSize: Size.Small,
        flexWrap: 'wrap',
        wordBreak: 'break-word',
        flex: 1,
    };

    const removeFileButtonStyle: React.CSSProperties = {
        backgroundColor: Colors.TEXT_ERROR_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        border: 'none',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s ease',
    };

    const infoBoxStyle: React.CSSProperties = {
        padding: Size.Small,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        borderRadius: Size.Small,
        border: `1px solid ${Colors.ACCENT_COLOR_LIGHT}`,
        textAlign: 'center',
        marginTop: file ? Size.Small : 0,
    };

    const infoTextStyle: React.CSSProperties = {
        fontSize: Size.Small,
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular,
    };

    const errorStyle: React.CSSProperties = {
        color: Colors.TEXT_ERROR_COLOR,
        fontSize: Size.Small,
        marginTop: Size.Small,
        padding: Size.Small,
        backgroundColor: Colors.TEXT_ERROR_COLOR + '20',
        borderRadius: Size.Small,
        border: `1px solid ${Colors.TEXT_ERROR_COLOR}`,
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Medium,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const fileListContainerStyle: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Small,
        overflowY: 'auto',
        borderRadius: Size.Small,
        border: `1px solid ${Colors.LECTURE_CONTENT_PART_COLOR}`,
    };

    return (
        <div style={containerStyle}>
            <div 
                style={fileUploadAreaStyle} 
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <Upload style={fileUploadIconStyle} />
                <div style={fileUploadTextStyle}>
                    {placeholder}
                </div>
                <div style={fileUploadSubtextStyle}>
                    {subtext}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <div style={fileListContainerStyle}>
                {file && (
                    <div style={selectedFileStyle}>
                        <div style={fileInfoStyle}>
                            <FileText size={10} color={Colors.ACCENT_COLOR} />
                            <span>{file.name}</span>
                            <span style={{ color: Colors.SECONDARY_TEXT_COLOR }}>
                                ({formatFileSize(file.size)})
                            </span>
                        </div>
                        <button
                            style={removeFileButtonStyle}
                            onClick={() => onFileChange(null)}
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                <div style={infoBoxStyle}>
                    <div style={infoTextStyle}>
                        📄 Supported formats: PDF (Max {formatFileSize(maxSize)})
                    </div>
                </div>

                {error && (
                    <div style={errorStyle}>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
