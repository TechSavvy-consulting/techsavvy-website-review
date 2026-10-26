type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isFormspreeSuccess(httpOk: boolean, contentType: string | null, result: unknown): boolean {
  return Boolean(
    httpOk && contentType?.toLowerCase().includes('application/json') &&
    isObject(result) && result.ok === true && !result.error &&
    !(Array.isArray(result.errors) && result.errors.length)
  );
}

export function getFormspreeFieldErrors(result: unknown): Array<{ field: string; message: string }> {
  if (!isObject(result) || !Array.isArray(result.errors)) return [];
  return result.errors.filter((error): error is { field: string; message: string } => (
    isObject(error) && typeof error.field === 'string' && typeof error.message === 'string'
  )).map(error => ({ field: error.field, message: error.message.slice(0, 240) }));
}
