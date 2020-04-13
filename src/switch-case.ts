// https://matthiashager.com/converting-snake-case-to-camel-case-object-keys-with-javascript
// https://vladimir-ivanov.net/camelcase-to-snake_case-and-vice-versa-with-javascript/
function switchCase<T extends { [s: string]: any }, S extends T>(
  o: T,
  transformer: (s: string) => string,
): S {
  const isArray = (a: any): boolean => Array.isArray(a);

  const isObject = (o: any): boolean => o === Object(o) && !isArray(o) && typeof o !== "function";

  if (isObject(o)) {
    return Object.entries(o).reduce(
      (acc, curr) => ({
        ...acc,
        [transformer(curr[0])]: switchCase(curr[1], transformer),
      }),
      {} as S,
    );
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return switchCase(i, transformer);
    });
  }

  return o as S;
}

export function camelCase<T extends { [s: string]: any }, S extends T>(o: T): S {
  const camelCaseString = (s: string): string =>
    s.replace(/([_][a-z])/gi, ($1) => $1.toUpperCase().replace("_", ""));

  return switchCase(o, camelCaseString);
}

export function snakeCase<T extends { [s: string]: any }, S extends T>(o: T): S {
  const snakeCaseString = (s: string): string =>
    s.replace(/[\w]([A-Z])/g, (m) => m[0] + "_" + m[1]).toLowerCase();

  return switchCase(o, snakeCaseString);
}
