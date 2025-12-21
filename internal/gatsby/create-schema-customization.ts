import { type GatsbyNode } from "gatsby";

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({
  actions,
}) => {
  const { createTypes } = actions;

  // 定义Cusdis配置类型
  const typeDefs = `
    type SiteSiteMetadataCusdis {
      appId: String
      host: String
    }

    type SiteSiteMetadata {
      cusdis: SiteSiteMetadataCusdis
    }
  `;

  createTypes(typeDefs);
};