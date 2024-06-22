const menu = [
  {
    heading: "Menü",
  },
  {
    icon: "home",
    text: "Anasayfa",
    link: "/",
  },
  {
    icon: "users",
    text: "Kişiler",
    link: "/kisiler",
    active: false,

  },
  {
    icon: "building",
    text: "Firmalar",
    link: "/firmalar",
    active: false,

  },
  {
    icon: "package",
    text: "Ürünler",
    active: false,
    link: "/urunler",

  },
  {
    icon: "file-docs",
    text: "Teklifler",
    active: false,
    link: "/teklifler",

  },
  {
    icon: "file-check",
    text: "Satışlar",
    active: false,
    link: "/satislar",

  },
  {
    icon: "bar-chart-alt",
    text: "Raporlar",
    active: false,
    link: "/",

  },

  {
    heading: "Sistem",
  },
  {
    icon: "server",
    text: "Tanımlamalar",
    active: false,

    subMenu: [
      {
        text: "Kişiler",
        link: "/kisi-tanimlamalari",
      },
      {
        text: "Firmalar",
        link: "/firma-tanimlamalari",
      },
      {
        text: "Ürünler",
        link: "/urun-tanimlamalari",
      },
      {
        text: "Teklifler",
        link: "/teklif-tanimlamalari",
      },
      {
        text: "Satışlar",
        link: "/satis-tanimlamalari",
      },
    ],

  },
  {
    icon: "users",
    text: "Kullanıcılar",
    active: false,
    link: "/kullanicilar",

  },
  {
    icon: "setting-alt",
    text: "Ayarlar",
    active: false,
    link: "/",

  },



];
export default menu;
