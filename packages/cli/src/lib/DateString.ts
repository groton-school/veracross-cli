import { DateString } from '@battis/descriptive-types';

function toLocaleDateString(d?: DateString): DateString | undefined {
  if (d) {
    return new Date(d).toLocaleDateString();
  }
  return undefined;
}

export function isEqual(
  a?: DateString,
  b?: DateString,
  canonicalize: (d: DateString) => DateString | undefined = toLocaleDateString
): boolean {
  return !!a && !!b && canonicalize(a) == canonicalize(b);
}
