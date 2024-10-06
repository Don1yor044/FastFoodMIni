import Title from "antd/es/typography/Title";
import { Button, Col, Typography } from "antd";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { IProduct } from "@src/pages/interface";
import { priceFormatter2 } from "@src/pages/Additions/PriceFormat";

export const Product = ({ item, index }: { item: IProduct; index: number }) => {
  const navigate = useNavigate();

  return (
    <Col
      key={index}
      xs={12}
      sm={12}
      md={8}
      lg={6}
      xl={8}
      xxl={24}
      className="px-3 py-3"
    >
      <div
        style={{
          borderRadius: "18px",
          backgroundColor: "white",
        }}
        className="px-3 py-3"
      >
        <>
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

          <Title level={3} className="mt-2 !mb-2">
            {priceFormatter2(item.price)} sum
          </Title>
          <Typography.Title
            level={5}
            className="!m-0 !mb-5"
            style={{
              maxHeight: "60px",
              overflow: "auto",
              overflowY: "hidden",
              whiteSpace: "nowrap",
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none",
            }}
          >
            {item.title}
          </Typography.Title>
          <Typography.Title level={5} className="!text-gray-400 mb-2">
            {item.weight}г
          </Typography.Title>
          <Button
            className="w-full bg-[#F2F2F3] hover:!bg-[#F2F2F3] border-0 btn-d"
            style={{ borderRadius: "12px" }}
            onClick={() => {
              navigate(
                "?" +
                  queryString.stringify({
                    add: true,
                    id: item.id,
                  })
              );
            }}
          >
            Добавить
          </Button>
        </>
      </div>
    </Col>
  );
};
