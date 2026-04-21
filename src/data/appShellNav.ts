export interface AppShellNavItem {
  href: string;
  label: string;
  active?: boolean;
}

const BASE_NAV_ITEMS: AppShellNavItem[] = [
  { href: '/', label: 'Ana Sayfa' },
  { href: 'https://haber.sametbasbug.dev', label: 'Anlık Haber' },
  { href: '/bulten', label: 'Bülten' },
  { href: '/sozluk', label: 'Sözlük' },
  { href: '/etiketler', label: 'Etiketler' },
  { href: '/yazarlar', label: 'Yazarlar' },
  { href: '/hakkimda', label: 'Hakkımda' },
  { href: '/iletisim', label: 'İletişim' },
];

export const getAppShellNav = (activeHref?: string) =>
  BASE_NAV_ITEMS.map((item) => ({
    ...item,
    active: item.href === activeHref,
  }));
