import ContentLayout from "../components/layout/ContentLayout";
import type { CSSProperties } from "react";
import { PrimaryButton, Pagination, InsiderLoadingSpinner } from "../components/common";
import RecordingRow from "../components/common/RecordingRow";
import Colors from "../assets/styles/Color";
import Size from "../assets/styles/Size";
import font from "../assets/styles/Font";
import { safeNavigate } from "../utils/navigation";
import { useDispatch, useSelector } from "react-redux";
import { downloadResumeByResumeId } from "../actions/resumeAction";
import { getInterviewSessionListCursorAction, getInterviewSessionListPageAction, getFinalizingSessionsAction } from "../actions/interviewAction";
import { useEffect, useState, useCallback } from "react";
import type { RootState } from "../reducers/rootReducer";
import type { GetInterviewSessionListCursorReq, GetInterviewSessionListPageReq } from "../interface";
import { CURSOR_TYPE } from "../constants";
import { useContextProvider } from "../components/layout/ContextProvider";
import noDataImage from "../assets/images/no_data.png";
import { Eye, EyeOff } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";;
dayjs.extend(relativeTime);

const RecordingListPage = () => {
    const dispatch = useDispatch();
    const {isMobile, isTablet} = useContextProvider();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText, setDebouncedSearchText] = useState("");
    const [isFinalizingExpanded, setIsFinalizingExpanded] = useState(true);

    const handleDownloadResume = (resumeId: string) => {
        dispatch(downloadResumeByResumeId(resumeId));
    }

    const { interviewSessionList, finalizingSessions, interviewSessionListLoading, finalizingSessionsLoading } = useSelector((state: RootState) => state.interview);
    const isLoading = interviewSessionListLoading && finalizingSessionsLoading;

    useEffect(() => {
        dispatch(getFinalizingSessionsAction());
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchText]);

    const performSearch = useCallback((searchQuery: string) => {
        setCurrentPage(1);
        if (searchQuery.trim() === "") {
            dispatch(getInterviewSessionListCursorAction({}));
        } else {
            dispatch(getInterviewSessionListPageAction({ 
                offset: 0, 
                search_text: searchQuery.trim() 
            }));
        }
    }, [dispatch]);

    useEffect(() => {
        performSearch(debouncedSearchText);
    }, [debouncedSearchText, performSearch]);

    const handlePageChange = (page: number) => {
        if (page === currentPage - 1 ) {
            const req: GetInterviewSessionListCursorReq = {
                cursor_id: interviewSessionList.prev_cursor?.id,
                cursor_created_at: interviewSessionList.prev_cursor?.created_at,
                type: CURSOR_TYPE.PREV,
                search_text: debouncedSearchText.trim() || undefined
            }
            dispatch(getInterviewSessionListCursorAction(req));
        } else if (page === currentPage + 1) {
            const req: GetInterviewSessionListCursorReq = {
                cursor_id: interviewSessionList.next_cursor?.id,
                cursor_created_at: interviewSessionList.next_cursor?.created_at,
                type: CURSOR_TYPE.NEXT,
                search_text: debouncedSearchText.trim() || undefined
            }
            dispatch(getInterviewSessionListCursorAction(req));
        } else {
            const req: GetInterviewSessionListPageReq = {
                offset: page,
                search_text: debouncedSearchText.trim() || undefined
            }
            dispatch(getInterviewSessionListPageAction(req));
        }
        setCurrentPage(page);
    };

    const handlePrevious = (currentPage: number) => {
        if (currentPage > 1) {
            const req: GetInterviewSessionListCursorReq = {
                cursor_id: interviewSessionList.prev_cursor?.id,
                cursor_created_at: interviewSessionList.prev_cursor?.created_at,
                type: CURSOR_TYPE.PREV,
                search_text: debouncedSearchText.trim() || undefined
            }
            dispatch(getInterviewSessionListCursorAction(req));
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = (currentPage: number) => {
        if (currentPage < interviewSessionList.total_pages) {
            const req: GetInterviewSessionListCursorReq = {
                cursor_id: interviewSessionList.next_cursor?.id,
                cursor_created_at: interviewSessionList.next_cursor?.created_at,
                search_text: debouncedSearchText.trim() || undefined
            }
            dispatch(getInterviewSessionListCursorAction(req));
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFirst = () => {
        if (currentPage === 1) return;
        else if (currentPage - 1 === 1) {
            const req: GetInterviewSessionListCursorReq = {
                cursor_id: interviewSessionList.prev_cursor?.id,
                cursor_created_at: interviewSessionList.prev_cursor?.created_at,
                type: CURSOR_TYPE.PREV,
                search_text: debouncedSearchText.trim() || undefined
            }
            dispatch(getInterviewSessionListCursorAction(req));
        } else {
            const req: GetInterviewSessionListPageReq = {
                offset: 0,
                search_text: debouncedSearchText.trim() || undefined
            }
            dispatch(getInterviewSessionListPageAction(req));
        } setCurrentPage(1);
    };

    const handleLast = () => {
        if (currentPage === interviewSessionList.total_pages) return;
        else if (currentPage + 1 === interviewSessionList.total_pages) {
            const req: GetInterviewSessionListCursorReq = {
                cursor_id: interviewSessionList.next_cursor?.id,
                cursor_created_at: interviewSessionList.next_cursor?.created_at,
                search_text: debouncedSearchText.trim() || undefined
            }
            dispatch(getInterviewSessionListCursorAction(req));
        } else {
            const req: GetInterviewSessionListPageReq = {
                offset: interviewSessionList.total_pages,
                search_text: debouncedSearchText.trim() || undefined
            }
            dispatch(getInterviewSessionListPageAction(req));
        }
        setCurrentPage(interviewSessionList.total_pages);
    };
    
    const titleStyle:CSSProperties = {
        fontSize: isMobile || isTablet ? "20px" : "24px",
        fontWeight: 'bold',
        color: 'black',
        width: '100%',
        display: 'flex',
        flexDirection: isMobile ? "column" : "row",
        justifyContent: 'space-between',
        alignItems: isMobile ? "stretch" : "center",
        gap: isMobile || isTablet ? "16px" : "0px",
        marginBottom: isMobile ? "8px" : "0px",
    }

    const buttonSearchContainerStyle: CSSProperties = {
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        justifyContent: "flex-end",
        flexWrap: 'wrap',
        width: isMobile ? "100%" : "auto",
        minHeight: isMobile ? "45px" : "auto",
    }

    const searchInputStyle: CSSProperties = {
        height: isMobile || isTablet ? "35px" : "45px",
        paddingLeft: isMobile ? "8px" : "16px",
        paddingRight: isMobile ? "8px" : "16px",
        border: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        fontFamily: font.Regular,
        outline: 'none',
        fontSize: isMobile ? "11px" : isTablet ? "13px" : Size.Medium,
        width: isMobile ? "150px" : "200px",
        backgroundColor: 'white',
    }

    const tableContainerStyle: CSSProperties = {
        marginTop: '20px',
        width: '100%',
        backgroundColor: "white",
        overflowY: 'auto',
        borderRadius: '8px',
        flex: '1',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column'
    }

    const tableStyle: CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
    }

    const headerCellStyle: CSSProperties = {
        padding: '16px 12px',
        textAlign: 'left',
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold',
        fontSize: isMobile ? "11px" : isTablet ? "13px" : Size.Medium,
        color: Colors.PRIMARY_COLOR,
        cursor: 'pointer',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    }

    const buttonStartNewInterviewsStyle: CSSProperties = {
        fontSize: isMobile ? "11px" : isTablet ? "13px" : Size.Medium,
        width: isMobile ? "auto" : "auto",
    }

    const handleStartNewInterviews = () => {
        safeNavigate('/create-interview');
    }

    const dataCellStyle: CSSProperties = {
        padding: isMobile ? "8px 10px" : "16px 12px",
        textAlign: 'left',
        borderBottom: `1px solid #e9ecef`,
        fontSize: isMobile ? "11px" : isTablet ? "13px" : Size.Medium,
        color: Colors.PRIMARY_COLOR,
        transition: 'all 0.3s ease',
    };

    const finalizingContainerStyle: CSSProperties = {
        marginTop: '20px',
        marginBottom: '20px',
        padding: isFinalizingExpanded ? '16px' : '12px',
        backgroundColor: '#FFF9E6',
        borderRadius: '8px',
        border: '1px solid #FFD700',
        maxHeight: isFinalizingExpanded ? '280px' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'all 0.3s ease',
        overflow: 'hidden',
    };

    const finalizingHeaderStyle: CSSProperties = {
        fontSize: isMobile ? "12px" : "16px",
        fontWeight: 'bold',
        color: Colors.PRIMARY_COLOR,
        marginBottom: isFinalizingExpanded ? '5px' : '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    };

    const toggleButtonStyle: CSSProperties = {
        backgroundColor: 'transparent',
        border: 'none',
        padding: isMobile ? '6px 8px' : '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: isMobile ? '12px' : isTablet ? '14px' : '16px',
        color: Colors.PRIMARY_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: isMobile ? '28px' : isTablet ? '32px' : '36px',
        minHeight: isMobile ? '28px' : isTablet ? '32px' : '36px',
    };

    const finalizingInfoStyle: CSSProperties = {
        fontSize: isMobile ? "11px" : "13px",
        color: Colors.SECONDARY_TEXT_COLOR,
        marginBottom: '8px',
    };

    const mainContainerStyle: CSSProperties = {
        width: '100%',
        padding: '20px 40px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
    };

    const contentAreaStyle: CSSProperties = {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden'
    };

    return (
        <ContentLayout>
            <div style={mainContainerStyle}>
                <div style={titleStyle}>
                    <div>Interview Recordings</div>
                    <div style={buttonSearchContainerStyle}>
                        <PrimaryButton style={buttonStartNewInterviewsStyle} label="Start New Interviews" onClick={handleStartNewInterviews} />
                        <input
                            style={searchInputStyle}
                            placeholder="Search Recordings..."
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                        />
                    </div>
                </div>

                <div style={contentAreaStyle}>
                    {finalizingSessions.sessions.length > 0 && (
                        
                    <div style={finalizingContainerStyle}>
                        <div 
                            style={finalizingHeaderStyle}
                            onClick={() => setIsFinalizingExpanded(!isFinalizingExpanded)}
                            title={isFinalizingExpanded ? "Collapse section" : "Expand section"}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>⏳</span>
                                <span>Finalizing Recordings ({finalizingSessions.total_count})</span>
                            </div>
                            <button 
                                style={{
                                    ...toggleButtonStyle,
                                    backgroundColor: isFinalizingExpanded ? 'transparent' : '#fff4',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fff3';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = isFinalizingExpanded ? 'transparent' : '#fff4';
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFinalizingExpanded(!isFinalizingExpanded);
                                }}
                                title={isFinalizingExpanded ? "Hide details" : "Show details"}
                            >
                                <span style={{ 
                                    fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px', 
                                    filter: isFinalizingExpanded ? 'opacity(1)' : 'opacity(0.6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {isFinalizingExpanded ? <Eye size={isMobile ? 16 : isTablet ? 18 : 20} /> : <EyeOff size={isMobile ? 16 : isTablet ? 18 : 20} />}
                                </span>
                            </button>
                        </div>
                        
                        {isFinalizingExpanded && !isLoading && (
                            <>
                                <div style={finalizingInfoStyle}>
                                    Your interview session is being processed. Scores are being calculated...
                                </div>
                                <div style={{ 
                                    maxHeight: isMobile ? '120px' : '180px', 
                                    overflowY: 'auto',
                                    backgroundColor: 'white',
                                    borderRadius: '4px',
                                    flex: '1',
                                    minHeight: '120px'
                                }}>
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr>
                                                <th style={{...headerCellStyle, backgroundColor: '#FFF9E6'}}>Position</th>
                                                {isMobile ? null : <th style={{...headerCellStyle, textAlign: 'center', backgroundColor: '#FFF9E6'}}>Resume</th>}
                                                <th style={{...headerCellStyle, textAlign: 'center', backgroundColor: '#FFF9E6'}}>Status</th>
                                                <th style={{...headerCellStyle, textAlign: 'center', backgroundColor: '#FFF9E6'}}>Total Time</th>
                                                <th style={{...headerCellStyle, textAlign: 'center', backgroundColor: '#FFF9E6'}}>Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {finalizingSessions.sessions.map((interview) => (
                                                <tr key={interview.id} style={{ opacity: 0.8 }}>
                                                    <td style={dataCellStyle}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <span>{interview.position}</span>
                                                        </div>
                                                    </td>
                                                    
                                                    {isMobile ? null : <td style={{...dataCellStyle, textAlign: 'center'}}>
                                                        <span style={{ fontSize: isTablet ? "10px" : Size.Medium }}>
                                                            {interview.resume_file_name}
                                                        </span>
                                                    </td>}
                                                    
                                                    <td style={{...dataCellStyle, textAlign: 'center'}}>
                                                        <span style={{
                                                            padding: isMobile ? "4px 8px" : "4px 12px",
                                                            borderRadius: '16px',
                                                            fontSize: isMobile ? "8px" : isTablet ? "10px" : "12px",
                                                            fontWeight: 'bold',
                                                            backgroundColor: `${interview.status_color + '20'}`,
                                                            color: `${interview.status_color}`,
                                                        }}>
                                                            {interview.status}
                                                        </span>
                                                    </td>
                                                    
                                                    <td style={{...dataCellStyle, textAlign: 'center'}}>
                                                        <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>
                                                            {interview.total_time}
                                                        </span>
                                                    </td>
                                                    
                                                    <td style={{...dataCellStyle, textAlign: 'center', fontSize: "12px"}}>
                                                        <span style={{ color: Colors.SECONDARY_TEXT_COLOR }}>
                                                            {dayjs(interview.created_at).fromNow()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={headerCellStyle}>Position</th>
                                {isMobile ? null : <th style={{...headerCellStyle, textAlign: 'center'}}>Resume</th>}
                                <th style={{...headerCellStyle, textAlign: 'center'}}>Score</th>
                                <th style={{...headerCellStyle, textAlign: 'center'}}>Status</th>
                                <th style={{...headerCellStyle, textAlign: 'center'}}>Total Time</th>
                                <th style={{...headerCellStyle, textAlign: 'center'}}>Created At</th>
                            </tr>
                        </thead>

                        {!isLoading ? (
                            <tbody>
                                {interviewSessionList.sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{
                                            textAlign: 'center',
                                            padding: '60px 20px',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '20px',
                                                maxWidth: '400px',
                                                margin: '0 auto'
                                            }}>
                                                <img 
                                                    src={noDataImage} 
                                                    alt="No recordings found"
                                                    style={{
                                                        width: isMobile ? '120px' : '150px',
                                                        height: isMobile ? '120px' : '150px',
                                                        objectFit: 'contain',
                                                        opacity: 0.8
                                                    }}
                                                />
                                                <div style={{
                                                    textAlign: 'center'
                                                }}>
                                                    <h3 style={{
                                                        fontSize: isMobile ? '18px' : '22px',
                                                        fontFamily: font.Regular,
                                                        color: Colors.PRIMARY_COLOR,
                                                        margin: '0 0 8px 0'
                                                    }}>
                                                        No Interview Recordings Yet
                                                    </h3>
                                                    <p style={{
                                                        fontSize: isMobile ? '14px' : Size.Medium,
                                                        color: Colors.SECONDARY_TEXT_COLOR,
                                                        fontFamily: font.Regular,
                                                        margin: '0 0 24px 0',
                                                        lineHeight: '1.5'
                                                    }}>
                                                        Start your first interview to see your recordings and performance analytics here.
                                                    </p>
                                                    <PrimaryButton 
                                                        label="Start Your First Interview"
                                                        onClick={handleStartNewInterviews}
                                                        style={{
                                                            fontSize: isMobile ? '14px' : Size.Medium,
                                                            borderRadius: '8px',
                                                            fontFamily: font.Medium
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    interviewSessionList.sessions.map((interview) => (
                                        <RecordingRow 
                                            key={interview.id}
                                            interview={interview}
                                            onDownloadResume={handleDownloadResume}
                                        />
                                    ))
                                )}
                            </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '60px 20px' }}>
                                            <InsiderLoadingSpinner
                                                isVisible={true}
                                                wrapperStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                </div>

                <div style={{ 
                    flexShrink: 0, 
                    marginTop: '16px', 
                    paddingTop: '16px',
                    borderTop: '1px solid #e9ecef'
                }}>
                    {interviewSessionList.total_pages > 0 && !isLoading && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={interviewSessionList.total_pages || 1}
                            onPageChange={handlePageChange}
                            onPrevious={() => handlePrevious(currentPage)}
                            onNext={() => handleNext(currentPage)}
                            onFirst={handleFirst}
                            onLast={handleLast}
                        />
                    )}
                </div>
                </div>
            </div>
        </ContentLayout>
    );
};

export default RecordingListPage;