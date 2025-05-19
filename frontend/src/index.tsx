import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './common/state/store';
import { Provider } from 'react-redux';

if (typeof window !== "undefined") {
  const ResizeObserverLoopError = "ResizeObserver loop limit exceeded";

  const stopErrorPropagation = (e: Event) => {
    if (e instanceof ErrorEvent && e.message.includes(ResizeObserverLoopError)) {
      e.stopImmediatePropagation();
    }
  };

  window.addEventListener("error", stopErrorPropagation);

  const originalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class extends originalResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      super((entries, observer) => {
        requestAnimationFrame(() => {
          try {
            callback(entries, observer);
          } catch (error) {
            if ((error as Error).message.includes(ResizeObserverLoopError)) {
              return;
            }
            throw error;
          }
        });
      });
    }
  };
}

const originalConsoleError = console.error;

console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("ResizeObserver loop limit exceeded")) {
    return;
  }
  originalConsoleError(...args);
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
