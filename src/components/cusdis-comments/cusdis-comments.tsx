import React, { type FC, useEffect, useRef } from "react";

import { useSiteMetadata } from "@/hooks/use-site-metadata";

import * as styles from "./cusdis-comments.module.scss";

interface CusdisCommentsProps {
  pageId: string;
  pageUrl: string;
  pageTitle: string;
}

const CusdisComments: FC<CusdisCommentsProps> = ({ pageId, pageUrl, pageTitle }) => {
  const { cusdis } = useSiteMetadata();
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // 如果Cusdis配置不存在，不加载脚本
    if (!cusdis?.appId || !cusdis?.host) {
      return;
    }

    // 防止重复加载脚本
    if (scriptLoaded.current) {
      return;
    }

    // 检查脚本是否已存在
    const existingScript = document.querySelector(`script[src="${cusdis.host}/js/cusdis.es.js"]`);
    if (existingScript) {
      scriptLoaded.current = true;
      return;
    }

    // 动态加载Cusdis脚本
    const script = document.createElement("script");
    script.src = `${cusdis.host}/js/cusdis.es.js`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };

    document.head.appendChild(script);

    // 清理函数
    return () => {
      // 注意：我们不移除脚本，因为它可能被其他实例使用
    };
  }, [cusdis]);

  // 如果Cusdis配置不存在，不渲染评论框
  if (!cusdis?.appId || !cusdis?.host) {
    return null;
  }

  return (
    <div className={styles.cusdisComments}>
      <div
        id="cusdis_thread"
        data-host={cusdis.host}
        data-app-id={cusdis.appId}
        data-page-id={pageId}
        data-page-url={pageUrl}
        data-page-title={pageTitle}
      />
    </div>
  );
};

export { CusdisComments };