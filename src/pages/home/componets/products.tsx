import React from "react";
import { Row, Col, Typography, Spin, Button } from "antd";

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  weight: number;
}

interface CategoryProductsProps {
  filteredProducts: any[];
  categoriesData: any[];
  selectedCategory: number;
  loading: boolean;
  showModal: (item: any) => void;
  priceFormatter2: (price: number) => string;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({
  filteredProducts,
  categoriesData,
  selectedCategory,
  loading,
  showModal,
  priceFormatter2,
}) => {
  const selectedCategoryTitle = categoriesData.find(
    (item: any) => item.id === selectedCategory
  )?.title;

  return (
    <Col lg={18}>
      <Typography.Title level={2}>{selectedCategoryTitle}</Typography.Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[20, 20]}>
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((item: Product) => (
              <Col xs={12} sm={12} md={8} lg={8} key={item.id}>
                <div
                  className="bg-white p-1 lg:p-3 rounded-2xl"
                  style={{
                    maxHeight: "420px",
                    minHeight: "120px",
                  }}
                >
                  <div
                    style={{
                      flex: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto rounded-2xl"
                      style={{
                        minHeight: "120px",
                        objectFit: "cover",
                        width: "100%",
                        height: "220px",
                      }}
                    />
                  </div>

                  <Typography.Title
                    level={3}
                    style={{
                      margin: "0px",
                      marginTop: "5px",
                    }}
                    className="mt-10"
                  >
                    {priceFormatter2(item.price)}₽
                  </Typography.Title>
                  <Typography.Title
                    level={5}
                    style={{
                      margin: "0px",
                    }}
                  >
                    {item.title}
                  </Typography.Title>
                  <Typography.Title level={5} style={{ color: "#B1B1B1" }}>
                    {item.weight}Г
                  </Typography.Title>
                  <Button
                    onClick={() => showModal(item)}
                    type="text"
                    className="bg-[#F2F2F3] w-full rounded-lg py-4"
                  >
                    Добавить
                  </Button>
                </div>
              </Col>
            ))
          ) : (
            <Col span={24} className="text-center">
              <Typography.Title level={4}>
                Afsuski ma'lumot yoq!
              </Typography.Title>
            </Col>
          )}
        </Row>
      )}
    </Col>
  );
};

export default CategoryProducts;
