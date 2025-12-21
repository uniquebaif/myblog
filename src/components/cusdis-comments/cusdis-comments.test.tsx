import React from "react";
import { StaticQuery, useStaticQuery } from "gatsby";
import { describe, test, expect, beforeEach, mock } from "bun:test";
import { render as reactTestingLibraryRender } from "@testing-library/react";

import * as mocks from "@/mocks";
import { CusdisComments } from "@/components/cusdis-comments/cusdis-comments";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("CusdisComments", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly with Cusdis config", () => {
    // 模拟包含Cusdis配置的站点元数据
    const mockSiteMetadataWithCusdis = {
      ...mocks.siteMetadata,
      site: {
        siteMetadata: {
          ...mocks.siteMetadata.site.siteMetadata,
          cusdis: {
            appId: "test-app-id",
            host: "https://cusdis.com",
          },
        },
      },
    };

    mockedUseStaticQuery.mockReturnValue(mockSiteMetadataWithCusdis);

    const props = {
      pageId: "test-page-id",
      pageUrl: "https://example.com/test",
      pageTitle: "Test Page Title",
    };

    const tree = createSnapshotsRenderer(<CusdisComments {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders nothing when Cusdis config is missing", () => {
    const props = {
      pageId: "test-page-id",
      pageUrl: "https://example.com/test",
      pageTitle: "Test Page Title",
    };

    const { container } = reactTestingLibraryRender(<CusdisComments {...props} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders nothing when appId is missing", () => {
    const mockSiteMetadataWithEmptyAppId = {
      ...mocks.siteMetadata,
      site: {
        siteMetadata: {
          ...mocks.siteMetadata.site.siteMetadata,
          cusdis: {
            appId: "",
            host: "https://cusdis.com",
          },
        },
      },
    };

    mockedUseStaticQuery.mockReturnValue(mockSiteMetadataWithEmptyAppId);

    const props = {
      pageId: "test-page-id",
      pageUrl: "https://example.com/test",
      pageTitle: "Test Page Title",
    };

    const { container } = reactTestingLibraryRender(<CusdisComments {...props} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders nothing when host is missing", () => {
    const mockSiteMetadataWithEmptyHost = {
      ...mocks.siteMetadata,
      site: {
        siteMetadata: {
          ...mocks.siteMetadata.site.siteMetadata,
          cusdis: {
            appId: "test-app-id",
            host: "",
          },
        },
      },
    };

    mockedUseStaticQuery.mockReturnValue(mockSiteMetadataWithEmptyHost);

    const props = {
      pageId: "test-page-id",
      pageUrl: "https://example.com/test",
      pageTitle: "Test Page Title",
    };

    const { container } = reactTestingLibraryRender(<CusdisComments {...props} />);
    expect(container.firstChild).toBeNull();
  });

  test("the component contains correct data attributes", () => {
    const mockSiteMetadataWithCusdis = {
      ...mocks.siteMetadata,
      site: {
        siteMetadata: {
          ...mocks.siteMetadata.site.siteMetadata,
          cusdis: {
            appId: "test-app-id",
            host: "https://cusdis.com",
          },
        },
      },
    };

    mockedUseStaticQuery.mockReturnValue(mockSiteMetadataWithCusdis);

    const props = {
      pageId: "test-page-id",
      pageUrl: "https://example.com/test",
      pageTitle: "Test Page Title",
    };

    const { getByTestId } = reactTestingLibraryRender(
      <div data-testid="wrapper">
        <CusdisComments {...props} />
      </div>
    );

    const wrapper = getByTestId("wrapper");
    const cusdisDiv = wrapper.querySelector("#cusdis_thread");
    expect(cusdisDiv).toBeTruthy();
    expect(cusdisDiv?.getAttribute("data-app-id")).toBe("test-app-id");
    expect(cusdisDiv?.getAttribute("data-host")).toBe("https://cusdis.com");
    expect(cusdisDiv?.getAttribute("data-page-id")).toBe("test-page-id");
    expect(cusdisDiv?.getAttribute("data-page-url")).toBe("https://example.com/test");
    expect(cusdisDiv?.getAttribute("data-page-title")).toBe("Test Page Title");
  });
});