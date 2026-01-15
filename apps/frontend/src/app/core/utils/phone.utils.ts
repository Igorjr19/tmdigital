export function formatPhone(value: string | undefined | null): string {
  if (!value) return '';

  const cleanValue = value.toString().replace(/\D/g, '');

  if (cleanValue.length > 11) {
    return cleanValue
      .substring(0, 11)
      .replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  }

  if (cleanValue.length > 10) {
    return cleanValue.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanValue.length > 6) {
    return cleanValue.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (cleanValue.length > 2) {
    return cleanValue.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  }

  return cleanValue;
}
