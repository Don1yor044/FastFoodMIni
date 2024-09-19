import { Col, Row, Typography } from "antd";
import { FaPhone, FaTelegramPlane, FaVk } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="p-5 px-10">
        <Row>
          <Col className="text-secondary" sm={13} md={8} lg={12}>
            <img src={"/logo2.svg"} alt="" />
          </Col>
          <Col
            className="text-secondary pt-5"
            xs={24}
            sm={12}
            offset={1}
            md={6}
            lg={5}
          >
            <Typography.Title level={4}>Номер для заказа</Typography.Title>
            <Typography.Title level={5} className="flex items-center gap-2">
              <FaPhone /> +7(930)833-38-11
            </Typography.Title>
          </Col>
          <Col
            className="text-secondary pt-5"
            xs={24}
            sm={12}
            md={6}
            offset={1}
            lg={4}
          >
            <Typography.Title level={4}>Мы в соцсетях</Typography.Title>
            <Typography.Title level={5} className="flex items-center gap-4">
              <div className="bg-[#FF7020] p-2 rounded-full">
                <a href="#">
                  <FaVk className="text-white" size={20} />
                </a>
              </div>
              <div className="bg-[#FF7020] p-2 rounded-full">
                <a href="#">
                  <FaTelegramPlane className="text-white" size={20} />
                </a>
              </div>
            </Typography.Title>
          </Col>
          <div className="flex flex-wrap ms-5 mt-5">
            <Typography className="w-full">© YouMeal, 2022</Typography>
            <Typography>Design: Anastasia Ilina</Typography>
          </div>
        </Row>
      </footer>
    </>
  );
};

export default Footer;
