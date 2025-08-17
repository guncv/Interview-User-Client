import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { Calendar } from 'lucide-react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';

type PrimaryDatePickerProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    minDate?: string;
    maxDate?: string;
};

export const PrimaryDatePicker = ({
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    minDate,
    maxDate,
}: PrimaryDatePickerProps) => {
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

    const labelStyle: CSSProperties = {
        fontSize: Size.Medium,
        color: Colors.PRIMARY_COLOR,
        opacity: disabled ? 0.5 : 1,
    };

    const datePickerWrapperStyle: CSSProperties = {
        position: 'relative',
        width: '100%',
    };

    const datePickerStyle: CSSProperties = {
        width: '100%',
        marginTop: Size.Small,
        height: '45px',
        border: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
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
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        border: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        marginTop: '2px',
        padding: Size.Medium,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        minWidth: '280px',
        maxWidth: '320px',
    };

    const calendarHeaderStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Size.Medium,
    };

    const monthYearStyle: CSSProperties = {
        fontSize: Size.Medium,
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
        fontSize: Size.Medium,
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
        fontSize: Size.Small,
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
        fontSize: "13px",
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
        
        if (hoveredDay === index && !isSelected(date) && !isOtherMonth(date, month)) {
            style = { ...style, ...dayHoverStyle };
        }
        
        return style;
    };

    const { days, year, month } = getCurrentMonthData();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div style={fieldWrapperStyle} ref={datePickerRef}>
            <div style={labelStyle}>{label}</div>
            
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
                    <div style={calendarContainerStyle}>
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
                                        handleDateSelect(date);
                                    }}
                                    onMouseEnter={() => setHoveredDay(index)}
                                    onMouseLeave={() => setHoveredDay(null)}
                                    disabled={isOtherMonth(date, month)}
                                >
                                    {date.getDate()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
