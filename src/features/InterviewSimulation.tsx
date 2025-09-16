import { useSearchParams } from "react-router-dom";
import ContentLayout from "../components/layout/ContentLayout";
import ChatHistory from "../components/common/ChatHistory";

const InterviewSimulation = () => {
    const [searchParams] = useSearchParams();
    const sessionTokenParam = searchParams.get('session_token');
    
    return (
        <ContentLayout>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '40%', height: '100%' }}>
                    <ChatHistory />
                </div>
                
                <div style={{ width: '60%', height: '100%' }}>
                    {sessionTokenParam && <p>Query param 'session_token': {sessionTokenParam}</p>}
                </div>
            </div>
        </ContentLayout>
    );
};

export default InterviewSimulation;