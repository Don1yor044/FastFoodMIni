import { Col, Result, Row, Segmented, Skeleton } from "antd";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Footer from "./HomeComponents/footer";
import { ProductsModal } from "./HomeComponents/ordersModal";
import {
  useGetProductsByCategoryQuery,
  useGetProductsQuery,
} from "../../store/products";
import { useGetCategoriesQuery } from "../../store/categories";
import { Basket } from "./HomeComponents/basket";
import { IProduct } from "../interface";
import { Product } from "./HomeComponents/product";
import { DeliveryModal } from "./HomeComponents/deliveryModal";
import { ThreeDot } from "react-loading-indicators";
import Headers from "./HomeComponents/headers";

export const HomePage = () => {
  const [category, setCategory] = useState<string>();
  const { data: products, isLoading: ProductLoading } = category
    ? useGetProductsByCategoryQuery(category)
    : useGetProductsQuery(undefined);

  const { data: categories, isLoading: CategoryLoading } =
    useGetCategoriesQuery(undefined);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategory(categories[0].title);
    }
  }, [categories]);

  const handleChange = (value: string) => {
    setCategory(value);
  };
  return (
    <>
      <div style={{ backgroundColor: "#f6f5f5", paddingBottom: "10px" }}>
        <Headers />
        <div>
          <SegmentedStyled>
            <div className="min-w-full">
              {CategoryLoading ? (
                <div
                  className="flex gap-8"
                  style={{
                    marginTop: 20,
                    padding: "0px 80px",
                  }}
                >
                  {Array.from({ length: 9 }).map((_, index) => (
                    <Skeleton.Button
                      key={index}
                      active
                      size="large"
                      style={{ width: 120, height: 38, borderRadius: 30 }}
                    />
                  ))}
                </div>
              ) : (
                <Segmented
                  options={categories?.map((category: any) => ({
                    label: (
                      <div className="flex px-4 gap-2 !items-center">
                        <img
                          src={category.icon}
                          alt=""
                          className="object-cover w-7 h-7"
                        />
                        <div>{category.title}</div>
                      </div>
                    ),
                    value: category.title,
                    className:
                      "block min-w-[120px] bg-white hover:!bg-white !rounded-2xl",
                  }))}
                  style={{
                    padding: "0px 80px",
                    marginTop: 20,
                  }}
                  value={category}
                  onChange={handleChange}
                />
              )}
            </div>
          </SegmentedStyled>
        </div>
        <div className="my-10 mx-auto px-2 lg:px-5 ">
          {/* Korzinka s */}
          <Row
            gutter={[15, 20]}
            className="lg:px-8 px-5"
            style={{ overflow: "hidden", margin: 0 }}
          >
            <Col xl={6} className="pt-5">
              <Basket />
            </Col>

            {/* Buyurmatlar  */}
            <Col xl={18}>
              {ProductLoading ? (
                <div className="ps-20">
                  <ThreeDot
                    variant="bob"
                    color="#ffab08"
                    size="medium"
                    text=""
                    textColor=""
                  />{" "}
                </div>
              ) : (
                <>
                  <Row gutter={[20, 20]}>
                    {products && products.length > 0 ? (
                      products.map((item: IProduct, index: number) => (
                        <Product key={item.id} item={item} index={index} />
                      ))
                    ) : (
                      <Col span={20} className="h-96">
                        <Result
                          title="Sorry, there are no products in this category"
                          className="p-20"
                        />
                      </Col>
                    )}
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
      {/* zakaz modal  */}
      <ProductsModal products={products} />

      {/* dastafka modal  */}
      <DeliveryModal />
    </>
  );
};

const SegmentedStyled = styled.div`
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari va Opera uchun */
  }
  -ms-overflow-style: none; /* IE va Edge uchun */
  scrollbar-width: none; /* Firefox uchun */

  .ant-segmented-item {
    border-radius: 20px;
    background-color: white;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 50px !important;
    color: black;

    &:active,
    &:focus {
      background-color: #ffab08;
    }
  }
  .ant-segmented-item-selected {
    background-color: #ffab08 !important;
    color: white;
  }
  .ant-segmented-item-label {
    padding: 5px 0px;
  }
  .ant-segmented-group {
    display: flex;
    gap: 30px;
    overflow: auto;
    max-width: 1330px;
  }
`;
