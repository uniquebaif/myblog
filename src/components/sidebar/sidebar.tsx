import React, { type FC } from "react";

import { useSiteMetadata } from "@/hooks/use-site-metadata";

import { SidebarMenu } from "@/components/sidebar-menu";
import { SidebarAuthor } from "@/components/sidebar-author";
import { SidebarContacts } from "@/components/sidebar-contacts";
import { SidebarCopyright } from "@/components/sidebar-copyright";
import { SidebarTags } from "@/components/sidebar-tags";

import * as styles from "./sidebar.module.scss";

type SidebarProps = {
  isHome?: boolean;
  activeTag?: string | null;
};

const Sidebar: FC<SidebarProps> = ({ isHome, activeTag }) => {
  const { author, copyright, menu } = useSiteMetadata();

  return (
    <div className={styles.sidebar}>
      <div className={styles.inner}>
        <SidebarAuthor author={author} isHome={isHome} />
        <SidebarMenu menu={menu} />
        <SidebarContacts contacts={author.contacts} />
        {isHome && <SidebarTags activeTag={activeTag} />}
        <SidebarCopyright copyright={copyright} />
      </div>
    </div>
  );
};

export { Sidebar };
