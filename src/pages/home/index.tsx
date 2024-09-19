import {
  Button,
  Col,
  Dropdown,
  Form,
  Image,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { css } from "@emotion/react";
import { SmileOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import Footer from "./componets/footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/store";
import { categoriesApi, OrdersApi, productsApi } from "../../api";
import { setProducts } from "../../store/slice/productsSlice";
import { Product } from "@src/types";
import { setOrders } from "../../store/slice/orderSlice";
import { setCategories } from "@src/store/slice/categoriesSlice";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const productsData = useSelector(
    (store: RootState) => store.products.products
  );
  const categoriesData = useSelector(
    (store: RootState) => store.categories.categories
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [selectedCategory, setSelectedCategory] = useState<any>(1);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [RadioType, setRadio] = useState("Доставка");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [basket, setBasket] = useState<any>([]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadCategories();
  }, [dispatch]);
  const loadProducts = async () => {
    try {
      const data = await productsApi();
      dispatch(setProducts(data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const loadCategories = async () => {
    try {
      const data = await categoriesApi();
      dispatch(setCategories(data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("Buyurtmalarni yuklashda xatolik yuz berdi.");
    }
  };
  const loadOrders = async () => {
    try {
      const data = await OrdersApi.getOrders();
      dispatch(setOrders(data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("Buyurtmalarni yuklashda xatolik yuz berdi.");
    }
  };

  useEffect(() => {
    const filtered = productsData?.filter(
      (product: any) => product.categoriesId === selectedCategory
    );
    setFilteredProducts(filtered);
  }, [selectedCategory, productsData]);

  const handleChange = (value: string) => {
    setSelectedCategory(value);
  };

  const getUserName = () => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );

    if (loggedInUser && loggedInUser.name) {
      return loggedInUser.name;
    }

    return "Foydalanuvchi";
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };
  const userName = getUserName();
  const items = useMemo(
    () => [
      {
        label: `Акаунт: ${getUserName()}`,
        key: "0",
      },
      {
        label: "Настройки",
        key: "1",
      },
      {
        label: "Chiqish",
        key: "2",
        onClick: handleLogout,
      },
    ],
    [userName, navigate]
  );
  const showModal = (product: Product) => {
    setIsModalOpen(true);
    setSelectedProduct(product);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setQuantity(1);
  };

  // dastafka
  const showModal1 = () => {
    setIsModalOpen1(true);
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const handleSave1 = async (values: any) => {
    const orderData = {
      deliveryType: RadioType, // yetkazib berish turi
      address: RadioType === "Доставка" ? values.address : undefined, // manzil, agar yetkazib berish bo'lsa
      floor: RadioType === "Доставка" ? values.floor : undefined, // qavat, agar yetkazib berish bo'lsa
      intercom: RadioType === "Доставка" ? values.intercom : undefined, // domofon, agar yetkazib berish bo'lsa
      products: basket, // savatdagi mahsulotlar
      total: calculateTotal(), // jami summa
    };

    try {
      await OrdersApi.createOrder(orderData);
      //@ts-ignore
      dispatch(setOrders(orderData)); // Orderlarni yangilash
      setBasket([]); // Savatni tozalash
      setQuantity(1); // Miqdorni qaytarish
      handleCancel1(); // Modalni yopish
      message.success("Buyurtma muvaffaqiyatli qabul qilindi!");
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const handleDeliveryChange = (e: any) => {
    setRadio(e.target.value);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const addToCart = () => {
    const existingItem = basket.find(
      (item: Product) => item.id === selectedProduct?.id
    );
    if (existingItem) {
      //@ts-ignore
      BasketIncrement(selectedProduct?.id, existingItem.quantity + quantity);
    } else {
      setBasket([
        ...basket,
        {
          ...selectedProduct,
          quantity,
        },
      ]);
    }
    setQuantity(1);
    handleCancel();
  };
  const BasketIncrement = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setBasket((prevBasket: any) =>
        prevBasket.filter((item: any) => item.id !== productId)
      );
    } else {
      setBasket((prevBasket: any) =>
        prevBasket.map((item: any) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return basket.reduce(
      (total: number, item: Product) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <>
      <div style={{ backgroundColor: "#f6f5f5", paddingBottom: "10px" }}>
        <div
          style={{
            background: "url('/ellipse.svg')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
          className="flex flex-col items-center py-7"
        >
          <header className="container flex justify-between px-10">
            <img src={"/logo.svg"} alt="" />
            <div>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <Button type="text">
                  <CgProfile size={20} color="white" />
                </Button>
              </Dropdown>
            </div>
          </header>

          <div className="my-10">
            <Row gutter={0}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <img
                  src="/pic.png"
                  alt=""
                  style={{ minHeight: "50px", maxHeight: "400px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <div className="pt-14 ms-5 w-full">
                  <Typography.Title
                    level={1}
                    css={css`
                      font-family: sans-serif, "Nonito";
                      font-weight: 700 !important;
                      color: white !important;
                    `}
                  >
                    Только самые <br />
                    <span className="text-secondary">сочные бургеры!</span>
                  </Typography.Title>
                  <Typography className="text-white mt-10">
                    Бесплатная доставка от 599₽
                  </Typography>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <SegmentedStyled>
            <div className="min-w-full">
              <Segmented
                options={categoriesData.map((category: any) => ({
                  label: (
                    <span>
                      <SmileOutlined /> {category.title}
                    </span>
                  ),
                  value: category.id,
                  className:
                    "block min-w-[120px] bg-white hover:!bg-white !rounded-2xl",
                }))}
                style={{
                  padding: "0px 70px",
                  marginTop: 20,
                }}
                onChange={handleChange}
                value={selectedCategory}
                css={css`
                  .ant-segmented-item-selected,
                  .ant-segmented-item:hover {
                    background: #ffab08 !important;
                  }
                `}
              />
            </div>
          </SegmentedStyled>
        </div>
        <div className="my-10 mx-auto px-0 lg:px-5 ">
          {/* Korzinka s */}
          <Row
            gutter={[20, 20]}
            className="lg:px-8 px-5"
            style={{ overflow: "hidden", margin: 0 }}
          >
            <Col lg={6} className="pt-14">
              <div className="bg-white rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <div>
                    <Typography.Title level={4}>Корзина</Typography.Title>
                  </div>
                  <div>
                    <Button type="text" className="bg-[#F2F2F3]">
                      {basket.length}
                    </Button>
                  </div>
                </div>
                {/* adsdad  */}
                {basket.length === 0 ? (
                  <Typography.Title level={5}>
                    Тут пока пусто :({" "}
                  </Typography.Title>
                ) : (
                  basket.map((item: Product) => (
                    <>
                      <hr />
                      <div className="flex gap-2 mt-5" key={item.id}>
                        <div className="w-22">
                          <Image
                            src={item.image}
                            alt=""
                            style={{
                              width: "80px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "10px ",
                            }}
                          />
                        </div>
                        <div className="flex justify-between w-56">
                          <div>
                            <Typography style={{ margin: 0, fontWeight: 500 }}>
                              {item.title}
                            </Typography>
                            <Typography style={{ color: "#B1B1B1" }}>
                              {item.weight} Г
                            </Typography>
                            <Typography className="font-bold mt-1">
                              {item.price}₽
                            </Typography>
                          </div>

                          <div className="flex mt-5 bg-[#F2F2F3] h-9 items-center rounded-xl">
                            <Button
                              type="text"
                              onClick={() =>
                                BasketIncrement(item.id, item.quantity - 1)
                              }
                            >
                              -
                            </Button>
                            <Typography>{item.quantity}</Typography>
                            <Button
                              type="text"
                              onClick={
                                () =>
                                  BasketIncrement(item.id, item.quantity + 1) // Increment quantity
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                )}
                {basket.length > 0 && (
                  <>
                    <hr className="my-3" />
                    <div className="flex justify-between px-2 items-start font-bold">
                      <Typography>Итого</Typography>
                      <Typography>{calculateTotal()}₽</Typography>
                    </div>
                    <div className="px-1">
                      <Button
                        className="w-full mt-2 bg-[#FF7020] text-white rounded-xl py-5"
                        type="text"
                        onClick={showModal1}
                      >
                        Оформить заказ
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-2 px-2">
                      <img
                        src="https://cdn-icons-png.freepik.com/512/2362/2362252.png"
                        alt=""
                        style={{ width: "20px" }}
                      />
                      <Typography>Бесплатная доставка</Typography>
                    </div>
                  </>
                )}
              </div>
            </Col>

            {/* Buyurmatlar  */}
            <Col lg={18}>
              <Typography.Title level={2}>
                {
                  categoriesData.find(
                    (item: any) => item.id === selectedCategory
                    //@ts-ignore
                  )?.title
                }
              </Typography.Title>

              {loading ? (
                <Spin size="large" />
              ) : (
                <Row gutter={[20, 20]}>
                  {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((item: any) => (
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
                            {item.price}₽
                          </Typography.Title>
                          <Typography.Title
                            level={5}
                            style={{
                              margin: "0px",
                            }}
                          >
                            {item.title}
                          </Typography.Title>
                          <Typography.Title
                            level={5}
                            style={{ color: "#B1B1B1" }}
                          >
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
                        Afsuski ma'lumot yoq !
                      </Typography.Title>
                    </Col>
                  )}
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
      {/* zakaz modal  */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        {selectedProduct && (
          <>
            <Typography.Title level={2}>
              {selectedProduct.title}
            </Typography.Title>
            <div className="flex gap-4">
              <div className="w-full ">
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
                  {selectedProduct.desc || "Описание продукта"}
                </Typography.Title>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Состав:
                </Typography.Title>
                {selectedProduct.compound?.map((sostav: string) => (
                  <Typography
                    style={{ margin: 0, fontWeight: 500 }}
                    key={sostav}
                  >
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
                    {selectedProduct.price}₽
                  </Typography.Title>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* dastafka modal  */}
      <Modal
        open={isModalOpen1}
        onCancel={handleCancel1}
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
        <div className="flex ">
          <div
            className="w-full bg-[#FFAB08] flex justify-center items-center "
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
            <Form layout="vertical" onFinish={handleSave1}>
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
                      {
                        required: true,
                        message: "Please input your address!",
                      },
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
