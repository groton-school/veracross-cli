import { JSONObject, JSONValue } from '@battis/typescript-tricks';

export function minimal<T extends JSONObject>(
  retrieved: T,
  proposal: Partial<T>,
  isEqual: (key: string, a?: JSONValue, b?: JSONValue) => boolean = (
    _key,
    a,
    b
  ) => a === b
): Partial<T> | undefined {
  const result: Partial<T> = {};
  for (const key in proposal) {
    if (
      proposal[key] !== undefined &&
      !isEqual(key, retrieved[key], proposal[key])
    ) {
      result[key] = proposal[key];
    }
  }
  if (Object.keys(result).length) {
    return result;
  }
  return undefined;
}

export function omit<T extends JSONObject>(
  proposal: T,
  propsToOmit: (keyof T)[]
) {
  return Object.fromEntries(
    Object.entries(proposal).filter(([k]) => !propsToOmit.includes(k))
  ) as Partial<T>;
}
