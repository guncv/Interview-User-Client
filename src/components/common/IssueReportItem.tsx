import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import type { UserIssueReport } from '../../interface/reportIssueInterface';
import type { CSSProperties } from 'react';

type Props = {
    issueReport: UserIssueReport;
};

const IssueReportItem = ({ issueReport }: Props) => {
    const containerStyle: CSSProperties = {
        backgroundColor: Colors.PRIMARY_COLOR,
        border: `1px solid ${Colors.ACCENT_COLOR}`,
        borderRadius: Size.Small,
        padding: Size.Medium,
        marginBottom: Size.Small,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const headerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Size.Small,
    };

    const categoryStyle: CSSProperties = {
        fontFamily: font.Bold,
        fontSize: Size.Medium,
        color: Colors.ACCENT_COLOR,
        margin: 0,
    };

    const statusStyle: CSSProperties = {
        backgroundColor: issueReport.acknowledged ? Colors.ACCENT_COLOR : Colors.ACCENT_COLOR_LIGHT,
        color: Colors.TEXT_WHITE_COLOR,
        padding: `${Size.Small}px ${Size.Small}px`,
        borderRadius: Size.Small,
        fontSize: Size.Small,
        fontFamily: font.Medium,
    };

    const descriptionStyle: CSSProperties = {
        fontFamily: font.Regular,
        fontSize: Size.Small,
        color: Colors.TEXT_ERROR_COLOR,
        marginBottom: Size.Small,
        lineHeight: 1.5,
    };

    const metaStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: Size.Small,
        color: Colors.TEXT_ERROR_COLOR,
        fontFamily: font.Regular,
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h3 style={categoryStyle}>{issueReport.category_name}</h3>
                <span style={statusStyle}>
                    {issueReport.acknowledged ? 'Acknowledged' : 'Pending'}
                </span>
            </div>
            
            <p style={descriptionStyle}>{issueReport.description}</p>
            
            <div style={metaStyle}>
                <span>Created: {formatDate(issueReport.created_at)}</span>
                {issueReport.comment_count > 0 && (
                    <span>{issueReport.comment_count} comment{issueReport.comment_count > 1 ? 's' : ''}</span>
                )}
                {issueReport.is_editable && (
                    <span style={{ color: Colors.ACCENT_COLOR }}>Editable</span>
                )}
            </div>
        </div>
    );
};

export default IssueReportItem;