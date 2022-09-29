import { Container, Skeleton } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import RestaurantCard from "components/UI/RestaurantCard/RestaurantCard";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import cls from "./Favourite.module.scss";
import { useFavourite } from "services";
import { useGetUser } from "hooks/useGetUser";
import useGeolocation from "hooks/useGeolocation";
import { useRouter } from "next/router";
import EmptyBox from "components/UI/EmptyBox/EmptyBox";
import { useWindowWidth } from "hooks/useWindowWidth";

export default function Favourite() {
  const user = useGetUser();
  const router = useRouter();
  const location = useGeolocation();
  const windowWidth = useWindowWidth();
  const wave = windowWidth > 768 ? [1, 2, 3] : [1];
  const { t } = useTranslation("common");

  const { favourites } = useFavourite({
    favouriteParams: {
      user_id: user?.id,
      lat: user?.address?.location?.lat || location.lat,
      long: user?.address?.location?.long || location.long,
    },
  });

  return (
    <main className={cls.favourite}>
      <Container>
        <h1>{t("favorites")}</h1>
        <div className={cls.box}>
          <div className={cls.leftSide}>
            <LeftSidebar />
          </div>
          {favourites.isLoading && (
            <div className={cls.skeleton}>
              {wave.map((_, index) => (
                <div key={index}>
                  <Skeleton animation="wave" height={370} />
                </div>
              ))}
            </div>
          )}

          {favourites.isFetched && (
            <>
              {favourites?.data?.favourites?.length > 0 ? (
                <div className={cls.list}>
                  {favourites?.data?.favourites?.map((item) => (
                    <RestaurantCard
                      key={item.id}
                      item={item.shipper}
                      className={cls.item}
                    />
                  ))}
                </div>
              ) : (
                <EmptyBox
                  imgSrc="/gif/favouriteEmpty.gif"
                  imgAlt="empty favourite restaurant"
                  addText={t("add_restaurants")}
                  title={t("you dont have favorites")}
                  subTitle={t(
                    "add your favorite restaurants and all saved ones will be displayed here"
                  )}
                  fn={() => router.push("/")}
                />
              )}
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
