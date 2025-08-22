import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { resumeReducer } from './resumeReducer';

const rootReducer = combineReducers({
    user: userReducer,
    resume: resumeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
