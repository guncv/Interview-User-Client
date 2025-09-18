import { ContentLayout, PrimaryButton, IssueReportItem } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { listIssueReportsAction } from "../index";
import { useEffect, type CSSProperties } from "react";
import type { RootState } from "../reducers/rootReducer";
import type { UserIssueReport } from "../interface/reportIssueInterface";
import Colors from "../assets/styles/Color";
import Size from "../assets/styles/Size";
import font from "../assets/styles/Font";
import EmptyStateImage from "../assets/images/no_data.png";

const IssueReportPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listIssueReportsAction());
    }, [dispatch]);

    const { listIssueReports } = useSelector((state: RootState) => state.issueReport);

    const handleCreateIssueReport = () => {
        console.log('Create issue report clicked');
    };

    const headerStyle: CSSProperties = {
        fontSize: Size.Large,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    };


    const buttonContainerStyle: CSSProperties = {
        alignSelf: 'end',
        marginBottom: Size.Large,
    };

    const listContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Medium,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: Size.Small,
        scrollbarWidth: 'thin',
    };

    const emptyStateStyle: CSSProperties = {
        textAlign: 'center',
        padding: Size.ExtraLarge,
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular,
        fontSize: Size.LargeMedium,
    };

    const containerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        padding: Size.Large,
        textAlign: 'center',
        width: '50%',
        height: '100vh',
    };

    return (
        <ContentLayout>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <div>Your Issue Reports</div>
                    <div style={buttonContainerStyle}>
                        <PrimaryButton
                            label="Create Issue Report"
                            onClick={handleCreateIssueReport}
                        />
                    </div>
                </div>

                {listIssueReports.data.length > 0 ? (
                    <div style={listContainerStyle}>
                        {listIssueReports.data.map((issueReport: UserIssueReport) => (
                            <IssueReportItem
                                key={issueReport.id}
                                issueReport={issueReport}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={emptyStateStyle}>
                        <img src={EmptyStateImage} alt="No issue reports found"
                            style={{ width: '200px', height: '200px' }}
                        />
                        <div>No issue reports found</div>
                        <div style={{ marginTop: Size.Small, fontSize: Size.Medium }}>
                            Click "Create Issue Report" to submit your first report
                        </div>
                    </div>
                )}
            </div>
        </ContentLayout>
    );
};

export default IssueReportPage;