import { graphql, useStaticQuery } from "gatsby";

import { type SiteMetadata } from "@/types/site-metadata";

const useSiteMetadata = () => {
  const { site } = useStaticQuery<SiteMetadata>(graphql`
    query SiteMetaData {
      site {
        siteMetadata {
          author {
            title
            photo
            description
            contacts {
              name
              contact
            }
          }
          menu {
            title
            url
          }
          url
          title
          copyright
          description
          cusdis {
            appId
            host
          }
        }
      }
    }
  `);

  return site?.siteMetadata || {};
};

export { useSiteMetadata };
