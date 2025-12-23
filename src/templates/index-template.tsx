import React, { type FC, useMemo } from "react";

import { graphql } from "gatsby";

import { Feed } from "@/components/feed";
import { Meta } from "@/components/meta";
import { Page } from "@/components/page";
import { Layout } from "@/components/layout";
import { Sidebar } from "@/components/sidebar";
import { useSiteMetadata } from "@/hooks/use-site-metadata";
import type { AllMarkdownRemark } from "@/types/all-markdown-remark";
import type { PageContext } from "@/types/page-context";

interface IndexTemplateProps {
  data: {
    allMarkdownRemark: AllMarkdownRemark;
  };
  pageContext: PageContext;
  location?: {
    search?: string;
  };
}

const IndexTemplate: FC<IndexTemplateProps> = ({ data, location }) => {
  const { edges } = data.allMarkdownRemark;

  const activeTag = useMemo(() => {
    const value = new URLSearchParams(location?.search ?? "").get("tag");
    return value && value.trim().length > 0 ? value : null;
  }, [location?.search]);

  const filteredEdges = useMemo(() => {
    if (!activeTag) return edges;
    return edges.filter((edge) => edge.node.frontmatter.tags?.includes(activeTag));
  }, [edges, activeTag]);

  return (
    <Layout>
      <Sidebar isHome activeTag={activeTag} />
      <Page title={activeTag ? `Tag: ${activeTag}` : undefined}>
        <Feed edges={filteredEdges} />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query IndexTemplate {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
    ) {
      edges {
        node {
          fields {
            categorySlug
            slug
          }
          frontmatter {
            description
            category
            title
            date
            slug
            tags
          }
        }
      }
    }
  }
`;

export const Head: FC<IndexTemplateProps> = ({ location }) => {
  const { title, description } = useSiteMetadata();
  const activeTag = new URLSearchParams(location?.search ?? "").get("tag");
  const pageTitle =
    activeTag && activeTag.trim().length > 0 ? `Tag: ${activeTag} - ${title}` : title;

  return <Meta title={pageTitle} description={description} />;
};

export default IndexTemplate;
