"use client";
import SetInitPasswordPage from "../../features/SetInitPassword";
import { ContextProvider } from "../../components/layout/ContextProvider";
import { AppProvider } from "../../components/layout/AppProvider";
import { Provider } from "react-redux";
import store from "../../store/store";

export default function SetInitPassword() {
  return (
    <Provider store={store}>
      <ContextProvider>
        <AppProvider>
          <SetInitPasswordPage />
        </AppProvider>
      </ContextProvider>
    </Provider>
  );
}
