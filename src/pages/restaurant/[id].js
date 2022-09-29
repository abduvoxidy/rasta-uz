import RestaurantPage from "components/Pages/Restaurant/Restaurant";
import SEO from "seo";
import { fetchMultipleUrls } from "services/fetchMultipleUrls";

export default function Restaurant({ shipper }) {
  return (
    <>
      <SEO />
      <RestaurantPage shipper={shipper} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const urls = [`shippers/${params.id}`];
  const [shipper] = await fetchMultipleUrls(urls);

  if (!shipper?.is_active) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      shipper,
    },
  };
}
