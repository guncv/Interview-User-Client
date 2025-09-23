import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { resumeReducer } from './resumeReducer';
import { interviewReducer } from './interviewReducer';
import { issueReportReducer } from './issueReportReducer';
import { reviewCommentReducer } from './reviewCommentReducer';
import { evaluationReducer } from './evaluationReducer';

const rootReducer = combineReducers({
    user: userReducer,
    resume: resumeReducer,
    interview: interviewReducer,
    issueReport: issueReportReducer,
    reviewComment: reviewCommentReducer,
    evaluation: evaluationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
