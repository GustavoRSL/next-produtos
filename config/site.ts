export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Produtos Manager",
  description:
    "Sistema de gerenciamento de produtos com dashboard de métricas.",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Produtos",
      href: "/produtos",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Produtos",
      href: "/produtos",
    },
  ],
  links: {
    github: "https://github.com",
  },
};
