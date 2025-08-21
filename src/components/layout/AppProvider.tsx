import React, { useState, useEffect, createContext, useContext } from 'react';
import LoadingSpinner from '../common/Spinner';
import EventEmitter from 'eventemitter3';

const dialogEvent = new EventEmitter();

interface AppContextType {
    showSpinner: () => void;
    hideSpinner: () => void;
}

const defaultContextValue: AppContextType = {
    showSpinner: () => { },
    hideSpinner: () => { },
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const showSpinner = () => {
    dialogEvent.emit('show_spinner');
};

export const hideSpinner = () => {
    dialogEvent.emit('hide_spinner');
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [spinnerVisible, setSpinnerVisible] = useState(false);
    
    useEffect(() => {

        const showSpinnerHandler = () => {
            setSpinnerVisible(true);
        };
        const hideSpinnerHandler = () => {
            setSpinnerVisible(false);
        };



        dialogEvent.on('show_spinner', showSpinnerHandler);
        dialogEvent.on('hide_spinner', hideSpinnerHandler);

        return () => {
            dialogEvent.off('show_spinner', showSpinnerHandler);
            dialogEvent.off('hide_spinner', hideSpinnerHandler);
        };
    }, []);

    return (
        <AppContext.Provider
            value={{
                showSpinner,
                hideSpinner,
            }}
        >
            {children}
            {spinnerVisible && <LoadingSpinner isVisible={spinnerVisible} />}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
