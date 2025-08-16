import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import { AppRoutes, store, Font, ContextProvider, AppProvider } from './index';

function App() {
  return (
    <Provider store={store}>
      <ContextProvider>
        <AppProvider>
          <Router>
            <div style={{ fontFamily: Font.Regular }} >
              <AppRoutes/>
            </div>
          </Router>
        </AppProvider>
      </ContextProvider>
    </Provider>
  );
}

export default App;