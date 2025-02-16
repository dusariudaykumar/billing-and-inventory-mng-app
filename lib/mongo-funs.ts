/* eslint-disable @typescript-eslint/no-explicit-any */
export function tokenizeString(str?: string): string[] {
  return (str && str.match(/(?:[^\s"]+|"[^"]*")+/g)) || [];
}

export function stripQuotes(str?: string): string {
  if (!str?.trim()) {
    return '';
  }

  const result = str.match(/^"(.*)"$/);

  if (result && result.length > 1) {
    return result[1]?.trim() ?? '';
  }

  return str;
}

export function cleanParam(param?: string): string {
  return param ? param.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&') : '';
}

export function makeRegExp(param?: string): RegExp {
  return new RegExp(cleanParam(param), 'i');
}

export function textToRegExps(text?: string): RegExp[] {
  return tokenizeString(text)
    .map((token) => stripQuotes(token))
    .filter((token) => !!token)
    .map((token) => makeRegExp(token));
}

export interface MongoRegExpStatement {
  $regex: RegExp;
}

export function textToMongoRegExpStatements(
  field: string,
  text?: any
): Record<string, MongoRegExpStatement>[] {
  return textToRegExps(text).map((token) => ({ [field]: { $regex: token } }));
}
