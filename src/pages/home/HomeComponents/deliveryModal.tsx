import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Radio,
  type RadioChangeEvent,
  Space,
  Spin,
} from "antd";
import Title from "antd/es/typography/Title";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@src/store";
import { useGetUserByIdQuery } from "@src/store/user";
import { useConfirmOrderMutation, useGetOrdersQuery } from "@src/store/orders";
import { css } from "@emotion/react";

export const DeliveryModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("?" + queryString.stringify({}));
  };

  const userId =
    useSelector((state: RootState) => state.auth.userId) ||
    (localStorage.getItem("userId")
      ? JSON.parse(localStorage.getItem("userId") || "null")
      : null) ||
    null;

  const { data: user, isLoading: userLoading } = useGetUserByIdQuery(userId);

  const { data: basket, isLoading: basketLoading } = useGetOrdersQuery(
    userId as string
  );

  const [confirmOrder] = useConfirmOrderMutation();

  const [form] = Form.useForm();
  const [dostavka, setDostavka] = useState<string>("DELIVERY");

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        type: "DELIVERY",
        fullname: user.fullname,
        phone: user.phone,
      });
    }
  }, [form, user]);

  const params = queryString.parse(location.search, {
    parseNumbers: true,
    parseBooleans: true,
  });

  const onRadioChange = (e: RadioChangeEvent) => {
    form.setFieldsValue({
      type: e.target.value,
    });
    setDostavka(e.target.value);
  };

  const onFinish = () => {
    const res = form.getFieldsValue();
    const data = {
      orderId: basket.id,
      fullname: res.fullname,
      phone: res.phone,
      type: res.type,
      address: {
        street: res.street || " ",
        apartmentNumber: res.apartmentNumber || " ",
        buildingNumber: res.buildingNumber || " ",
        intercom: res.intercom || " ",
      },
    };

    try {
      confirmOrder(data);
      handleClose();
      message.success("Order sent successfully");
    } catch (error) {
      console.error(error);
      message.error("Error");
    }
  };

  if (userLoading || basketLoading) return <Spin />;

  return (
    <Modal
      open={Boolean(params.submit)}
      footer={null}
      onCancel={handleClose}
      width={700}
      bodyStyle={{ minHeight: "420px", padding: 0 }}
      style={{ borderRadius: "20px" }}
      className="custom-modal"
      css={css`
        .ant-modal-content {
          padding: 0 !important;
          border-radius: 20px;
        }
      `}
    >
      <div className="flex">
        <div
          className="w-full bg-[#FFAB08] flex justify-center items-center"
          style={{ borderRadius: "20px 0px 0px 20px", height: "421px" }}
        >
          <img
            src="/bulichka.svg"
            alt="image"
            style={{
              width: "50%",
              height: "300px",
              objectFit: "contain",
              borderRadius: "20px",
            }}
          />
        </div>
        <div
          className="w-full pt-5 bg-slate-100 px-5"
          style={{ borderRadius: "0px 20px 20px 0px", position: "relative" }}
        >
          <Title level={3}>Доставка</Title>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="fullname">
              <Input placeholder="Ваше имя" />
            </Form.Item>
            <Form.Item name="phone">
              <Input placeholder="Телефон" />
            </Form.Item>
            <Form.Item name="type">
              <Radio.Group onChange={onRadioChange} value={dostavka}>
                <Space direction="vertical">
                  <Radio value="PICKUP">Самовывоз</Radio>
                  <Radio value="DELIVERY">Доставка</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            {dostavka === "DELIVERY" && (
              <>
                <div className="flex gap-2">
                  <Form.Item
                    name="street"
                    rules={[
                      { required: true, message: "Kocha nomini toldiring" },
                    ]}
                  >
                    <Input placeholder="Улица" />
                  </Form.Item>
                  <Form.Item
                    name="apartmentNumber"
                    rules={[
                      { required: true, message: "Kvartira nomini toldiring" },
                    ]}
                  >
                    <Input placeholder="Квартира" />
                  </Form.Item>
                </div>
                <div className="flex gap-2">
                  <Form.Item name="buildingNumber" className="w-[50%]">
                    <Input placeholder="Здание" />
                  </Form.Item>
                  <Form.Item name="intercom">
                    <Input placeholder="Домофон" />
                  </Form.Item>
                </div>
              </>
            )}
            <Button
              htmlType="submit"
              type="text"
              className="w-80 my-5 bg-[#FF7020] text-white py-5 rounded-xl "
              style={{
                position: "absolute",
                bottom: 0,
              }}
            >
              Оформить
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
