import React from 'react';
import type { CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import font from '../../assets/styles/Font';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Size from '../../assets/styles/Size';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPrevious: () => void;
    onNext: () => void;
    onFirst: (currentPage: number) => void;
    onLast: (currentPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    onPrevious,
    onNext,
    onFirst,
    onLast,
}) => {

    const handleOnClickChangePage = (page: number) => {
        if (page === currentPage) {
            return;
        }
        onPageChange(page);
    };

    const handleOnClickFirstPage = () => {
        if (currentPage === 1) return;
        onFirst(currentPage);
    };

    const handleOnClickLastPage = () => {
        if (currentPage === totalPages) return;
        onLast(currentPage);
    };

    const handleOnClickPreviousPage = () => {
        if (currentPage === 1) return;
        onPrevious();
    };

    const handleOnClickNextPage = () => {
        if (currentPage === totalPages) return;
        onNext();
    };

    const containerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '8px',
        height: '10vh',
    };

    const paginationContainerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '20px',
        padding: '16px',
    };

    const iconStyle: CSSProperties = {
        width: '20px',
        height: '20px',
    };

    const paginationButtonStyle: CSSProperties = {
        padding: '8px 12px',
        backgroundColor: 'white',
        color: Colors.PRIMARY_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        outline: 'none',
        gap: '4px',
        cursor: 'pointer',
        fontSize: Size.Medium,
        fontFamily: font.Regular,
        transition: 'all 0.2s ease',
    };

    const paginationButtonActiveStyle: CSSProperties = {
        ...paginationButtonStyle,
        backgroundColor: Colors.ACCENT_COLOR_LIGHT,
        color: Colors.ACCENT_COLOR,
        borderRadius: "10px",
    };

    const paginationButtonDisabledStyle: CSSProperties = {
        ...paginationButtonStyle,
        color: Colors.SECONDARY_TEXT_COLOR,
        cursor: '',
    };

    const generatePageNumbers = () => {
        const pages = [];
        
        pages.push(1);
        
        const rangeStart = Math.max(2, currentPage - 2);
        const rangeEnd = Math.min(totalPages - 1, currentPage + 2);
        
        for (let i = rangeStart; i <= rangeEnd; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            }
        }
        
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };


    return (
        <div style={containerStyle}>
            <div style={paginationContainerStyle}>
                <button
                    style={currentPage === 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
                    onClick={handleOnClickFirstPage}
                >
                    <ChevronsLeft style={iconStyle} />
                </button>

                <button
                    style={currentPage === 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
                    onClick={handleOnClickPreviousPage}
                >
                    <ChevronLeft style={iconStyle} />
                </button>

                {generatePageNumbers().map((page, index) => {
                    const isActive = page === currentPage;
                    const showEllipsisBefore = index > 0 && page - generatePageNumbers()[index - 1] > 1;
                    
                    return (
                        <React.Fragment key={page}>
                            {showEllipsisBefore && (
                                <span style={{ 
                                    color: Colors.SECONDARY_TEXT_COLOR,
                                    padding: '0 8px',
                                    fontSize: Size.Medium,
                                    fontFamily: font.Regular
                                }}>
                                    ...
                                </span>
                            )}
                            <button
                                style={isActive ? paginationButtonActiveStyle : paginationButtonStyle}
                                onClick={() => handleOnClickChangePage(page)}
                            >
                                {page}
                            </button>
                        </React.Fragment>
                    );
                })}


                <button
                    style={currentPage === totalPages ? paginationButtonDisabledStyle : paginationButtonStyle}
                    onClick={handleOnClickNextPage}
                >
                    <ChevronRight style={iconStyle} />
                </button>

                <button
                    style={currentPage === totalPages ? paginationButtonDisabledStyle : paginationButtonStyle}
                    onClick={handleOnClickLastPage}
                >
                    <ChevronsRight style={iconStyle} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
