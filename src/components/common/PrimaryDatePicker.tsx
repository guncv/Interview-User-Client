import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { Calendar } from 'lucide-react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import { useContextProvider } from '../layout/ContextProvider';

type PrimaryDatePickerProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
};

export const PrimaryDatePicker = ({
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    error,
}: PrimaryDatePickerProps) => {
    const { isMobile } = useContextProvider();
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const fieldWrapperStyle: CSSProperties = {
        width: '100%',
        position: 'relative',
    };

    const labelContainerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const labelStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        color: Colors.PRIMARY_COLOR,
        opacity: disabled ? 0.5 : 1,
    };

    const errorStyle: CSSProperties = {
        fontSize: Size.Small,
        color: Colors.TEXT_ERROR_COLOR,
        fontFamily: font.Regular,
        textAlign: 'right',
        flexShrink: 0,
        marginLeft: Size.Small,
    };

    const datePickerWrapperStyle: CSSProperties = {
        position: 'relative',
        width: '100%',
    };

    const datePickerStyle: CSSProperties = {
        width: '100%',
        marginTop: Size.Small,
        height: isMobile ? '35px' : '45px',
        border: `1px solid ${error ? Colors.TEXT_ERROR_COLOR : Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        padding: Size.Small,
        paddingLeft: Size.Medium,
        paddingRight: Size.Medium,
        fontFamily: font.Regular,
        outline: 'none',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const calendarIconStyle: CSSProperties = {
        width: '20px',
        height: '20px',
        color: Colors.SECONDARY_TEXT_COLOR,
    };

    const calendarContainerStyle: CSSProperties = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        right: 'auto',
        transform: 'translate(-50%, -50%)',
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        border: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        marginTop: 0,
        padding: Size.Medium,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        minWidth: '280px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflow: 'auto',
        display: 'block',
        // Ensure visibility
        visibility: 'visible',
        opacity: 1,
    };

    const calendarHeaderStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Size.Medium,
    };

    const monthYearStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Medium,
        color: Colors.PRIMARY_COLOR,
    };

    const navButtonStyle: CSSProperties = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: Size.Small,
        borderRadius: Size.Small,
        color: Colors.ACCENT_COLOR,
        fontSize: isMobile ? Size.Small : Size.Medium,
        transition: 'background-color 0.2s ease',
    };

    const navButtonHoverStyle: CSSProperties = {
        backgroundColor: Colors.ACCENT_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
    };

    const weekdaysContainerStyle: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
        marginBottom: Size.Small,
    };

    const weekdayStyle: CSSProperties = {
        textAlign: 'center',
        fontSize: Size.Small,
        fontFamily: font.Medium,
        color: Colors.SECONDARY_TEXT_COLOR,
        padding: Size.Small,
    };

    const daysContainerStyle: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
    };

    const dayStyle: CSSProperties = {
        textAlign: 'center',
        padding: Size.Small,
        cursor: 'pointer',
        borderRadius: Size.Small,
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Regular,
        transition: 'background-color 0.2s ease',
        border: 'none',
        background: 'none',
    };

    const dayHoverStyle: CSSProperties = {
        backgroundColor: Colors.ACCENT_COLOR,
    };

    const selectedDayStyle: CSSProperties = {
        backgroundColor: Colors.ACCENT_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
    };

    const todayStyle: CSSProperties = {
        border: `2px solid ${Colors.ACCENT_COLOR}`,
    };

    const otherMonthDayStyle: CSSProperties = {
        color: Colors.SECONDARY_TEXT_COLOR,
        opacity: 0.5,
    };

    const selectedValueStyle: CSSProperties = {
        color: value ? Colors.PRIMARY_COLOR : Colors.SECONDARY_TEXT_COLOR,
        fontSize: isMobile ? Size.Small : Size.Medium,
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleDateSelect = (date: Date) => {
        const formattedDate = date.toISOString().split('T')[0];
        onChange(formattedDate);
        setIsOpen(false);
    };

    const getCurrentMonthData = () => {
        const today = new Date();
        const currentDate = value ? new Date(value) : today;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = [];
        const currentDateInLoop = new Date(startDate);
        
        while (currentDateInLoop <= lastDay || days.length < 42) {
            days.push(new Date(currentDateInLoop));
            currentDateInLoop.setDate(currentDateInLoop.getDate() + 1);
        }
        
        return { days, year, month };
    };

    const navigateMonth = (direction: number) => {
        const currentDate = value ? new Date(value) : new Date();
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        onChange(newDate.toISOString().split('T')[0]);
    };

    const formatMonthYear = (year: number, month: number) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[month]} ${year}`;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date) => {
        if (!value) return false;
        return date.toDateString() === new Date(value).toDateString();
    };

    const isOtherMonth = (date: Date, currentMonth: number) => {
        return date.getMonth() !== currentMonth;
    };

    const isFutureDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        return date > today;
    };

    const getDayStyle = (date: Date, index: number) => {
        let style: CSSProperties = { ...dayStyle };
        
        if (isToday(date)) {
            style = { ...style, ...todayStyle };
        }
        
        if (isSelected(date)) {
            style = { ...style, ...selectedDayStyle };
        }
        
        if (isOtherMonth(date, month)) {
            style = { ...style, ...otherMonthDayStyle };
        }
        
        if (isFutureDate(date)) {
            style = { ...style, ...otherMonthDayStyle, cursor: 'not-allowed' };
        }
        
        if (hoveredDay === index && !isSelected(date) && !isOtherMonth(date, month) && !isFutureDate(date)) {
            style = { ...style, ...dayHoverStyle };
        }
        
        return style;
    };

    const { days, year, month } = getCurrentMonthData();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const backdropStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    };

    const closeButtonStyle: CSSProperties = {
        position: 'absolute',
        top: Size.Small,
        right: Size.Small,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: Size.Large,
        color: Colors.SECONDARY_TEXT_COLOR,
        padding: Size.Small,
        borderRadius: Size.Small,
        lineHeight: 1,
    };

    const closeButtonHoverStyle: CSSProperties = {
        backgroundColor: Colors.ACCENT_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
    };

    return (
        <div style={fieldWrapperStyle} ref={datePickerRef}>
            <div style={labelContainerStyle}>
                <div style={labelStyle}>{label}</div>
                {error && <div style={errorStyle}>{error}</div>}
            </div>
            
            <div style={datePickerWrapperStyle}>
                <div 
                    style={datePickerStyle} 
                    onClick={handleToggle}
                >
                    <span style={selectedValueStyle}>
                        {value || placeholder || 'Select a date'}
                    </span>
                    <Calendar style={calendarIconStyle} />
                </div>
                
                {isOpen && (
                    <>
                        <div 
                            style={backdropStyle} 
                            onClick={() => setIsOpen(false)}
                        />
                        <div 
                            style={calendarContainerStyle}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                style={closeButtonStyle}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                                onMouseEnter={(e) => {
                                    Object.assign(e.currentTarget.style, closeButtonHoverStyle);
                                }}
                                onMouseLeave={(e) => {
                                    Object.assign(e.currentTarget.style, closeButtonStyle);
                                }}
                            >
                                ×
                            </button>
                            <div style={calendarHeaderStyle}>
                                <button
                                    style={navButtonStyle}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateMonth(-1);
                                    }}
                                    onMouseEnter={(e) => {
                                        Object.assign(e.currentTarget.style, navButtonHoverStyle);
                                    }}
                                    onMouseLeave={(e) => {
                                        Object.assign(e.currentTarget.style, navButtonStyle);
                                    }}
                                >
                                    ‹
                                </button>
                                <div style={monthYearStyle}>
                                    {formatMonthYear(year, month)}
                                </div>
                                <button
                                    style={navButtonStyle}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateMonth(1);
                                    }}
                                    onMouseEnter={(e) => {
                                        Object.assign(e.currentTarget.style, navButtonHoverStyle);
                                    }}
                                    onMouseLeave={(e) => {
                                        Object.assign(e.currentTarget.style, navButtonStyle);
                                    }}
                                >
                                    ›
                                </button>
                            </div>
                            
                            <div style={weekdaysContainerStyle}>
                                {weekdays.map(weekday => (
                                    <div key={weekday} style={weekdayStyle}>
                                        {weekday}
                                    </div>
                                ))}
                            </div>
                            
                            <div style={daysContainerStyle}>
                                {days.map((date, index) => (
                                    <button
                                        key={index}
                                        style={getDayStyle(date, index)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isFutureDate(date)) {
                                                handleDateSelect(date);
                                            }
                                        }}
                                        onMouseEnter={() => !isFutureDate(date) && setHoveredDay(index)}
                                        onMouseLeave={() => setHoveredDay(null)}
                                        disabled={isOtherMonth(date, month) || isFutureDate(date)}
                                    >
                                        {date.getDate()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
