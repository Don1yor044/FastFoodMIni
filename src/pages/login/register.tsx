import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@src/store/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@src/store/authSlice";
import { useGetUsernameExistQuery } from "@src/store/user";
import { css } from "@emotion/react";

export const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const dispatch = useDispatch();
  const [userdata, setUsername] = useState("");
  const { data: userExist } = useGetUsernameExistQuery(userdata);
  const onFinish = async () => {
    const data = form.getFieldsValue();
    setUsername(data.username);

    try {
      const res = await register(data);

      if (userExist) {
        message.error("Bunday username mavjud !");
        return;
      }

      if (res && res.data) {
        if (res.data.accessToken) {
          localStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("userId", JSON.stringify(res.data.userId));
          localStorage.setItem("username", data.username);
          navigate("/");
          dispatch(
            setCredentials({
              userId: res.data.userId,
              token: res.data.accessToken,
              username: data.username,
            })
          );
        } else {
          message.error("Access token not found in response.");
        }
      } else {
        message.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error("An error occurred during registration. Please try again.");
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
          className="bg-white p-4 text-center w-full"
          style={{
            height: "500px",
            width: "500px",
            borderRadius: "10px 10px 10px 10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div className="mt-5">
            <Typography.Title level={2}>Register</Typography.Title>
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              initialValues={{
                fullname: "",
                username: "",
                phone: "",
                password: "",
              }}
              style={{ width: "100%" }}
            >
              <Row gutter={16}>
                <Col span={22} offset={1}>
                  <Form.Item
                    name="fullname"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name",
                      },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="Fullname" css={inputStyle} />
                  </Form.Item>
                </Col>

                <Col span={22} offset={1}>
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: "Please enter your username" },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="Username" css={inputStyle} />
                  </Form.Item>
                </Col>

                <Col span={22} offset={1}>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Please enter your password" },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <Input.Password placeholder="Password" css={inputStyle} />
                  </Form.Item>
                </Col>

                <Col span={22} offset={1}>
                  <Form.Item
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="+998 91 123 45 67" css={inputStyle} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item>
                    <Button
                      className="rounded-2xl px-16 bg-[#FFAB08] text-white mt-10 text-center"
                      type="primary"
                      htmlType="submit"
                    >
                      Register
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <div className="absolute bottom-2 right-8">
              <Button
                type="link"
                onClick={() => navigate("/login")}
                style={{ padding: 0, color: "#FFAB08" }}
              >
                Login
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Image
            src="https://png.pngtree.com/png-clipart/20231003/original/pngtree-tasty-burger-png-ai-generative-png-image_13245897.png"
            alt="register illustration"
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
