import { RootState } from "@src/store";
import { useCreateOrderMutation } from "@src/store/orders";
import { useSelector } from "react-redux";
import { Button, message, Typography } from "antd";
import { IProduct } from "@src/pages/interface";
import { priceFormatter2 } from "@src/pages/Additions/PriceFormat";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";

export const BasketProduct = ({
  product,
  quantity,
}: {
  product: IProduct;
  quantity: number;
}) => {
  const userId =
    useSelector((state: RootState) => state.auth.userId) ||
    (localStorage.getItem("userId")
      ? JSON.parse(localStorage.getItem("userId") || "null")
      : null) ||
    null;

  const [createOrder] = useCreateOrderMutation();

  const updateProductCount = async (reason: "APPEND" | "REMOVE") => {
    try {
      await createOrder({
        productId: product.id,
        userId,
        quantity: 1,
        reason,
      });
    } catch (error) {
      console.error("Error updating product count:", error);
    }
  };

  const deleteBasketProduct = async () => {
    try {
      await createOrder({
        productId: product.id,
        userId,
        quantity,
        reason: "REMOVE",
      });

      message.success("Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Error");
    }
  };

  return (
    <div className="flex">
      <img
        src={product.image}
        alt="product"
        style={{ borderRadius: "10px" }}
        className="w-20 h-15 object-cover"
      />
      <div className="flex items-center justify-between ms-2 w-full">
        <div>
          <Typography.Title level={5} className="!m-0">
            {" "}
            {product.title}
          </Typography.Title>
          <Typography className="text-gray-500 font-semibold">
            {product.weight}г
          </Typography>
          <Typography.Title level={5} className="!m-0">
            {priceFormatter2(product.price)} sum
          </Typography.Title>
        </div>
        <div
          className="w-20 h-8 flex items-center justify-around bg-[#F2F2F3]"
          style={{ borderRadius: "8px" }}
        >
          <Button type="text" className="p-1">
            <HiOutlineMinus
              onClick={() => {
                if (quantity > 1) {
                  updateProductCount("REMOVE");
                } else {
                  deleteBasketProduct();
                }
              }}
              style={{
                cursor: "pointer",
              }}
            />
          </Button>
          {quantity}
          <Button type="text" className="p-1">
            <HiPlus
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                updateProductCount("APPEND");
              }}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
