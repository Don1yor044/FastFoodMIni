import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import LoginPage from "./pages/login";
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
  return (
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/Home" element={<HomePage />} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
