import { OpenAPI3, ReferenceObject } from 'openapi-typescript';

function isRef(obj: unknown): obj is ReferenceObject {
  return !!obj && typeof obj === 'object' && '$ref' in obj;
}

export function deref<T>(
  obj: T | ReferenceObject,
  spec: OpenAPI3
): T | undefined {
  if (isRef(obj)) {
    const { $ref } = obj;
    return $ref.split('/').reduce((o: object | undefined, token) => {
      if (token === '#') {
        return spec;
      }
      if (o && token in o) {
        return o[token as keyof typeof o];
      }
      return o;
    }, undefined) as T;
  } else {
    return obj;
  }
}
