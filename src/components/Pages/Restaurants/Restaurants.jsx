import cls from "./Restaurants.module.scss";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

import { useRestaurant } from "services";
import { useGetUser } from "hooks/useGetUser";
import useGeolocation from "hooks/useGeolocation";
// components

import RestaurantList from "components/UI/RestaurantList/RestaurantList";

export function Restaurants() {
  const { t, lang } = useTranslation("common");
  const user = useGetUser();
  const location = useGeolocation();
  const router = useRouter();

  const { regionId } = useSelector((state) => state.common);

  const { news } = useRestaurant({
    newsParams: {
      region_id: regionId,
      lat: user?.address?.location?.lat || location.lat,
      long: user?.address?.location?.long || location.long,
    },
  });
  const data = news?.data?.news_get_all.find(
    (item) => item.id === router.query.id
  );

  return (
    <main className={cls.main}>
      <Container className={cls.container}>
        <RestaurantList
          list={data?.shippers}
          isLoading={news.isLoading}
          title={data && data?.name[lang]}
          comlumnsCount={1}
        />
      </Container>
    </main>
  );
}
