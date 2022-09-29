import SEO from "seo";
import CartMobile from "components/UI/CartMobile/CartMobile";
import { fetchMultipleUrls } from "services/fetchMultipleUrls";

export default function Restaurant({ shipper }) {
  return (
    <>
      <SEO />
      <CartMobile deliveryTime={shipper?.max_delivery_time} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const urls = [`shippers/${params.id}`];
  const [shipper] = await fetchMultipleUrls(urls);

  if (!shipper.is_active) {
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
