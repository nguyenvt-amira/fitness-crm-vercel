export const normalizePostalCode = (value?: string) => trimOrUndefined(value)?.replace(/\D/g, '');

export const trimOrUndefined = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};
