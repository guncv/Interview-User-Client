import SignInPage from '../features/SignInPage';
import ForgotPasswordPage from '../features/ForgotPasswordPage';
import SignUpPage from '../features/SignUpPage';
import VerifyEmail from '../features/VerifyEmail';
import ResetPassword from '../features/ResetPassword';
import ResetPasswordSuccess from '../features/ResetPasswordSuccess';
import RecordingListPage from '../features/RecordingListPage';
import CreateInterviewPage from '../features/CreateInterviewPage';
import VADTestPage from '../features/VADTestPage';
import InterviewSimulation from '../features/InterviewSimulation';

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
  { path: '/forgot-password', component: ForgotPasswordPage, exact: true },
  { path: '/sign-up', component: SignUpPage, exact: true},
  { path: '/verify-email', component: VerifyEmail, exact: true},
  { path: '/reset-password', component: ResetPassword, exact: true},
  { path: '/reset-password-success', component: ResetPasswordSuccess, exact: true},
  { path: '/recordings', component: RecordingListPage, exact: true},
  { path: '/create-interview', component: CreateInterviewPage, exact: true},
  { path: '/interview', component: InterviewSimulation, exact: true},
  { path: '/vad-test', component: VADTestPage, exact: true},
];