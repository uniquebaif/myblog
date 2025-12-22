import React, {
  type FC,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import * as styles from "./table-of-contents.module.scss";

interface TocItem {
  url: string;
  title: string;
  items?: TocItem[];
}

interface TableOfContentsProps {
  tableOfContents: string;
  expandDepth?: number; // 展开深度，默认为 1
}

// 递归解析嵌套的 TOC HTML 结构
const parseNestedToc = (element: Element): TocItem[] => {
  const items: TocItem[] = [];
  const listItems = element.querySelectorAll(":scope > li");

  listItems.forEach((li) => {
    const link = li.querySelector(":scope > a, :scope > p > a");
    if (link) {
      const url = link.getAttribute("href") || "";
      const title = link.textContent || "";
      const nestedUl = li.querySelector(":scope > ul");
      const children = nestedUl ? parseNestedToc(nestedUl) : undefined;

      if (url && title) {
        items.push({
          url,
          title,
          items: children && children.length > 0 ? children : undefined,
        });
      }
    }
  });

  return items;
};

const parseTableOfContents = (html: string): TocItem[] => {
  if (!html || typeof window === "undefined") return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const rootUl = doc.querySelector("ul");

  if (!rootUl) return [];
  return parseNestedToc(rootUl);
};

// 获取所有项目的 ID 列表（扁平化）
const getAllIds = (items: TocItem[]): string[] => {
  const ids: string[] = [];
  const traverse = (list: TocItem[]) => {
    list.forEach((item) => {
      ids.push(item.url.replace("#", ""));
      if (item.items) traverse(item.items);
    });
  };
  traverse(items);
  return ids;
};

// 查找包含 activeId 的祖先路径
const findAncestorPath = (
  items: TocItem[],
  activeId: string,
  path: string[] = []
): string[] | null => {
  for (const item of items) {
    const currentId = item.url.replace("#", "");
    const currentPath = [...path, currentId];

    if (currentId === activeId) {
      return currentPath;
    }

    if (item.items) {
      const found = findAncestorPath(item.items, activeId, currentPath);
      if (found) return found;
    }
  }
  return null;
};

// 获取需要展开的节点 ID 集合
const getExpandedIds = (
  items: TocItem[],
  activeId: string,
  expandDepth: number
): Set<string> => {
  const expanded = new Set<string>();
  const ancestorPath = findAncestorPath(items, activeId) || [];

  // 展开祖先链路上的所有节点
  ancestorPath.forEach((id) => expanded.add(id));

  // 展开 active 节点的子节点（根据 expandDepth）
  const expandChildren = (
    nodeItems: TocItem[] | undefined,
    depth: number
  ) => {
    if (!nodeItems || depth <= 0) return;
    nodeItems.forEach((item) => {
      const id = item.url.replace("#", "");
      expanded.add(id);
      if (item.items && depth > 1) {
        expandChildren(item.items, depth - 1);
      }
    });
  };

  // 找到 active 节点并展开其子节点
  const findAndExpand = (nodeItems: TocItem[]) => {
    for (const item of nodeItems) {
      const id = item.url.replace("#", "");
      if (id === activeId && item.items) {
        expandChildren(item.items, expandDepth);
      }
      if (item.items) findAndExpand(item.items);
    }
  };

  findAndExpand(items);
  return expanded;
};

interface TocItemComponentProps {
  item: TocItem;
  activeId: string;
  expandedIds: Set<string>;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
  depth: number;
}

const TocItemComponent: FC<TocItemComponentProps> = ({
  item,
  activeId,
  expandedIds,
  onItemClick,
  depth,
}) => {
  const id = item.url.replace("#", "");
  const isActive = activeId === id;
  const isExpanded = expandedIds.has(id);
  const hasChildren = item.items && item.items.length > 0;

  return (
    <li
      className={`${styles.item} ${isActive ? styles.active : ""} ${
        styles[`depth${Math.min(depth, 3)}`] || ""
      }`}
    >
      <a href={item.url} onClick={(e) => onItemClick(e, item.url)}>
        {hasChildren && (
          <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ""}`}>
            ›
          </span>
        )}
        <span className={styles.text}>{item.title}</span>
      </a>
      {hasChildren && (
        <ul
          className={`${styles.sublist} ${isExpanded ? styles.open : styles.closed}`}
        >
          {item.items!.map((child) => (
            <TocItemComponent
              key={child.url}
              item={child}
              activeId={activeId}
              expandedIds={expandedIds}
              onItemClick={onItemClick}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const TableOfContents: FC<TableOfContentsProps> = ({
  tableOfContents,
  expandDepth = 1,
}) => {
  const [activeId, setActiveId] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const items = useMemo(
    () => (isMounted ? parseTableOfContents(tableOfContents) : []),
    [tableOfContents, isMounted]
  );

  const expandedIds = useMemo(
    () => getExpandedIds(items, activeId, expandDepth),
    [items, activeId, expandDepth]
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
    if (!isMounted) return;

    const headings = document.querySelectorAll(
      "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
    );
    if (headings.length === 0) return;

    const allIds = getAllIds(items);

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到最靠近视口顶部的可见标题
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // 按照在页面中的位置排序，取最上面的
          const sorted = visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          const topEntry = sorted[0];
          if (allIds.includes(topEntry.target.id)) {
            setActiveId(topEntry.target.id);
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      if (allIds.includes(heading.id)) {
        observer.observe(heading);
      }
    });

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [isMounted, items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className={styles.toc}>
      <h4 className={styles.title}>Table of Contents</h4>
      <ul className={styles.list}>
        {items.map((item) => (
          <TocItemComponent
            key={item.url}
            item={item}
            activeId={activeId}
            expandedIds={expandedIds}
            onItemClick={handleClick}
            depth={1}
          />
        ))}
      </ul>
    </nav>
  );
};

export { TableOfContents };
