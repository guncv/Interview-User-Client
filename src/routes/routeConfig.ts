import SignInPage from '../features/SignInPage';
import ForgotPasswordPage from '../features/ForgotPasswordPage';
import SignUpPage from '../features/SignUpPage';
import VerifyEmail from '../features/VerifyEmail';
import ResetPassword from '../features/ResetPassword';

interface ComponentProps {
  title: string;
  isActive: boolean;
}
export interface RouteConfig {
  path: string;
  component: React.FC<ComponentProps>
  exact: boolean;
} 

export const routes: RouteConfig[]= [
  { path: '/', component: SignInPage, exact: true },
  { path: '/forgot-password', component: ForgotPasswordPage, exact: true },
  { path: '/sign-up', component: SignUpPage, exact: true},
  { path: '/verify-email', component: VerifyEmail, exact: true},
  { path: '/reset-password', component: ResetPassword, exact: true},
];