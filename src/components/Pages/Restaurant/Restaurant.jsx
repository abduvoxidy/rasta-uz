import { createRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import cls from "./Restaurant.module.scss";
import { Container, Grid } from "@mui/material";
import Cart from "components/UI/Cart/Cart";
import { CartIcon } from "components/UI/Icons";
import ProductList from "components/UI/ProductList/ProductList";
import ProductModal from "components/UI/ProductModal/ProductModal";
import RestaurantBanner from "components/UI/RestaurantBanner/RestaurantBanner";
import RestaurantCategory from "components/UI/RestaurantCategory/RestaurantCategory";
import RestaurantInfoModal from "components/UI/RestaurantInfoModal/RestaurantInfoModal";
//import RestaurantFixedCategory from 'components/UI/RestaurantCategory/RestaurantFixedCategory'
import useGeolocation from "hooks/useGeolocation";
import { useGetUser } from "hooks/useGetUser";
import { useProduct, useBranch, useCategory } from "services";
import { setBranchId, setMenuId } from "store/common/commonSlice";

export default function Restaurant({ shipper }) {
  const location = useGeolocation();
  const { lang } = useTranslation("common");
  const user = useGetUser();
  const [category, setCategory] = useState(null);
  const router = useRouter();
  const ref = useRef();
  let categoriesRef = useRef([]);
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [productId, setProductId] = useState(null);
  const { regionId } = useSelector((state) => state.common);
  const { isSearch, cartItems } = useSelector((state) => state.cart);

  const totalQuantity = cartItems.reduce((total, item) => {
    return total + +item.quantity;
  }, 0);

  const dispatch = useDispatch();
  const { nearestBranch } = useBranch({
    nearesBranchParams: {
      region_id: regionId,
      shipper_id: shipper.id,
      lat: user?.address?.location?.lat || location.lat,
      long: user?.address?.location?.long || location.long,
    },
  });

  useEffect(() => {
    if (nearestBranch?.data?.branches[0]?.id) {
      dispatch(setBranchId(nearestBranch?.data?.branches[0]?.id));
      dispatch(setMenuId(nearestBranch?.data?.branches[0]?.menu_id));
    }
  }, [nearestBranch.data]);

  const { categories } = useCategory({
    categoryParamas: {
      with_product: true,
      branch_id: nearestBranch?.data?.branches[0]?.id,
      menu_id: nearestBranch?.data?.branches[0]?.menu_id,
      all: true,
    },
  });

  const { product } = useProduct({
    productId: productId,
  });

  useEffect(() => {
    if (router.query.product_id) {
      setOpen(true);
      setProductId(router.query.product_id);
    }
  }, [router.query.product_id]);

  const handleClose = () => {
    setOpen(false);
    setProductId(null);
  };

  const handleOpen = (id) => {
    setProductId(id);
    setOpen(true);
  };

  const handleOpenInfo = () => setOpenInfo(true);

  categoriesRef.current = categories?.data?.categories?.map((_) => createRef());

  const scrollToCategory = (index) => {
    // categoriesRef?.current[index]?.current?.scrollIntoView();
    window.scrollTo({
      behavior: "smooth",
      top:
        categoriesRef?.current[index]?.current?.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        100,
    });
  };

  return (
    <>
      {isSearch ? (
        <div className={cls.isSearch}></div>
      ) : (
        <div className={cls.root}>
          {/* <RestaurantFixedCategory
         categories={categories?.data?.categories}
         onChange={(item) => setCategory(item)}
         value={category}
         scrollToCategory={scrollToCategory}
       /> */}
          <div
            className={cls.cart}
            onClick={() => {
              router.push(`/cart/${router.query?.id}`);
            }}
          >
            <CartIcon />
            {totalQuantity ? <span>{totalQuantity}</span> : <></>}
          </div>
          <main className={cls.main}>
            <Container>
              <div className={cls.banner} ref={ref}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={9}>
                    <RestaurantBanner
                      branch={nearestBranch.data?.branches}
                      user={user}
                      shipper={shipper}
                      handleOpenInfo={handleOpenInfo}
                    />
                    <RestaurantCategory
                      categories={categories?.data?.categories}
                      className={cls.tabs}
                      onChange={(item) => setCategory(item)}
                      value={category}
                      scrollToCategory={scrollToCategory}
                      // elementId='slider-category'
                    />
                    {categoriesRef.current &&
                      categoriesRef.current.length > 0 &&
                      categories?.data?.categories.map((item, index) => (
                        <ProductList
                          scrollRef={categoriesRef.current[index]}
                          key={item.id}
                          title={item.name[lang]}
                          products={item.products}
                          handleOpen={handleOpen}
                        />
                      ))}
                  </Grid>
                  <Grid className={cls.rightCart} item xs={12} md={3}>
                    <Cart deliveryTime={shipper?.max_delivery_time} />
                  </Grid>
                </Grid>
              </div>
            </Container>
          </main>
          <ProductModal open={open} handleClose={handleClose} item={product} />
          {/* Restaurant info modal */}
          <RestaurantInfoModal
            openInfo={openInfo}
            setOpenInfo={setOpenInfo}
            shipper={shipper}
            branch={nearestBranch.data?.branches}
            user={user}
          />
        </div>
      )}
    </>
  );
}
