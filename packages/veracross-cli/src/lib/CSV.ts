import { parser } from 'csv/sync';

export function cast(
  map: Record<
    string,
    'int' | 'float' | 'string' | 'non-empty-string' | 'boolean'
  >
): parser.CastingFunction {
  return (value, context) => {
    switch (context.column in map ? map[context.column] : undefined) {
      case 'int':
        return Number.isNaN(parseInt(value)) ? undefined : parseInt(value);
      case 'float':
        return Number.isNaN(parseFloat(value)) ? undefined : parseFloat(value);
      case 'boolean':
        return value.toUpperCase() === 'TRUE'
          ? true
          : value.toUpperCase() === 'FALSE'
            ? false
            : undefined;
      case 'non-empty-string':
        return value.length > 0 ? value : undefined;
      case 'string':
      default:
        return value;
    }
  };
}
