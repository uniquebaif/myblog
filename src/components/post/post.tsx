import React, { type FC } from "react";

import config from "../../../content/config.json";

import type { Node } from "@/types/node";
import { Button } from "@/components/button";
import { Comments } from "@/components/comments";
import { PostTags } from "@/components/post-tags";
import { PostAuthor } from "@/components/post-author";
import { PostFooter } from "@/components/post-footer";
import { PostContent } from "@/components/post-content";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { TableOfContents } from "@/components/table-of-contents";

import * as styles from "./post.module.scss";

interface PostProps {
  post: Node;
}

const Post: FC<PostProps> = ({ post }) => {
  const { html, tableOfContents } = post;
  const { tagSlugs } = post.fields;
  const { tags, title, date } = post.frontmatter;

  return (
    <div className={styles.post}>
      <div className={styles.buttons}>
        <Button className={styles.buttonArticles} title="All Articles" to="/" />
        <ThemeSwitcher />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.content}>
            <PostContent body={html} title={title} />
          </div>
          <div className={styles.footer}>
            <PostFooter date={date} />
            {tags && tagSlugs && <PostTags tags={tags} tagSlugs={tagSlugs} />}
            <PostAuthor />
          </div>
          <Comments config={config.giscus} />
        </div>
        {tableOfContents && (
          <aside className={styles.sidebar}>
            <TableOfContents tableOfContents={tableOfContents} />
          </aside>
        )}
      </div>
    </div>
  );
};

export { Post };
