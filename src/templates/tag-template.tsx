import React, { type FC } from "react";
import { graphql } from "gatsby";

import { Feed } from "@/components/feed";
import { Meta } from "@/components/meta";
import { Page } from "@/components/page";
import { Layout } from "@/components/layout";
import { Sidebar } from "@/components/sidebar";
import { useSiteMetadata } from "@/hooks/use-site-metadata";
import { type PageContext } from "@/types/page-context";
import { type AllMarkdownRemark } from "@/types/all-markdown-remark";

interface TagTemplateProps {
  data: {
    allMarkdownRemark: AllMarkdownRemark;
  };
  pageContext: PageContext;
}

const TagTemplate: FC<TagTemplateProps> = ({ data, pageContext }) => {
  const { group } = pageContext;
  const { edges } = data.allMarkdownRemark;

  return (
    <Layout>
      <Sidebar />
      <Page title={group}>
        <Feed edges={edges} />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query TagTemplate($group: String) {
    allMarkdownRemark(
      filter: {
        frontmatter: {
          tags: { in: [$group] }
          template: { eq: "post" }
          draft: { ne: true }
        }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
            slug
          }
        }
      }
    }
  }
`;

export const Head: FC<TagTemplateProps> = ({ pageContext }) => {
  const { title, description } = useSiteMetadata();

  const { group } = pageContext;
  return <Meta title={`${group} - ${title}`} description={description} />;
};

export default TagTemplate;
