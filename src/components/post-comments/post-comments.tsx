import React, { type FC, useEffect, useRef } from "react";

import { useSiteMetadata } from "@/hooks/use-site-metadata";

import * as styles from "./post-comments.module.scss";

interface PostCommentsProps {
  slug: string;
  title: string;
}

const PostComments: FC<PostCommentsProps> = ({ slug, title }) => {
  const { cusdis } = useSiteMetadata();
  const scriptLoaded = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cusdis?.appId || scriptLoaded.current || !containerRef.current) {
      return;
    }

    // 检查脚本是否已存在
    const existingScript = document.querySelector(
      `script[src*="cusdis.es.js"]`
    );
    if (existingScript) {
      scriptLoaded.current = true;
      return;
    }

    // 加载 Cusdis 脚本
    const script = document.createElement("script");
    const host = cusdis.host || "https://cusdis.com";
    script.src = `${host}/js/cusdis.es.js`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    scriptLoaded.current = true;

    return () => {
      // 清理脚本（可选）
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [cusdis]);

  if (!cusdis?.appId) {
    return null;
  }

  const host = cusdis.host || "https://cusdis.com";
  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className={styles.postComments} ref={containerRef}>
      <div
        id="cusdis_thread"
        data-host={host}
        data-app-id={cusdis.appId}
        data-page-id={slug}
        data-page-title={title}
        data-page-url={pageUrl}
      />
    </div>
  );
};

export { PostComments };

