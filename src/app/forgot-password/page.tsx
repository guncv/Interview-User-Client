"use client";
import ForgotPasswordPage from "../../features/ForgotPasswordPage";
import { ContextProvider } from "../../components/layout/ContextProvider";
import { AppProvider } from "../../components/layout/AppProvider";
import { Provider } from "react-redux";
import store from "../../store/store";

export default function ForgotPassword() {
  return (
    <Provider store={store}>
      <ContextProvider>
        <AppProvider>
          <ForgotPasswordPage />
        </AppProvider>
      </ContextProvider>
    </Provider>
  );
}
