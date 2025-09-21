import ContentLayout from "../components/layout/ContentLayout";
import type { CSSProperties } from "react";
import { PrimaryButton } from "../components/common";
import RecordingRow from "../components/common/RecordingRow";
import Colors from "../assets/styles/Color";
import Size from "../assets/styles/Size";
import font from "../assets/styles/Font";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { downloadResumeByResumeId } from "../actions/resumeAction";

const RecordingListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDownloadResume = (resumeId: string) => {
        dispatch(downloadResumeByResumeId(resumeId));
    }
    
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


    const interviews = [
        {
            id: 1,
            position: "Software Engineer",
            resume_id: "1",
            resume_file_name: "resume (1).pdf",
            score: "78",
            totalTime: "12:45",
            status: "Completed",
            createdAt: "Aug 1",
        },
        // {
        //   id: 2,
        //   position: "Frontend Developer",
        //   resume_id: "2",
        //   resume_file_name: "resume (2).pdf",
        //   score: "65",
        //   totalTime: "10:32",
        //   status: "Completed",
        //   createdAt: "Aug 2",
        // },
        // {
        //   id: 3,
        //   position: "Backend Developer",
        //   resume_id: "3",
        //   resume_file_name: "resume (3).pdf",
        //   score: "50",
        //   totalTime: "8:12",
        //   status: "Completed",
        //   createdAt: "Aug 3",
        // },
        // {
        //   id: 4,
        //   position: "Data Analyst",
        //   resume_id: "4",
        //   resume_file_name: "resume (4).pdf",
        //   score: "72",
        //   totalTime: "15:21",
        //   status: "Completed",
        //   createdAt: "Aug 4",
        // },
        // {
        //   id: 5,
        //   position: "Machine Learning Engineer",
        //   resume_id: "5",
        //   resume_file_name: "resume (5).pdf",
        //   score: "88",
        //   totalTime: "18:05",
        //   status: "Completed",
        //   createdAt: "Aug 5",
        // },
        // {
        //   id: 6,
        //   position: "UI/UX Designer",
        //   resume_id: "6",
        //   resume_file_name: "resume (6).pdf",
        //   score: "40",
        //   totalTime: "7:45",
        //   status: "Completed",
        //   createdAt: "Aug 6",
        // },
        // {
        //   id: 7,
        //   position: "DevOps Engineer",
        //   resume_id: "7",
        //   resume_file_name: "resume (7).pdf",
        //   score: "91",
        //   totalTime: "16:40",
        //   status: "Completed",
        //   createdAt: "Aug 7",
        // },
        // {
        //   id: 8,
        //   position: "Product Manager",
        //   resume_id: "8",
        //   resume_file_name: "resume (8).pdf",
        //   score: "82",
        //   totalTime: "20:10",
        //   status: "Completed",
        //   createdAt: "Aug 8",
        // },
        // {
        //   id: 9,
        //   position: "QA Engineer",
        //   resume_id: "9",
        //   resume_file_name: "resume (9).pdf",
        //   score: "55",
        //   totalTime: "11:18",
        //   status: "Completed",
        //   createdAt: "Aug 9",
        // },
        // {
        //   id: 10,
        //   position: "System Architect",
        //   resume_id: "10",
        //   resume_file_name: "resume (10).pdf",
        //   score: "94",
        //   totalTime: "22:00",
        //   status: "Completed",
        //   createdAt: "Aug 10",
        // },
        // {
        //   id: 11,
        //   position: "Database Administrator",
        //   resume_id: "11",
        //   resume_file_name: "resume (11).pdf",
        //   score: "63",
        //   totalTime: "14:55",
        //   status: "Completed",
        //   createdAt: "Aug 11",
        // },
        // {
        //   id: 12,
        //   position: "Security Engineer",
        //   resume_id: "12",
        //   resume_file_name: "resume (12).pdf",
        //   score: "85",
        //   totalTime: "19:45",
        //   status: "Completed",
        //   createdAt: "Aug 12",
        // },
        // {
        //   id: 13,
        //   position: "Mobile Developer",
        //   resume_id: "13",
        //   resume_file_name: "resume (13).pdf",
        //   score: "77",
        //   totalTime: "12:20",
        //   status: "Completed",
        //   createdAt: "Aug 13",
        // },
        // {
        //   id: 14,
        //   position: "Cloud Engineer",
        //   resume_id: "14",
        //   resume_file_name: "resume (14).pdf",
        //   score: "68",
        //   totalTime: "13:30",
        //   status: "Completed",
        //   createdAt: "Aug 14",
        // },
        // {
        //   id: 15,
        //   position: "Business Analyst",
        //   resume_id: "15",
        //   resume_file_name: "resume (15).pdf",
        //   score: "59",
        //   totalTime: "9:05",
        //   status: "Completed",
        //   createdAt: "Aug 15",
        // },
        // {
        //   id: 16,
        //   position: "AI Researcher",
        //   resume_id: "16",
        //   resume_file_name: "resume (16).pdf",
        //   score: "96",
        //   totalTime: "25:15",
        //   status: "Completed",
        //   createdAt: "Aug 16",
        // },
        // {
        //   id: 17,
        //   position: "Software Engineer Intern",
        //   resume_id: "17",
        //   resume_file_name: "resume (17).pdf",
        //   score: "45",
        //   totalTime: "6:55",
        //   status: "Completed",
        //   createdAt: "Aug 17",
        // },
        // {
        //   id: 18,
        //   position: "Technical Writer",
        //   resume_id: "18",
        //   resume_file_name: "resume (18).pdf",
        //   score: "62",
        //   totalTime: "10:40",
        //   status: "Completed",
        //   createdAt: "Aug 18",
        // },
        // {
        //   id: 19,
        //   position: "Support Engineer",
        //   resume_id: "19",
        //   resume_file_name: "resume (19).pdf",
        //   score: "54",
        //   totalTime: "8:30",
        //   status: "Completed",
        //   createdAt: "Aug 19",
        // },
        // {
        //   id: 20,
        //   position: "Solutions Engineer",
        //   resume_id: "20",
        //   resume_file_name: "resume (20).pdf",
        //   score: "81",
        //   totalTime: "17:22",
        //   status: "Completed",
        //   createdAt: "Aug 20",
        // },
      ];
      

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
                            {interviews.map((interview) => (
                                <RecordingRow 
                                    key={interview.id}
                                    interview={interview}
                                    onDownloadResume={handleDownloadResume}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ContentLayout>
    );
};

export default RecordingListPage;