import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import settings from "./settings";

const socialTags = ({
  url,
  type,
  title,
  description,
  image,
  createdAt,
  updatedAt,
}) => {
  const metaTags = [
    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:site",
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter,
    },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:creator",
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter,
    },
    { name: "twitter:image:src", content: image },

    { name: "og:title", content: title },
    {
      name: "og:type",
      content: type,
    },
    // {
    //   name: 'og:url',
    //   content: url,
    // },
    { name: "og:image", content: image },
    { name: "og:description", content: description },
    {
      name: "og:site_name",
      content: settings && settings.meta && settings.meta.title,
    },
    {
      name: "og:published_time",
      content: createdAt || new Date().toISOString(),
    },
    {
      name: "og:modified_time",
      content: updatedAt || new Date().toISOString(),
    },
  ];

  return metaTags;
};

const SEO = (props) => {
  const { title, description, keywords } = props;
  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1  maximum-scale=1, user-scalable=0"
      />
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* <meta itemProp='name' content={title} />
      <meta itemProp='description' content={description} />
      <meta itemProp='image' content={image} /> */}
      <meta name="keywords" content={keywords} />

      <link rel="icon" href="/favicon.ico" />
      {socialTags(props).map(({ name, content }) => {
        return <meta key={name} name={name} content={content} />;
      })}

      <meta
        name="facebook-domain-verification"
        content="fyd7gegj7ir3hmtz92y9v11pd5tthj"
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '493918372596859');
          fbq('track', 'PageView');`,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=493918372596859&ev=PageView&noscript=1"
          />`,
        }}
      />
    </Head>
  );
};

SEO.defaultProps = {
  url: settings && settings.meta && settings.meta.url,
  type: settings && settings.meta && settings.meta.type,
  title: settings && settings.meta && settings.meta.title,
  description: settings && settings.meta && settings.meta.description,
  image:
    settings &&
    settings.meta &&
    settings.meta.social &&
    settings.meta.social.graphic,
  keywords: settings && settings.meta && settings.meta.keywords,
};

SEO.propTypes = {
  url: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

export default SEO;
