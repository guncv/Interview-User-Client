import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { resumeReducer } from './resumeReducer';
import { interviewReducer } from './interviewReducer';
import { issueReportReducer } from './issueReportReducer';
import { reviewCommentReducer } from './reviewCommentReducer';

const rootReducer = combineReducers({
    user: userReducer,
    resume: resumeReducer,
    interview: interviewReducer,
    issueReport: issueReportReducer,
    reviewComment: reviewCommentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
