import { graphql, useStaticQuery } from "gatsby";

interface TagsQueryResult {
  allMarkdownRemark: {
    group: Array<{
      fieldValue: string;
      totalCount: number;
    }>;
  };
}

const useTagsList = () => {
  const result = useStaticQuery<TagsQueryResult>(graphql`
    query TagsListQuery {
      allMarkdownRemark(
        filter: {
          frontmatter: { template: { eq: "post" }, draft: { ne: true } }
        }
      ) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
          totalCount
        }
      }
    }
  `);

  return result?.allMarkdownRemark?.group ?? [];
};

export { useTagsList };
