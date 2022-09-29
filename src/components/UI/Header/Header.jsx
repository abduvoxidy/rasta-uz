import { Container } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Header.module.scss";
import Input from "components/UI/Forms/Input";
import { ProfileIcon, SearchIcon, CartIcon } from "components/UI/Icons";
import AddAddress from "components/UI/Address/AddAddress";
import Headroom from "react-headroom";
import GreyButton from "../Buttons/GreyButton";
import GreenButton from "../Buttons/GreenButton";
import { useGetUser } from "hooks/useGetUser";
import ProfilePopup from "./ProfilePopup";
import { useDispatch, useSelector } from "react-redux";
import numberToPrice from "utils/numberToPrice";
import { totalPriceProducts } from "store/cart/cartSlice";
import SearchPopup from "./SearchPopup";
import { useEffect, useRef, useState } from "react";
import { useProduct, useRestaurant } from "services";
import useGeolocation from "hooks/useGeolocation";
import useDebounce from "hooks/useDebounce";
import useOnClickOutside from "hooks/useOnClickOutside";
import { setUnavailableShipper } from "store/common/commonSlice";
import { MobileHeader } from "./MobileHeader";
import Language from "./Language";

export function Header() {
  const router = useRouter();
  const { cartItems } = useSelector((state) => state.cart);
  const totalPrice = totalPriceProducts();
  const location = useGeolocation();
  const user = useGetUser();
  const { regionId, menuId, branchId } = useSelector((state) => state.common);
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);
  const ref = useRef();
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("common");

  const dispatch = useDispatch();
  const { searchedProducts, products } = useProduct({
    searchParams: {
      region_id: regionId,
      lat: user?.address?.location?.lat || location.lat,
      long: user?.address?.location?.long || location.long,
      search: debouncedSearchTerm,
    },
    searchMutationProps: {
      onSuccess: () => {
        setModalOpen(true);
      },
    },
    productsParams: {
      search: debouncedSearchTerm,
      menu_id: menuId,
      shipper_id: router?.query?.id,
      branch_id: branchId,
    },
  });

  useEffect(() => {
    setSearch("");
  }, [router.pathname]);

  useEffect(() => {
    if (
      products.data &&
      products.data.products &&
      products.data.products.length > 0
    ) {
      setModalOpen(true);
    }
  }, [products.data]);

  const { restaurant } = useRestaurant({
    restaurantMutationProps: {
      onSuccess: (res) => {
        if (res.is_active) {
          router.push(`/restaurant/${res.id}`);
        } else {
          dispatch(setUnavailableShipper(true));
        }
      },
    },
  });
  useOnClickOutside(ref, () => setModalOpen(false));
  useEffect(() => {
    if (router.pathname !== "/restaurant/[id]") {
      if (debouncedSearchTerm) {
        searchedProducts.mutate();
      } else {
        setModalOpen(false);
      }
    }
  }, [debouncedSearchTerm]);

  const goToRestaurant = (shipperId) => {
    restaurant.mutate(shipperId);
    //console.log('shipper=>', shipper)
  };

  return (
    <Headroom>
      <header className={styles.header}>
        <Container className={styles.container}>
          <div className={styles.box}>
            <div className={styles.searchBox}>
              <Link href="/">
                <a className={styles.logo}>
                  <img src="/logos/rasta_web.svg" />
                </a>
              </Link>
              <div className={styles.searchForm}>
                <Input
                  placeholder={t("start your search for dishes or restaurants")}
                  startAdornment={<SearchIcon />}
                  className={styles.search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  isLoading={searchedProducts.isLoading || products.isLoading}
                  clearFn={() => setSearch("")}
                  isClear={Boolean(search)}
                  onClick={() => {
                    if (searchedProducts.data) {
                      setModalOpen(true);
                    }
                  }}
                />
                {!searchedProducts.isLoading && isModalOpen && search && (
                  <SearchPopup
                    modalRef={ref}
                    searchedProducts={searchedProducts.data}
                    value={search}
                    products={products?.data?.products}
                    onlyProducts={router.pathname === "/restaurant/[id]"}
                    closeModal={() => {
                      setModalOpen(false);
                      setSearch("");
                    }}
                  />
                )}
              </div>
              <AddAddress />
            </div>

            <div className={styles.buttons}>
              {user && cartItems.length > 0 && (
                <GreenButton
                  onClick={() => {
                    goToRestaurant(cartItems[0].shipper_id);
                  }}
                  icon={<CartIcon />}
                  size="medium"
                >
                  {numberToPrice(totalPrice, t("soum"))}
                </GreenButton>
              )}
              {user ? (
                <ProfilePopup />
              ) : (
                <GreyButton
                  icon={<ProfileIcon />}
                  onClick={() => router.push("/login")}
                  size="medium"
                >
                  {t("come_in")}
                </GreyButton>
              )}
            </div>
          </div>
          <Language />
        </Container>
      </header>
      {typeof window !== "undefined" && window.innerWidth < 736 && (
        <MobileHeader />
      )}
    </Headroom>
  );
}
