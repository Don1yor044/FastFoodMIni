import {
  Button,
  Col,
  Dropdown,
  Image,
  message,
  Row,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Footer from "./componets/footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/store";
import { categoriesApi, KoriznkaApi, productsApi } from "../../api";
import { setProducts } from "../../store/slice/productsSlice";
import { Product } from "@src/types";
import { setCategories } from "@src/store/slice/categoriesSlice";
import { useNavigate } from "react-router-dom";
import ProductModal from "./componets/ordersModal";
import DeliveryModal from "./componets/dastafkaModal";
import { setKorzinka } from "@src/store/slice/korzinkaSlice";
import { Bounce } from "react-awesome-reveal";
import { priceFormatter2 } from "../Additions/PriceFormat";
import CategoryProducts from "./componets/products";

export const HomePage = () => {
  const productsData = useSelector(
    (store: RootState) => store.products.products
  );
  const categoriesData = useSelector(
    (store: RootState) => store.categories.categories
  );
  const korzinkaData = useSelector(
    (store: RootState) => store.korzinka.korzinka
  );
  // console.log(korzinkaData, "00");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [selectedCategory, setSelectedCategory] = useState<any>("Burgers");
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [RadioType, setRadio] = useState("Доставка");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const getUserId = () => {
    if (loggedInUser && loggedInUser.userId) {
      return loggedInUser.userId;
    }

    return "Foydalanuvchi";
  };
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const loadProducts = async () => {
    return await productsApi();
  };

  const loadCategories = async () => {
    return await categoriesApi();
  };

  const loadKorzinka = async (userId: string) => {
    const korzinka = await KoriznkaApi.getKorzinka(userId);
    // console.log(korzinka, "Korzinka API natijasi");
    return korzinka;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const products = await loadProducts();
        const categories = await loadCategories();
        const korzinka = await loadKorzinka(loggedInUser?.userId || "");

        dispatch(setProducts(products));
        dispatch(setCategories(categories));
        dispatch(setKorzinka(korzinka));
      } catch (error) {
        console.error(error);
        message.error("Ma'lumotlarni yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, loggedInUser.userId]);

  useEffect(() => {
    const filtered = productsData?.filter(
      (product: any) => product.category === selectedCategory
    );
    setFilteredProducts(filtered);
  }, [selectedCategory, productsData]);

  const handleChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };
  const items = useMemo(
    () => [
      {
        label: `Акаунт: ${getUserId()}`,
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
    [getUserId(), navigate]
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
    console.log(values);
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
  const addToCart = async () => {
    if (!loggedInUser) {
      message.warning("Logindan oting!");
      navigate("/login");
      return;
    }

    console.log(korzinkaData, "111");

    const existingCart = korzinkaData?.find(
      (item: any) => item.userId == loggedInUser?.userId
    );

    // Yangi mahsulot ob'ekti
    const newProduct = {
      product: {
        id: selectedProduct?.id,
        image: selectedProduct?.image,
        title: selectedProduct?.title,
        price: selectedProduct?.price,
        weight: selectedProduct?.weight,
        calories: selectedProduct?.calories,
        description: selectedProduct?.description,
        compound: selectedProduct?.compound || [],
        category: selectedProduct?.category,
      },
      quantity,
      price: selectedProduct.price * quantity,
    };

    if (existingCart) {
      // Mahsulot mavjudligini tekshirish
      const existingProduct = existingCart.items.find(
        (product: any) => product.product.id === selectedProduct?.id
      );

      if (existingProduct) {
        // Mahsulot mavjud bo'lsa, miqdorini oshirish
        existingProduct.quantity += quantity; // Miqdorni oshirish
        existingProduct.price =
          existingProduct.product.price * existingProduct.quantity; // Yangilangan narx

        const updatedItems = existingCart.items.map((product: any) =>
          product.product.id === existingProduct.product.id
            ? existingProduct
            : product
        );

        const updatedCart = {
          id: existingCart.id,
          userId: loggedInUser.userId,
          items: updatedItems,
          count: updatedItems.length,
          total: updatedItems.reduce(
            (acc: number, curr: any) => acc + curr.price,
            0
          ),
        };

        try {
          const response = await KoriznkaApi.updateKorzinka(
            existingCart.id,
            updatedCart
          );
          dispatch(
            setKorzinka(
              korzinkaData.map((item: any) =>
                item.id === existingCart.id
                  ? { ...item, items: response.items }
                  : item
              )
            )
          );
          message.success("Mahsulot savatga qo'shildi!");
        } catch (error) {
          message.error("Savatga qo'shishda xatolik yuz berdi.");
        }
      } else {
        // Yangi mahsulotni mavjud savatga qo'shish
        const updatedCart = {
          ...existingCart,
          items: [...existingCart.items, newProduct],
          count: existingCart.items.length + 1,
          total: existingCart.total + newProduct.price,
        };

        try {
          const response = await KoriznkaApi.updateKorzinka(
            existingCart.id,
            updatedCart
          );
          dispatch(
            setKorzinka(
              korzinkaData.map((item: any) =>
                item.id === existingCart.id
                  ? { ...item, items: response.items }
                  : item
              )
            )
          );
          message.success("Mahsulot savatga qo'shildi!");
        } catch (error) {
          message.error("Savatga qo'shishda xatolik yuz berdi.");
        }
      }
    } else {
      // Yangi savat yaratish
      const newCart = {
        userId: loggedInUser.userId,
        items: [newProduct],
        count: 1,
        total: newProduct.price,
        id: korzinkaData.length + 1,
      };

      try {
        const response = await KoriznkaApi.createKorzinka(newCart);
        dispatch(setKorzinka([...korzinkaData, response]));
        message.success("Mahsulot savatga qo'shildi!");
      } catch (error) {
        message.error("Savatga qo'shishda xatolik yuz berdi.");
      }
    }

    setQuantity(1); // Miqdorni 1 ga qaytarish
    handleCancel();
  };

  const deleteKorzinka = async (userId: string, productId: string) => {
    try {
      const existingCart = korzinkaData.find(
        (item: any) => item.userId === userId
      );

      if (existingCart) {
        //@ts-ignore
        const updatedProducts = existingCart.product.filter(
          (product: any) => product.id !== productId
        );

        // API orqali mahsulotni o'chirish
        //@ts-ignore
        await KoriznkaApi.updateKorzinka(existingCart.id, {
          //@ts-ignore
          userId: existingCart.userId,
          product: updatedProducts,
        });

        // Redux state dan mahsulotni olib tashlash
        dispatch(
          setKorzinka(
            korzinkaData.map((item: any) =>
              //@ts-ignore
              item.id === existingCart.id
                ? { ...item, product: updatedProducts }
                : item
            )
          )
        );
      }
    } catch (error) {
      console.error("Mahsulotni o'chirishda xatolik:", error);
    }
  };

  const BasketIncrement = async (
    userId: string,
    productId: string,
    newQuantity: number
  ) => {
    const existingCart = korzinkaData.find(
      (item: any) => item.userId === userId
    );

    if (existingCart) {
      //@ts-ignore
      const existingProduct = existingCart.product.find(
        (product: any) => product.id === productId
      );

      if (newQuantity < 1) {
        await deleteKorzinka(userId, productId); // Mahsulotni o'chirish
      } else if (existingProduct) {
        try {
          // Mahsulotni yangilash
          const updatedItem = await KoriznkaApi.updateKorzinka(
            //@ts-ignore
            existingCart.id,
            {
              //@ts-ignore
              userId: existingCart.userId,
              //@ts-ignore
              product: existingCart.product.map((product: any) =>
                product.id === productId
                  ? { ...product, quantity: newQuantity }
                  : product
              ),
            }
          );

          dispatch(
            setKorzinka(
              korzinkaData.map((item: any) =>
                //@ts-ignore
                item.id === existingCart.id
                  ? { ...item, product: updatedItem.product }
                  : item
              )
            )
          );
        } catch (error) {
          console.error("Mahsulotni yangilashda xatolik:", error);
        }
      }
    }
  };

  // const filterKorzinka = korzinkaData?.find(
  //   (item: any) => item.userId === loggedInUser.userId
  // );
  // console.log(filterKorzinka, "Filterlangan Korzinka Ma'lumotlari");
  // console.log(korzinkaData, "doniyor11");

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
                <Bounce triggerOnce>
                  <img
                    src="/pic.png"
                    alt=""
                    style={{ minHeight: "50px", maxHeight: "400px" }}
                  />
                </Bounce>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Bounce delay={200} triggerOnce>
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
                </Bounce>
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
                      {0}
                    </Button>
                  </div>
                </div>
                {/* adsdad  */}
                {korzinkaData.userId === loggedInUser.userId ? (
                  korzinkaData.items?.length > 0 ? (
                    korzinkaData.items.map((product: any) => (
                      <div className="flex gap-2" key={product.product.id}>
                        <div className="w-22">
                          <Image
                            src={product.product.image}
                            alt={product.product.title}
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
                              {product.product.title}
                            </Typography>
                            <Typography style={{ color: "#B1B1B1" }}>
                              {product.product.weight} Г
                            </Typography>
                            <Typography className="font-bold mt-1">
                              {priceFormatter2(product.price)}₽
                            </Typography>
                          </div>

                          <div className="flex mt-5 bg-[#F2F2F3] h-9 items-center rounded-xl">
                            <Button
                              type="text"
                              onClick={() =>
                                BasketIncrement(
                                  korzinkaData.userId,
                                  product.product.id,
                                  product.quantity - 1
                                )
                              }
                            >
                              -
                            </Button>
                            <Typography>{product.quantity}</Typography>
                            <Button
                              type="text"
                              onClick={() =>
                                BasketIncrement(
                                  korzinkaData.userId,
                                  product.product.id,
                                  product.quantity + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography>Товаров нет</Typography> // Товарлар yo'q, agar items bo'lmasa
                  )
                ) : (
                  <Typography>Товаров нет</Typography> // Agar userId teng bo'lmasa, shunda ham "Товаров нет" chiqariladi
                )}

                {korzinkaData?.length > 0 && (
                  <>
                    <hr className="my-3" />
                    <div className="flex justify-between px-2 items-start font-bold">
                      <Typography>Итого</Typography>
                      <Typography>
                        {priceFormatter2(
                          korzinkaData
                            ?.filter(
                              (item: any) => item.userId === loggedInUser.userId
                            )
                            .reduce(
                              (acc: number, currentItem: any) =>
                                acc +
                                currentItem.items.reduce(
                                  (total: number, product: any) =>
                                    total + product.price * product.quantity,
                                  0
                                ),
                              0
                            )
                        )}
                        ₽
                      </Typography>
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
            <CategoryProducts
              filteredProducts={filteredProducts}
              categoriesData={categoriesData}
              selectedCategory={selectedCategory}
              loading={loading}
              showModal={showModal}
              priceFormatter2={priceFormatter2}
            />
          </Row>
        </div>
      </div>
      <Footer />
      {/* zakaz modal  */}
      <ProductModal
        isModalOpen={isModalOpen}
        selectedProduct={selectedProduct}
        handleCancel={handleCancel}
        addToCart={addToCart}
        quantity={quantity}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
      />

      {/* dastafka modal  */}
      <DeliveryModal
        isModalOpen={isModalOpen1}
        handleCancel={handleCancel1}
        handleSave={handleSave1}
        handleDeliveryChange={handleDeliveryChange}
        RadioType={RadioType}
      />
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
