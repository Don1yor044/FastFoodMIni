import React from "react";
import { Modal, Typography, Form, Input, Radio, Button } from "antd";
import { css } from "@emotion/react";

interface DeliveryModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleSave: (values: any) => void;
  handleDeliveryChange: (e: any) => void;
  RadioType: string;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({
  isModalOpen,
  handleCancel,
  handleSave,
  handleDeliveryChange,
  RadioType,
}) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={700}
      bodyStyle={{ minHeight: "420px" }}
      style={{ padding: 0 }}
      css={css`
        .ant-modal-content {
          padding: 0px !important;
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
            src={"/bulichka.svg"}
            alt=""
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
          <div>
            <Typography.Title level={3}>Доставка</Typography.Title>
          </div>
          <Form layout="vertical" onFinish={handleSave}>
            <Form.Item>
              <Radio.Group
                onChange={handleDeliveryChange}
                value={RadioType}
                options={[
                  { label: "Самовывоз", value: "Самовывоз" },
                  { label: "Доставка", value: "Доставка" },
                ]}
                buttonStyle="solid"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  marginTop: 10,
                }}
              />
            </Form.Item>

            {RadioType === "Доставка" && (
              <>
                <Form.Item
                  style={{ margin: 0 }}
                  name="address"
                  rules={[
                    { required: true, message: "Please input your address!" },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Улица, дом, квартира"
                    className="rounded-xl p-2 px-3"
                  />
                </Form.Item>
                <div className="flex mt-2 gap-3">
                  <Form.Item style={{ margin: 0 }} name="floor">
                    <Input
                      type="text"
                      placeholder="Этаж"
                      className="rounded-xl p-2 px-3"
                    />
                  </Form.Item>
                  <Form.Item style={{ margin: 0 }} name="intercom">
                    <Input
                      type="text"
                      placeholder="Домофон"
                      className="rounded-xl p-2 px-3"
                    />
                  </Form.Item>
                </div>
              </>
            )}
            <Button
              htmlType="submit"
              type="text"
              className="w-80 my-5 bg-[#FF7020] text-white py-5 rounded-xl"
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

export default DeliveryModal;
