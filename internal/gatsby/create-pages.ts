import { type GatsbyNode } from "gatsby";

import { routes } from "./constants/routes";
import { templates } from "./constants/templates";
import { tagsQuery } from "./queries/tags-query";
import { pagesQuery } from "./queries/pages-query";
import { categoriesQuery } from "./queries/categories-query";
import { toKebabCase } from "../../src/utils/to-kebab-case";
import { concat } from "../../src/utils/concat";

const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {
  const { createPage } = actions;

  createPage({
    path: routes.notFoundRoute,
    component: templates.notFoundTemplate,
    context: {},
  });

  createPage({
    path: routes.tagsListRoute,
    component: templates.tagsTemplate,
    context: {},
  });

  createPage({
    path: routes.categoriesListRoute,
    component: templates.categoriesTemplate,
    context: {},
  });

  const pages = await pagesQuery(graphql);

  pages.forEach((edge) => {
    const { node } = edge;

    if (node?.frontmatter?.template === "page" && node?.fields?.slug) {
      createPage({
        path: node?.frontmatter?.slug || node.fields.slug,
        component: templates.pageTemplate,
        context: { slug: node.fields.slug },
      });
    } else if (node?.frontmatter?.template === "post" && node?.fields?.slug) {
      createPage({
        path: node?.frontmatter?.slug || node.fields.slug,
        component: templates.postTemplate,
        context: { slug: node.fields.slug },
      });
    }
  });

  const categories = await categoriesQuery(graphql);

  categories.forEach((category) => {
    const path = concat(routes.categoryRoute, "/", toKebabCase(category.fieldValue));

    createPage({
      component: templates.categoryTemplate,
      path,
      context: {
        group: category.fieldValue,
      },
    });
  });

  const tags = await tagsQuery(graphql);

  tags.forEach((tag) => {
    const path = concat(routes.tagRoute, "/", toKebabCase(tag.fieldValue));

    createPage({
      component: templates.tagTemplate,
      path,
      context: {
        group: tag.fieldValue,
      },
    });
  });

  createPage({
    component: templates.indexTemplate,
    path: routes.indexRoute,
    context: {},
  });
};

export { createPages };
