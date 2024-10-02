import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import LoginPage from "./pages/login";
import { Provider } from "react-redux";
import { store } from "./store";
import { ErrorBoundarayContainer } from "./pages/Additions/ErorrBoundry/erorrboundy";
import { NotFound } from "./pages/Additions/NotFound/notFound";

function App() {
  return (
    <ErrorBoundarayContainer>
      <Provider store={store}>
        <BrowserRouter>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#FFAB08",
              },
            }}
          >
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/Home" element={<HomePage />} />
            </Routes>
          </ConfigProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundarayContainer>
  );
}

export default App;
