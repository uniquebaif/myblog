import React, { type FC } from "react";

import Giscus from "@giscus/react";

import { useTheme } from "@/hooks/use-theme";

import * as styles from "./comments.module.scss";

interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

interface CommentsProps {
  config: GiscusConfig;
}

const Comments: FC<CommentsProps> = ({ config }) => {
  const [{ mode }] = useTheme();

  if (!config.repo || !config.repoId) {
    return null;
  }

  return (
    <div className={styles.comments}>
      <Giscus
        repo={config.repo as `${string}/${string}`}
        repoId={config.repoId}
        category={config.category}
        categoryId={config.categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={mode === "dark" ? "dark" : "light"}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
};

export { Comments };

