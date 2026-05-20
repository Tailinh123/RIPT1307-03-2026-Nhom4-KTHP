/**
 * Format salary range to Vietnamese style
 * e.g. 5000000 → "5 triệu"
 */
export function formatSalary(min: number, max: number): string {
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} triệu`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
  };
  if (!min && !max) return 'Thoả thuận';
  if (!min) return `Đến ${fmt(max)}`;
  if (!max) return `Từ ${fmt(min)}`;
  return `${fmt(min)} – ${fmt(max)}`;
}
