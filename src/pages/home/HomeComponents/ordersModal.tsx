import Title from "antd/es/typography/Title";
import { Button, Modal, Typography } from "antd";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCreateOrderMutation } from "@src/store/orders";
import { useSelector } from "react-redux";
import { RootState } from "@src/store";
import { IProduct } from "@src/pages/interface";
import { priceFormatter2 } from "@src/pages/Additions/PriceFormat";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";

export const ProductsModal = ({ products }: { products: IProduct[] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("?" + queryString.stringify({}));
  };

  const [count, setCount] = useState<number>(1);
  const userId =
    useSelector((state: RootState) => state.auth.userId) ||
    (localStorage.getItem("userId")
      ? JSON.parse(localStorage.getItem("userId") || "null")
      : null) ||
    null;

  const [createOrder] = useCreateOrderMutation();

  const params = queryString.parse(location.search, {
    parseNumbers: true,
    parseBooleans: true,
  });

  const onFinish = (item: IProduct) => {
    if (localStorage.getItem("token")) {
      createOrder({
        userId: userId as string,
        productId: item.id,
        quantity: count,
        reason: "APPEND",
      });
      setCount(1);
      handleClose();
    } else {
      navigate("/login");
    }
  };

  return (
    <Modal
      footer={null}
      open={Boolean(params.add)}
      onCancel={handleClose}
      width={700}
      className="custom-modal md:rounded-3xl"
    >
      {(() => {
        const item = products?.find((item) => item.id === params.id);
        return item ? (
          <>
            <Title level={2} className="modal-title text-center">
              {item.title}
            </Title>
            <div className="flex gap-4">
              <div className="w-full">
                <img
                  src={item.image}
                  alt="product image"
                  style={{
                    width: "400px",
                    height: "270px",
                    objectFit: "cover",
                    borderRadius: "20px",
                  }}
                />
              </div>
              <div
                className="w-full"
                style={{
                  height: "280px",
                  overflow: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <Typography.Title level={5}>
                  {item.description || "Описание продукта"}
                </Typography.Title>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Состав:
                </Typography.Title>

                {item.compound?.map((sostav: string, index: number) => (
                  <Typography
                    key={index}
                    style={{ margin: 0, fontWeight: 500 }}
                  >
                    {sostav}
                  </Typography>
                ))}
                <Typography style={{ margin: 0, fontWeight: 500 }}>
                  {item.weight || "520г"} Г, ккал {item.calories}
                </Typography>
              </div>
            </div>
            <div className="flex gap-4 mt-3">
              <div className="w-full">
                <Button
                  type="primary"
                  className="bg-[#FF7020] text-white w-full py-5 rounded-xl"
                  onClick={() => {
                    onFinish(item);
                  }}
                >
                  Добавить
                </Button>
              </div>
              <div className="w-full flex items-center justify-between">
                <div className="flex bg-[#F2F2F3] items-center rounded-xl h-10">
                  <Button type="text" className="p-3">
                    <HiOutlineMinus
                      onClick={() => {
                        if (count > 1) setCount(count - 1);
                      }}
                      style={{
                        fontSize: "16px",

                        cursor: "pointer",
                      }}
                    />
                  </Button>
                  <Typography.Title level={5} className="mt-2">
                    {count}
                  </Typography.Title>
                  <Button type="text" className="p-3">
                    <HiPlus
                      onClick={() => setCount(count + 1)}
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </Button>
                </div>
                <div>
                  <Typography.Title level={2} style={{ margin: 0 }}>
                    {priceFormatter2(item.price * count)} сум
                  </Typography.Title>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>No product found</div>
        );
      })()}
    </Modal>
  );
};
