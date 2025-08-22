import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { resumeReducer } from './resumeReducer';
import { interviewReducer } from './interviewReducer';

const rootReducer = combineReducers({
    user: userReducer,
    resume: resumeReducer,
    interview: interviewReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
