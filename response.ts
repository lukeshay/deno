export type CacheHeaderDirectives = {
  immutable?: boolean;
  maxAge?: number;
  mustRevalidate?: boolean;
  mustUnderstand?: boolean;
  noCache?: boolean;
  noStore?: boolean;
  noTransform?: boolean;
  private?: boolean;
  proxyRevalidate?: boolean;
  public?: boolean;
  sMaxage?: number;
  staleIfError?: number;
  staleWhileRevalidate?: number;
};

function camelCaseToDashCase(str: string): string {
  return str.replace(/([A-Z])/g, function (g) {
    return g[0] ? `-${g[0].toLowerCase()}` : "";
  });
}

function buildHeaderDirective(key: string, value: boolean | number) {
  if (typeof value === "boolean") {
    return value ? key : undefined;
  }

  return `${key}=${value}`;
}

/** Adds the `Cache-Control` header to the response. */
export function addCacheHeader(
  response: Response,
  directives: CacheHeaderDirectives = {},
) {
  const headerDirectives = Object.entries(directives)
    .map(([key, value]) =>
      buildHeaderDirective(camelCaseToDashCase(key), value)
    )
    .filter(Boolean);

  return new Response(response.body, {
    ...response,
    headers: {
      ...response.headers,
      "Cache-Control": headerDirectives.join(", "),
    },
  });
}
