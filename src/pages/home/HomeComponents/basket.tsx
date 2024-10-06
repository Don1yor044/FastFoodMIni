import Title from "antd/es/typography/Title";
import { Button, Divider, Typography, Col } from "antd";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { useGetOrdersQuery } from "@src/store/orders";
import { useSelector } from "react-redux";
import { RootState } from "@src/store";
import { IProduct } from "@src/pages/interface";
import { BasketProduct } from "./korzinkaProduct";
import { priceFormatter2 } from "../../Additions/PriceFormat";

export const Basket = () => {
  const userId =
    useSelector((state: RootState) => state.auth.userId) ||
    (localStorage.getItem("userId")
      ? JSON.parse(localStorage.getItem("userId") || "null")
      : null) ||
    null;

  const { data: basket, isLoading: basketLoading } = useGetOrdersQuery(
    userId as string
  );

  const navigate = useNavigate();

  if (basketLoading)
    return (
      <Col lg={24}>
        <div className="bg-white rounded-lg p-3">
          <div className="flex justify-between mb-2">
            <Title level={4}>Корзина</Title>
            <div
              className="bg-[#F2F2F3] w-10 h-7 flex justify-center items-center"
              style={{ borderRadius: "10px" }}
            >
              0
            </div>
          </div>
          <Title level={5}>Тут пока пусто :(</Title>
        </div>
      </Col>
    );

  return (
    <Col lg={24}>
      <div className="bg-white rounded-lg p-3">
        <div className="flex justify-between mb-2">
          <Title level={4}>Корзина</Title>
          <div
            className="bg-[#F2F2F3] w-10 h-7 flex justify-center items-center"
            style={{ borderRadius: "6px" }}
          >
            {basket?.items?.length || 0}
          </div>
        </div>
        {basket?.items?.length ? (
          <div>
            <Divider style={{ marginBlock: "0px" }} />
            {basket.items.map(
              (b: { product: IProduct; quantity: number; price: number }) => (
                <div key={b.product.id} className="flex flex-col gap-2 mt-5">
                  <BasketProduct product={b.product} quantity={b.quantity} />
                  <Divider style={{ marginBlock: "5px" }} />
                </div>
              )
            )}
            <div className="flex justify-between items-center mb-2 font-bold">
              <p className="text-lg">Итого</p>
              <p className="text-lg">{priceFormatter2(basket.total)} sum</p>
            </div>
            <Button
              className="w-full mt-2 bg-[#FF7020] text-white rounded-xl py-5"
              type="text"
              onClick={() => {
                navigate("?" + queryString.stringify({ submit: true }));
              }}
            >
              Оформить заказ
            </Button>
            <div className="flex gap-2 mt-2">
              <img
                src="https://cdn-icons-png.freepik.com/512/2362/2362252.png"
                alt=""
                style={{ width: "20px" }}
              />
              <Typography>Бесплатная доставка</Typography>
            </div>
          </div>
        ) : (
          <Title level={5}>Тут пока пусто :(</Title>
        )}
      </div>
    </Col>
  );
};
