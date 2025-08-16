import React, { useState, useEffect, createContext, useContext } from 'react';
import LoadingSpinner from '../common/Spinner';
import EventEmitter from 'eventemitter3';
import SignOutPopup from '../common/SignOutPopup';

const dialogEvent = new EventEmitter();


interface AppContextType {
    showSpinner: () => void;
    hideSpinner: () => void;
    showSignOutPopup: () => void;
    hideSignOutPopup: () => void;
}

const defaultContextValue: AppContextType = {
    showSpinner: () => { },
    hideSpinner: () => { },
    showSignOutPopup: () => { },
    hideSignOutPopup: () => { },
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const showSpinner = () => {
    dialogEvent.emit('show_spinner');
};

export const hideSpinner = () => {
    dialogEvent.emit('hide_spinner');
};

export const showSignOutPopup = () => {
    dialogEvent.emit('show_sign_out_popup');
};

export const hideSignOutPopup = () => {
    dialogEvent.emit('hide_sign_out_popup');
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [spinnerVisible, setSpinnerVisible] = useState(false);
    const [signOutPopupVisible, setSignOutPopupVisible] = useState(false);
    
    useEffect(() => {

        const showSpinnerHandler = () => {
            setSpinnerVisible(true);
        };
        const hideSpinnerHandler = () => {
            setSpinnerVisible(false);
        };

        const showSignOutPopupHandler = () => {
            setSignOutPopupVisible(true);
        };
        const hideSignOutPopupHandler = () => {
            setSignOutPopupVisible(false);
        };

        dialogEvent.on('show_spinner', showSpinnerHandler);
        dialogEvent.on('hide_spinner', hideSpinnerHandler);
        dialogEvent.on('show_sign_out_popup', showSignOutPopupHandler);
        dialogEvent.on('hide_sign_out_popup', hideSignOutPopupHandler);

        return () => {
            dialogEvent.off('show_spinner', showSpinnerHandler);
            dialogEvent.off('hide_spinner', hideSpinnerHandler);
            dialogEvent.off('show_sign_out_popup', showSignOutPopupHandler);
            dialogEvent.off('hide_sign_out_popup', hideSignOutPopupHandler);
        };
    }, []);

    return (
        <AppContext.Provider
            value={{
                showSpinner,
                hideSpinner,
                showSignOutPopup,
                hideSignOutPopup,
            }}
        >
            {children}
            {spinnerVisible && <LoadingSpinner isVisible={spinnerVisible} />}
            {signOutPopupVisible && <SignOutPopup isVisible={signOutPopupVisible} />}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
