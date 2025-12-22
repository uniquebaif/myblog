import React, { type FC, useState, useEffect } from "react";

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
  const [Giscus, setGiscus] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import("@giscus/react").then((mod) => {
      setGiscus(() => mod.default);
    });
  }, []);

  if (!config.repo || !config.repoId || !Giscus) {
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
        lang="en"
        loading="lazy"
      />
    </div>
  );
};

export { Comments };

