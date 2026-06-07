export function formatSalary(min: number, max: number): string {
  const fmt = (value: number) => {
    if (value >= 1_000_000) {
      const m = value / 1_000_000;
      return `${Number.isInteger(m) ? m : m.toFixed(1)} triệu`;
    }
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return `${value}`;
  };
  if (!min && !max) return 'Thỏa thuận';
  if (!min) return `Lên tới ${fmt(max)}`;
  if (!max) return `Từ ${fmt(min)}`;
  if (min === max) return `Lên tới ${fmt(max)}`;
  return `${fmt(min)} – ${fmt(max)}`;
}
