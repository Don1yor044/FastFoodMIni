import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Row,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@src/store/auth";
import { setCredentials } from "@src/store/authSlice";
import { useDispatch } from "react-redux";
import { css } from "@emotion/react";

export const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login] = useLoginMutation();

  const onFinish = async () => {
    try {
      const data = form.getFieldsValue();
      if (data.username && data.password) {
        const res = await login(data);
        console.log(data);

        if (res?.error) {
          message.error("User topilmadi. Iltimos, qayta urinib ko'ring!");
        } else if (res?.data) {
          localStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("userId", JSON.stringify(res.data.userId));
          localStorage.setItem("username", data.username);
          navigate("/home");
          message.success("Hush kelibsiz !");
          dispatch(
            setCredentials({
              userId: res.data.userId,
              token: res.data.accessToken,
              username: res.data.username,
            })
          );
        }
      }
    } catch (error) {
      console.error("Login jarayonida xatolik:", error);
      message.error("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    }
  };

  return (
    <div
      className="bg-[#FFAB08] p-5"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="flex">
        <div
          className="bg-white p-4 text-center"
          style={{
            height: "500px",
            width: "500px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="mt-16">
            <Typography.Title level={2}>Login</Typography.Title>
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              style={{ width: "100%" }}
            >
              <Row gutter={16}>
                <Col span={22} offset={1}>
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: "UserName kiriting!" }]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="Name" css={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={22} offset={1}>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Parolni kiriting!" }]}
                    style={{ margin: 0 }}
                  >
                    <Input.Password placeholder="Password" css={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button
                      className="rounded-2xl px-16 bg-[#FFAB08] text-white mt-10 text-center"
                      type="primary"
                      htmlType="submit"
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div className="flex justify-between mt-10 px-5">
              <Button
                type="link"
                onClick={() => navigate("/home")}
                style={{ padding: 0, color: "#FFAB08" }}
              >
                Later
              </Button>
              <Button
                type="link"
                onClick={() => {
                  navigate("/register");
                }}
                style={{ padding: 0, color: "#FFAB08" }}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Image
            src="https://png.pngtree.com/png-clipart/20231003/original/pngtree-tasty-burger-png-ai-generative-png-image_13245897.png"
            css={css`
              object-fit: cover;
              height: 500px !important;
              width: 500px !important;
              border-radius: 0px 10px 10px 0px;
            `}
          />
        </div>
      </div>
    </div>
  );
};

const inputStyle = css`
  border: none;
  outline: none;
  border-bottom: 2px solid gray;
  border-radius: 5px 5px 0px 0px;
  box-shadow: none;
  margin-top: 30px;
  transition: border-bottom-color 0.3s ease;
  width: 100%;

  &:focus {
    border-bottom: 2px solid #ffab08;
  }
  &:hover {
    border-bottom: 2px solid #ffab08 !important;
  }
`;
