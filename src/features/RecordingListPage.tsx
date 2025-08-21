import ContentLayout from "../components/layout/ContentLayout";
import type { CSSProperties } from "react";
import { PrimaryButton } from "../components/common/PrimaryButton";
import Colors from "../assets/styles/Color";
import Size from "../assets/styles/Size";
import font from "../assets/styles/Font";
import { useNavigate } from "react-router-dom";

const RecordingListPage = () => {
    const navigate = useNavigate();
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
    }

    const tableStyle: CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }

    const headerCellStyle: CSSProperties = {
        padding: '16px 12px',
        textAlign: 'left',
        backgroundColor: '#f8f9fa',
        borderBottom: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
        fontWeight: 'bold',
        fontSize: Size.Medium,
        color: Colors.PRIMARY_COLOR,
        cursor: 'pointer',
    }

    const dataCellStyle: CSSProperties = {
        padding: '16px 12px',
        textAlign: 'left',
        borderBottom: `1px solid #e9ecef`,
        fontSize: Size.Medium,
        color: Colors.PRIMARY_COLOR,
    }

    const scoreStyle: CSSProperties = {
        fontWeight: 'bold',
        color: Colors.PRIMARY_COLOR,
    }

    const pacingStyle: CSSProperties = {
        color: '#28a745',
        fontWeight: 'bold',
    }

    const optionsStyle: CSSProperties = {
        cursor: 'pointer',
        fontSize: '18px',
        color: Colors.SECONDARY_TEXT_COLOR,
    }

    // Sample data - replace with actual data from your API
    const interviews = [
        {
            id: 1,
            title: 'Customer Handling',
            created: 'Aug 17',
            score: '20',
            type: 'Interview',
            totalTime: '2:03',
            pacing: '120'
        }
    ];

    const handleStartNewInterviews = () => {
        navigate('/create-interview');
    }

    return (
        <ContentLayout>
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
                            <th style={headerCellStyle}>Title</th>
                            <th style={headerCellStyle}>Created</th>
                            <th style={headerCellStyle}>Score</th>
                            <th style={headerCellStyle}>Type</th>
                            <th style={headerCellStyle}>Total Time</th>
                            <th style={headerCellStyle}>Pacing</th>
                            <th style={headerCellStyle}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {interviews.map((interview) => (
                            <tr key={interview.id}>
                                <td style={dataCellStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span>{interview.title}</span>
                                    </div>
                                </td>
                                <td style={dataCellStyle}>{interview.created}</td>
                                <td style={{...dataCellStyle, ...scoreStyle}}>{interview.score}</td>
                                <td style={dataCellStyle}>{interview.type}</td>
                                <td style={dataCellStyle}>{interview.totalTime}</td>
                                <td style={{...dataCellStyle, ...pacingStyle}}>{interview.pacing}</td>
                                <td style={dataCellStyle}>
                                    <span style={optionsStyle}>⋯</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ContentLayout>
    );
};

export default RecordingListPage;