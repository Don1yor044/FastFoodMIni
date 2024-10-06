import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { Provider } from "react-redux";
import { store } from "./store";
import { ErrorBoundarayContainer } from "./pages/Additions/ErorrBoundry/erorrboundy";
import { NotFound } from "./pages/Additions/NotFound/notFound";
import { RegisterPage } from "./pages/login/register";
import { LoginPage } from "./pages/login/login";

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
              <Route path="/" element={<Navigate to="/home" />} />{" "}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/home" element={<HomePage />} />
            </Routes>
          </ConfigProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundarayContainer>
  );
}

export default App;
