export type DriveIntent = 'buyer' | 'seller';

function readSearchParamValue(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function resolveDriveSearchState(
  searchParams: Record<string, string | string[] | undefined>
) {
  const intent = readSearchParamValue(searchParams.intent);
  const focus = readSearchParamValue(searchParams.focus);
  const initialIntent: DriveIntent | undefined =
    intent === 'buyer' || intent === 'seller' ? intent : undefined;

  return {
    initialIntent,
    hasPresetIntent: Boolean(initialIntent),
    shouldFocusWaitlist: focus === 'waitlist',
  };
}
