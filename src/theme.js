export const C = {
  gold: '#C9A24B',
  goldDark: '#A9832F',
  goldSoft: 'rgba(201,162,75,0.12)',
  rose: '#D98E8E',
  roseSoft: 'rgba(217,142,142,0.12)',
  bg: '#FAF6F1',
  surface: '#FFFFFF',
  ink: '#2B2B33',
  muted: '#7C7A85',
  line: '#EFE7DD',
  danger: '#C0564F',
  success: '#5E8C61',
  slate: '#3A3A44',
};

export const R = { sm: 10, md: 14, lg: 20, pill: 999 };

export const shadow = (lvl = 1) =>
  lvl === 0
    ? {}
    : lvl === 1
    ? { shadowColor: '#2B2B33', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }
    : { shadowColor: '#2B2B33', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6 };

export const fmt = (n) => `${Number(n || 0).toLocaleString('en-EG')} ج.م`;
