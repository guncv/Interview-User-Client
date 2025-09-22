import ContentLayout from "../components/layout/ContentLayout";
import type { CSSProperties } from "react";
import { PrimaryButton } from "../components/common";
import RecordingRow from "../components/common/RecordingRow";
import Colors from "../assets/styles/Color";
import Size from "../assets/styles/Size";
import font from "../assets/styles/Font";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { downloadResumeByResumeId } from "../actions/resumeAction";
import { getInterviewSessionListCursorAction } from "../actions/interviewAction";
import { useEffect } from "react";
import type { RootState } from "../reducers/rootReducer";

const RecordingListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDownloadResume = (resumeId: string) => {
        dispatch(downloadResumeByResumeId(resumeId));
    }

    const { interviewSessionList } = useSelector((state: RootState) => state.interview);

    console.log("interviewSessionList", interviewSessionList);

    useEffect(() => {
        dispatch(getInterviewSessionListCursorAction({}));
    }, []);
    
    const titleStyle:CSSProperties = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'black',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    }

    const buttonSearchContainerStyle: CSSProperties = {
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
    }

    const searchInputStyle: CSSProperties = {
        height: '45px',
        paddingLeft: '16px',
        paddingRight: '16px',
        border: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        fontFamily: font.Regular,
        outline: 'none',
        fontSize: Size.Medium,
        width: '200px',
        backgroundColor: 'white',
    }

    const tableContainerStyle: CSSProperties = {
        marginTop: '20px',
        width: '100%',
        maxHeight: '80vh',
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
        fontSize: Size.Medium,
        color: Colors.PRIMARY_COLOR,
        cursor: 'pointer',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    }

    const handleStartNewInterviews = () => {
        navigate('/create-interview');
    }

    return (
        <ContentLayout>
            <div style={{ width: '100%', padding: '20px 40px' }}>
                <div style={titleStyle}>
                    <div>Interview Recordings</div>
                    <div style={buttonSearchContainerStyle}>
                        <PrimaryButton label="Start New Interviews" onClick={handleStartNewInterviews} />
                        <input
                            style={searchInputStyle}
                            placeholder="Search Recordings..."
                            onChange={() => {}}
                            value=""
                        />
                    </div>
                </div>
                
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={headerCellStyle}>Position</th>
                                <th style={{...headerCellStyle, textAlign: 'center'}}>Resume</th>
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
            </div>
        </ContentLayout>
    );
};

export default RecordingListPage;