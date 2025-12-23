import React from "react";
import { useStaticQuery } from "gatsby";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import { SidebarTags } from "@/components/sidebar-tags";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;

describe("SidebarTags", () => {
  beforeEach(() => {
    mockedUseStaticQuery.mockReturnValue({
      allMarkdownRemark: {
        group: [
          { fieldValue: "AI", totalCount: 3 },
          { fieldValue: "Typography", totalCount: 1 },
        ],
      },
    });
  });

  test("renders correctly", () => {
    const tree = createSnapshotsRenderer(<SidebarTags activeTag="AI" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

