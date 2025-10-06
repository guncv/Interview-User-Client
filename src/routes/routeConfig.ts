import SignInPage from '../features/SignInPage';
import OAuthCallbackPage from '../features/OAuthCallbackPage';
import RecordingListPage from '../features/RecordingListPage';
import CreateInterviewPage from '../features/CreateInterviewPage';
import InterviewSimulation from '../features/InterviewSimulation';
import InterviewEvaluationPage from '../features/InterviewEvaluationPage';

interface ComponentProps {
  title: string;
  isActive: boolean;
}
export interface RouteConfig {
  routes?: any;
  path: string;
  component: React.FC<ComponentProps>;
  exact: boolean;
}

export const routes: RouteConfig[]= [
  { path: '/', component: SignInPage, exact: true },
  { path: '/auth/google/callback', component: OAuthCallbackPage, exact: true },
  { path: '/recordings', component: RecordingListPage, exact: true},
  { path: '/create-interview', component: CreateInterviewPage, exact: true},
  { path: '/interview', component: InterviewSimulation, exact: true},
  { path: '/evaluation/:sessionId', component: InterviewEvaluationPage, exact: true}, 
];