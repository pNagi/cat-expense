export function convertEntryValueToString(
  field?: FormDataEntryValue | null,
): string | undefined {
  if (typeof field === "string") return field.trim() || undefined;

  return undefined;
}
