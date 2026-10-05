import * as ChangeCase from 'change-case';

export type SmartPascalCaseOptions = ChangeCase.PascalCaseOptions & {
  overrides?: Record<string, string>;
};

export function smartPascalCase(
  text: string,
  {
    overrides = {
      Oauth: 'OAuth',
      Openid: 'OpenID',
      Gpa: 'GPA',
      ['/Gl([A-Z])/']: 'GL$1',
      ['/Ap([A-Z])/']: 'AP$1'
    },
    ...options
  }: SmartPascalCaseOptions = {}
) {
  let result = ChangeCase.pascalCase(text, options);
  for (const needle in overrides) {
    result = result.replaceAll(
      /^\/.*\/$/.test(needle)
        ? new RegExp(needle.substring(1, needle.length - 1), 'g')
        : needle,
      overrides[needle]
    );
  }
  return result;
}
