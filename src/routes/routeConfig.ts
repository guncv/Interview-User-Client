import SignInPage from '../features/SignInPage';
import ForgotPasswordPage from '../features/ForgotPasswordPage';
import SetInitPasswordPage from '../features/SetInitPassword';

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
  { path: '/set-init-password', component: SetInitPasswordPage, exact: true},
];