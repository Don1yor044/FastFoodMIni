import React from "react";
import { Modal, Typography, Button, Image } from "antd";
import { Product } from "@src/types";
import { priceFormatter2 } from "@src/pages/Additions/PriceFormat";

interface ProductModalProps {
  isModalOpen: boolean;
  selectedProduct: Product | null;
  handleCancel: () => void;
  addToCart: () => void;
  quantity: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isModalOpen,
  selectedProduct,
  handleCancel,
  addToCart,
  quantity,
  handleIncrement,
  handleDecrement,
}) => {
  return (
    <Modal open={isModalOpen} onCancel={handleCancel} footer={null} width={700}>
      {selectedProduct && (
        <>
          <Typography.Title level={2}>{selectedProduct.title}</Typography.Title>
          <div className="flex gap-4">
            <div className="w-full">
              <Image
                src={selectedProduct.image}
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
                {selectedProduct.description || "Описание продукта"}
              </Typography.Title>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Состав:
              </Typography.Title>
              {selectedProduct.compound?.map((sostav) => (
                <Typography style={{ margin: 0, fontWeight: 500 }} key={sostav}>
                  {sostav}
                </Typography>
              ))}
              <Typography style={{ margin: 0, fontWeight: 500 }}>
                {selectedProduct.weight || "520г"}, ккал
              </Typography>
            </div>
          </div>
          <div className="flex gap-4 mt-3">
            <div className="w-full">
              <Button
                type="text"
                className="bg-[#FF7020] text-white w-full py-5 rounded-xl"
                onClick={addToCart}
              >
                Добавить
              </Button>
            </div>
            <div className="w-full flex items-start justify-between">
              <div className="flex bg-[#F2F2F3] items-center rounded-xl h-10">
                <Button type="text" onClick={handleDecrement}>
                  -
                </Button>
                <Typography>{quantity}</Typography>
                <Button type="text" onClick={handleIncrement}>
                  +
                </Button>
              </div>
              <div>
                <Typography.Title level={2}>
                  {priceFormatter2(selectedProduct.price)}₽
                </Typography.Title>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ProductModal;
