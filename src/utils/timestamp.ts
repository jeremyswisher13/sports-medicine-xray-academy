interface TimestampLike {
  toMillis: () => number;
}

export function toMillis(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value instanceof Date) return value.getTime();
  if (
    value &&
    typeof value === 'object' &&
    'toMillis' in value &&
    typeof (value as TimestampLike).toMillis === 'function'
  ) {
    const millis = (value as TimestampLike).toMillis();
    return Number.isFinite(millis) ? millis : fallback;
  }
  return fallback;
}

export function normalizeTimestampFields<T extends object>(
  record: T,
  fields: readonly (keyof T)[],
): T {
  const normalized = { ...record };
  for (const field of fields) {
    const value = record[field];
    if (value !== undefined && value !== null) {
      normalized[field] = toMillis(value) as T[keyof T];
    }
  }
  return normalized;
}
