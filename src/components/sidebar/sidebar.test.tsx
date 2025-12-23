import React from "react";
import { StaticQuery, useStaticQuery } from "gatsby";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import * as mocks from "@/mocks";
import { Sidebar } from "@/components/sidebar";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("Sidebar", () => {
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
    const props = { isHome: true };
    const tree = createSnapshotsRenderer(<Sidebar {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
