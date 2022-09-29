import cls from "./Products.module.scss";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

import { useRestaurant } from "services";
import { useGetUser } from "hooks/useGetUser";
import useGeolocation from "hooks/useGeolocation";
// components

import ProductsComponent from "components/UI/Products/Products";

export function Products() {
  const { t, lang } = useTranslation("common");
  const user = useGetUser();
  const location = useGeolocation();
  const router = useRouter();

  const { regionId } = useSelector((state) => state.common);

  const { newProducts } = useRestaurant({
    newProductsParams: {
      region_id: regionId,
      lat: user?.address?.location?.lat || location.lat,
      long: user?.address?.location?.long || location.long,
    },
  });
  const data = newProducts?.data?.new_pro_get_all.find(
    (item) => item.id === router.query.id
  );

  return (
    <main className={cls.main}>
      <Container className={cls.container}>
        <ProductsComponent
          products={data?.products}
          isLoading={newProducts.isLoading}
          title={data && data?.name[lang]}
        />
      </Container>
    </main>
  );
}
