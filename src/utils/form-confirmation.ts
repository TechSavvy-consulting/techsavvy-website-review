// A short-lived, tab-local UI handoff—not an analytics or attribution marker.
// It contains only a timestamp, never inquiry data, identity or a form ID.
type ConfirmationStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const confirmationKey = 'techsavvy-form-confirmed-at';
export const FORM_CONFIRMATION_MAX_AGE_MS = 5 * 60 * 1000;

function browserStorage(): ConfirmationStorage | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function rememberFormConfirmation(
  storage: ConfirmationStorage | undefined = browserStorage(),
  now = Date.now(),
): boolean {
  try {
    if (!storage || !Number.isFinite(now) || now <= 0) return false;
    storage.setItem(confirmationKey, String(now));
    return true;
  } catch {
    // Restricted storage must never prevent the successful form redirect.
    return false;
  }
}

export function consumeFormConfirmation(
  storage: ConfirmationStorage | undefined = browserStorage(),
  now = Date.now(),
): boolean {
  try {
    if (!storage) return false;
    const saved = storage.getItem(confirmationKey);
    storage.removeItem(confirmationKey);
    if (!saved) return false;
    const timestamp = Number(saved);
    const age = now - timestamp;
    return Number.isFinite(timestamp) && timestamp > 0 &&
      Number.isFinite(age) && age >= 0 && age <= FORM_CONFIRMATION_MAX_AGE_MS;
  } catch {
    return false;
  }
}
