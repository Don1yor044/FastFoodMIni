import { css } from "@emotion/react";
import {
  Button,
  Form,
  Input,
  message,
  Typography,
  Image,
  Col,
  Row,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleFinish = (values: any) => {
    const { name, phone, password } = values;

    if (isRegister) {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      const newUserId = `${existingUsers.length + 1}`;
      const userData = { id: newUserId, name, phone, password };

      existingUsers.push(userData);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Saqlashdan so'ng, yangi foydalanuvchini `loggedInUser` sifatida saqlash
      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      message.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      form.resetFields();
      navigate("/home");
    } else {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const user = existingUsers.find(
        (u: any) => u.name === name && u.password === password
      );
      if (user) {
        // Foydalanuvchi muvaffaqiyatli kirsa, foydalanuvchini `loggedInUser` sifatida saqlash
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        navigate("/home");
      } else {
        message.error("Malumotni tekshirib Boshqatdan urinib ko'ring.");
        form.resetFields();
      }
    }
  };

  const handleFinishFailed = () => {
    message.error("Iltimos, barcha maydonlarni to'ldiring.");
  };

  return (
    <div
      className="bg-[#FFAB08] p-5 "
      style={{
        height: "100vh",
        display: "flex ",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="flex ">
        <div
          className="bg-white p-4 text-center w-full "
          style={{
            height: "500px",
            width: "500px ",
            borderRadius: "10px 10px 10px 10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="mt-16">
            <Typography.Title level={2}>
              {isRegister ? "Register" : "Login"}
            </Typography.Title>
            <Form
              form={form}
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
              layout="vertical"
              initialValues={{ name: "", phone: "", password: "" }}
              style={{ width: "100%" }}
            >
              <Row gutter={16}>
                <Col span={22} offset={1}>
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Name kiriting!" }]}
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
                {isRegister && (
                  <Col span={22} offset={1}>
                    <Form.Item
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Telefon raqamini kiriting!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Phone Number"
                        type="number"
                        css={inputStyle}
                      />
                    </Form.Item>
                  </Col>
                )}

                <Col span={24}>
                  <Form.Item>
                    <Button
                      className="rounded-2xl px-16 bg-[#FFAB08] text-white mt-10 text-center"
                      type="primary"
                      htmlType="submit"
                    >
                      {isRegister ? "Register" : "Login"}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            {isRegister ? (
              <></>
            ) : (
              <div className="flex justify-between mt-10 px-5">
                <Button
                  type="link"
                  onClick={() => navigate("/home")}
                  style={{ padding: 0, color: "#FFAB08" }}
                >
                  Keyinroq o'tish ?
                </Button>
                <Button
                  type="link"
                  onClick={() => setIsRegister(!isRegister)}
                  style={{ padding: 0, color: "#FFAB08" }}
                >
                  {isRegister ? "Login" : "Register"}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <Image
            src="https://png.pngtree.com/png-clipart/20231003/original/pngtree-tasty-burger-png-ai-generative-png-image_13245897.png"
            css={css`
              object-fit: cover;
              height: 500px !important;
              width: 600px !important;
              border-radius: 0px 10px 10px 0px;
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
