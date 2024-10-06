import { Bounce } from "react-awesome-reveal";
import { CgProfile } from "react-icons/cg";
import { css } from "@emotion/react";
import { Button, Col, Dropdown, Row, Typography } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Headers = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };
  const items = useMemo(
    () => [
      {
        label: `${localStorage.getItem("username") || "Foydalanuvchi"}`,
        key: "0",
      },
      {
        label: "Buyurtmalarim",
        key: "1",
      },
      {
        label: "Chiqish",
        key: "2",
        onClick: handleLogout,
      },
    ],
    [navigate]
  );

  return (
    <>
      <div
        style={{
          background: "url('/ellipse.svg')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
        className="flex flex-col items-center py-7"
      >
        <header className="container flex justify-between px-10">
          <img src={"/logo.svg"} alt="" />
          <div>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Button type="text">
                <CgProfile size={20} color="white" />
              </Button>
            </Dropdown>
          </div>
        </header>

        <div className="my-10">
          <Row gutter={0}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Bounce triggerOnce>
                <img
                  src="/pic.png"
                  alt=""
                  style={{ minHeight: "50px", maxHeight: "400px" }}
                />
              </Bounce>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Bounce delay={200} triggerOnce>
                <div className="pt-14 ms-5 w-full">
                  <Typography.Title
                    level={1}
                    css={css`
                      font-family: sans-serif, "Nonito";
                      font-weight: 700 !important;
                      color: white !important;
                    `}
                  >
                    Только самые <br />
                    <span className="text-secondary">сочные бургеры!</span>
                  </Typography.Title>
                  <Typography className="text-white mt-10">
                    Бесплатная доставка от 599₽
                  </Typography>
                </div>
              </Bounce>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Headers;
