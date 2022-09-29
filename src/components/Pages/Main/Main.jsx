import { useState } from "react";
import cls from "./Main.module.scss";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import useTranslation from "next-translate/useTranslation";

import { useRestaurant } from "services";
import { useGetUser } from "hooks/useGetUser";
import useGeolocation from "hooks/useGeolocation";
// components
import Banner from "components/UI/Banner/Banner";
import CategoryTabs from "components/UI/CategoryTabs/CategoryTabs";
import RestaurantList from "components/UI/RestaurantList/RestaurantList";
import ProductCollection from "components/UI/ProductCollection/ProductCollection";

export function Main() {
  const { t, lang } = useTranslation("common");
  const user = useGetUser();
  const [companyCategories, setCompanyCategories] = useState([]);
  const [time, setTime] = useState(120);
  const location = useGeolocation();
  const { regionId } = useSelector((state) => state.common);

  const { news, restaurants, restaurantsByCategories, newProducts } =
    useRestaurant({
      newsParams: {
        region_id: regionId,
        lat: user?.address?.location?.lat || location.lat,
        long: user?.address?.location?.long || location.long,
      },
      newProductsParams: {
        region_id: regionId,
        lat: user?.address?.location?.lat || location.lat,
        long: user?.address?.location?.long || location.long,
      },
      restaurantParams: {
        region_id: regionId,
        lat: user?.address?.location?.lat || location.lat,
        long: user?.address?.location?.long || location.long,
      },
      restaurantsByCategoriesParams: {
        region_id: regionId,
        lat: user?.address?.location?.lat || location.lat,
        long: user?.address?.location?.long || location.long,
        max_delivery_time: time,
        company_category_ids:
          companyCategories.length > 0
            ? companyCategories.map((item) => item.id).join(",")
            : null,
      },
    });

  const onChange = (value, minute) => {
    if (Array.isArray(value)) {
      setCompanyCategories(value);
    } else {
      const category = companyCategories.find((item) => item.id === value.id);
      if (category) {
        setCompanyCategories((prev) =>
          prev.filter((item) => item.id !== value.id)
        );
      } else {
        setCompanyCategories((prev) => [...prev, value]);
      }
    }

    if (minute) {
      setTime(minute);
    }
  };

  return (
    <main className={cls.main}>
      <Container className={cls.container}>
        <Banner />
        <CategoryTabs
          title={t("restaurants")}
          withFilter
          onChange={onChange}
          values={companyCategories}
        />

        {companyCategories.length === 0 &&
          newProducts?.data?.new_pro_get_all?.map((item) => (
            <ProductCollection
              id={item.id}
              key={item.id}
              title={item.name[lang]}
              products={item.products}
            />
          ))}
        {companyCategories.length === 0 &&
          news?.data?.news_get_all?.map((item) => (
            <RestaurantList
              isSlider
              id={item.id}
              key={item.id}
              title={item.name[lang]}
              list={item.shippers}
              isLoading={news.isLoading}
            />
          ))}

        <RestaurantList
          list={
            companyCategories.length > 0
              ? restaurantsByCategories?.data?.shippers
              : restaurants?.data?.shippers
          }
          isLoading={restaurants.isLoading || restaurantsByCategories.isLoading}
          title={t("all")}
          comlumnsCount={3}
        />
      </Container>
    </main>
  );
}
