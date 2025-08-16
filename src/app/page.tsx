"use client";
import SignInPage from "../features/SignInPage";
import { ContextProvider } from "../components/layout/ContextProvider";
import { AppProvider } from "../components/layout/AppProvider";
import { Provider } from "react-redux";
import store from "../store/store";

export default function Home() {
  return (
    <Provider store={store}>
      <ContextProvider>
        <AppProvider>
          <SignInPage />
        </AppProvider>
      </ContextProvider>
    </Provider>
  );
}
