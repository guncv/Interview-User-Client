import ContentLayout from "../components/layout/ContentLayout";
import type { CSSProperties } from "react";
import { PrimaryButton, Pagination } from "../components/common";
import RecordingRow from "../components/common/RecordingRow";
import Colors from "../assets/styles/Color";
import Size from "../assets/styles/Size";
import font from "../assets/styles/Font";
import { safeNavigate } from "../utils/navigation";
import { useDispatch, useSelector } from "react-redux";
import { downloadResumeByResumeId } from "../actions/resumeAction";
import { getInterviewSessionListCursorAction, getInterviewSessionListPageAction } from "../actions/interviewAction";
import { useEffect, useState, useCallback } from "react";
import type { RootState } from "../reducers/rootReducer";
import type { GetInterviewSessionListCursorReq, GetInterviewSessionListPageReq } from "../interface";
import { CURSOR_TYPE } from "../constants";
import { useContextProvider } from "../components/layout/ContextProvider";

const RecordingListPage = () => {
    const dispatch = useDispatch();
    const {isMobile, isTablet} = useContextProvider();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText, setDebouncedSearchText] = useState("");

    const handleDownloadResume = (resumeId: string) => {
        dispatch(downloadResumeByResumeId(resumeId));
    }

    const { interviewSessionList } = useSelector((state: RootState) => state.interview);

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
        maxHeight: isMobile ? 'calc(100vh - 200px)' : isTablet ? 'calc(100vh - 180px)' : '80vh',
        backgroundColor: "white",
        overflowY: 'auto',
        borderRadius: '8px',
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

    return (
        <ContentLayout>
            <div style={{ width: '100%', padding: '20px 40px' }}>
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

                        <tbody>
                            {interviewSessionList.sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{
                                        textAlign: 'center',
                                        padding: '40px 16px',
                                        fontSize: Size.Medium,
                                        color: Colors.SECONDARY_TEXT_COLOR,
                                        fontFamily: font.Regular
                                    }}>
                                        No interviews Recordings found
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
                        
                    </table>
                </div>

                {interviewSessionList.total_pages > 0 && (
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
        </ContentLayout>
    );
};

export default RecordingListPage;