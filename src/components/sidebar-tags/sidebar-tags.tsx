import React, { type FC } from "react";

import classNames from "classnames";
import { Link } from "gatsby";

import { useTagsList } from "@/hooks/use-tags-list";

import * as styles from "./sidebar-tags.module.scss";

type SidebarTagsProps = {
  activeTag?: string | null;
};

const SidebarTags: FC<SidebarTagsProps> = ({ activeTag }) => {
  const tags = useTagsList()
    .slice()
    .sort((a, b) => a.fieldValue.localeCompare(b.fieldValue));

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.sidebarTags}>
      <div className={styles.title}>Tags</div>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link
            className={classNames(styles.link, { [styles.active]: !activeTag })}
            to="/"
          >
            All
          </Link>
        </li>
        {tags.map((tag) => {
          const isActive = activeTag === tag.fieldValue;
          const href = `/?tag=${encodeURIComponent(tag.fieldValue)}`;

          return (
            <li className={styles.item} key={tag.fieldValue}>
              <Link
                className={classNames(styles.link, { [styles.active]: isActive })}
                to={href}
              >
                {tag.fieldValue}
                <span className={styles.count}>({tag.totalCount})</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { SidebarTags };

