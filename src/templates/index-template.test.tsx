import React from "react";
import { StaticQuery, useStaticQuery } from "gatsby";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import * as mocks from "@/mocks";
import { getMeta } from "@/utils/get-meta";
import { createSnapshotsRenderer, renderWithCoilProvider } from "@/utils/render-with-coil-provider";

import IndexTemplate, { Head as GatsbyHead } from "./index-template";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("IndexTemplate", () => {
  const props = {
    data: {
      allMarkdownRemark: mocks.allMarkdownRemark,
    },
    pageContext: mocks.pageContext,
  };

  beforeEach(() => {
    mockedUseStaticQuery.mockReset();
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    let calls = 0;
    mockedUseStaticQuery.mockImplementation(() => {
      calls += 1;

      if (calls === 1) {
        return mocks.siteMetadata;
      }

      return {
        allMarkdownRemark: {
          group: [
            { fieldValue: "Typography", totalCount: 2 },
            { fieldValue: "Design", totalCount: 1 },
          ],
        },
      };
    });
  });

  test("renders correctly", () => {
    const tree = createSnapshotsRenderer(<IndexTemplate {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("head renders correctly", () => {
    const { container } = renderWithCoilProvider(<GatsbyHead {...props} />);

    expect(getMeta(container, "twitter:card")).toEqual("summary_large_image");
    expect(getMeta(container, "twitter:title")).toEqual("Blog by John Doe");
    expect(getMeta(container, "og:title")).toEqual("Blog by John Doe");
    expect(getMeta(container, "description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
    expect(getMeta(container, "twitter:description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
    expect(getMeta(container, "og:description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
  });
});
