import React, { type FC, useEffect, useState, useCallback, useMemo } from "react";

import * as styles from "./table-of-contents.module.scss";

interface TocItem {
  url: string;
  title: string;
  items?: TocItem[];
}

interface TableOfContentsProps {
  tableOfContents: string;
}

const parseTableOfContents = (html: string): TocItem[] => {
  if (!html || typeof window === "undefined") return [];

  const items: TocItem[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = doc.querySelectorAll("a");

  links.forEach((link) => {
    const url = link.getAttribute("href") || "";
    const title = link.textContent || "";
    if (url && title) {
      items.push({ url, title });
    }
  });

  return items;
};

const TableOfContents: FC<TableOfContentsProps> = ({ tableOfContents }) => {
  const [activeId, setActiveId] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const items = useMemo(
    () => (isMounted ? parseTableOfContents(tableOfContents) : []),
    [tableOfContents, isMounted]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
      e.preventDefault();
      const id = url.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setActiveId(id);
      }
    },
    []
  );

  useEffect(() => {
    const headings = document.querySelectorAll("h2[id], h3[id]");
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className={styles.toc}>
      <h4 className={styles.title}>目录</h4>
      <ul className={styles.list}>
        {items.map((item) => (
          <li
            key={item.url}
            className={`${styles.item} ${
              activeId === item.url.replace("#", "") ? styles.active : ""
            }`}
          >
            <a href={item.url} onClick={(e) => handleClick(e, item.url)}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { TableOfContents };

