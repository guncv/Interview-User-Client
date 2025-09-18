import { type CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import type { UserIssueReport } from '../../interface/reportIssueInterface';
import { MessageCircle, SquarePen, ThumbsUp } from 'lucide-react';
import { Tooltip } from './Tooltip';

type Props = {
    issueReport: UserIssueReport;
};

const IssueReportItem = ({ issueReport }: Props) => {
    const containerStyle: CSSProperties = {
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        border: `1px solid ${Colors.BORDER_COLOR}`,
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
        fontFamily: font.Medium,
        fontSize: Size.Medium,
        color: Colors.PRIMARY_COLOR,
        margin: 0,
    };


    const descriptionStyle: CSSProperties = {
        fontFamily: font.Regular,
        fontSize: Size.Small,
        textAlign: 'left',
        color: Colors.PRIMARY_COLOR,
        marginBottom: Size.Small,
        lineHeight: 1.5,
    };

    const metaStyle: CSSProperties = {
        display: 'flex',
        marginTop: Size.Medium,
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: Size.Small,
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular,
        marginLeft: Size.Medium,
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
                <Tooltip content={`Category: ${issueReport.category_name}`} position="top">
                    <h3 style={categoryStyle}>{issueReport.category_name}</h3>
                </Tooltip>
                {issueReport.is_editable && (
                    <Tooltip content="This issue can be edited" position="top">
                        <SquarePen size={20} color={Colors.SECONDARY_TEXT_COLOR} style={{ cursor: 'pointer' }} />
                    </Tooltip>
                )}
            </div>
            
            <p style={descriptionStyle}>{issueReport.description}</p>
            
            <div style={metaStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
                    <Tooltip content={issueReport.acknowledged ? "Issue acknowledged by support" : "Pending acknowledgment"} position="top">
                        <div style={{ display: 'flex', alignItems: 'center', gap: "3px" }}>
                            <ThumbsUp size={15} color={issueReport.acknowledged ? Colors.ACCENT_COLOR : Colors.DISABLED_TEXT_COLOR} />
                        </div>
                    </Tooltip>

                    <Tooltip content={`${issueReport.comment_count} comment${issueReport.comment_count !== 1 ? 's' : ''}`} position="top">
                        <div style={{ display: 'flex', alignItems: 'center', gap: "3px" }}>
                            <MessageCircle size={15}/>
                            <span>{issueReport.comment_count} comment{issueReport.comment_count > 1 ? 's' : ''}</span>
                        </div>
                    </Tooltip>
                </div>
                
                <Tooltip content={`Created: ${formatDate(issueReport.created_at)}`} position="bottom">
                    <span>{formatDate(issueReport.created_at)}</span>
                </Tooltip>
            </div>
        </div>
    );
};

export default IssueReportItem;