import SEO from "seo";
import BlockPost from "components/Pages/BlockPost/BlockPost";
import { fetchMultipleUrls } from "services/fetchMultipleUrls";

export default function BlockPostPage({ banner }) {
  return (
    <>
      <SEO />
      <BlockPost banner={banner} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const urls = [`banner/${params.id}`];
  const [banner] = await fetchMultipleUrls(urls);

  if (!banner.active) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      banner,
    },
  };
}
