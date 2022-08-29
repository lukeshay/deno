import { faker } from "faker";
import {
  assert,
  assertFalse,
  assertStringIncludes,
} from "std/testing/asserts.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";
import { addCacheHeader, CacheHeaderDirectives } from "./response.ts";

describe("response", () => {
  describe("addCacheHeader", () => {
    const booleanDirectives = {
      immutable: "immutable",
      mustRevalidate: "must-revalidate",
      mustUnderstand: "must-understand",
      noCache: "no-cache",
      noStore: "no-store",
      noTransform: "no-transform",
      private: "private",
      proxyRevalidate: "proxy-revalidate",
      public: "public",
    };

    const numberDirectives = {
      maxAge: "max-age",
      sMaxage: "s-maxage",
      staleIfError: "stale-if-error",
      staleWhileRevalidate: "stale-while-revalidate",
    };

    let result: Response,
      response: Response,
      cacheDirectives: CacheHeaderDirectives;

    beforeEach(() => {
      response = new Response(faker.datatype.string(), {
        headers: {
          "Content-Type": faker.datatype.string(),
        },
      });

      cacheDirectives = {
        immutable: faker.datatype.boolean(),
        maxAge: faker.datatype.number(),
        mustRevalidate: faker.datatype.boolean(),
        mustUnderstand: faker.datatype.boolean(),
        noCache: faker.datatype.boolean(),
        noStore: faker.datatype.boolean(),
        noTransform: faker.datatype.boolean(),
        private: faker.datatype.boolean(),
        proxyRevalidate: faker.datatype.boolean(),
        public: faker.datatype.boolean(),
        sMaxage: faker.datatype.number(),
        staleIfError: faker.datatype.number(),
        staleWhileRevalidate: faker.datatype.number(),
      };
    });

    describe("always", () => {
      beforeEach(() => {
        result = addCacheHeader(response, cacheDirectives);
      });

      it("should add the 'Cache-Control' header", () => {
        assert(result.headers.get("Cache-Control"));
      });
    });

    Object.entries(booleanDirectives).forEach(([key, value]) => {
      describe(`when the ${key} directive is true`, () => {
        let cacheHeader: string;

        beforeEach(() => {
          // @ts-expect-error: The key is always a key of the cacheDirectives object.
          cacheDirectives[key] = true;

          result = addCacheHeader(response, cacheDirectives);

          cacheHeader = result.headers.get("Cache-Control") as string;
        });

        it(`should add the ${value} directive`, () => {
          assertStringIncludes(cacheHeader, value);
        });
      });

      describe(`when the ${key} directive is false`, () => {
        let cacheHeader: string;

        beforeEach(() => {
          // @ts-expect-error: The key is always a key of the cacheDirectives object.
          cacheDirectives[key] = false;

          result = addCacheHeader(response, cacheDirectives);

          cacheHeader = result.headers.get("Cache-Control") as string;
        });

        it(`should add the ${value} directive`, () => {
          assertFalse(cacheHeader.includes(value));
        });
      });
    });

    Object.entries(numberDirectives).forEach(([key, value]) => {
      describe(`when the ${key} directive is a number`, () => {
        let cacheHeader: string, num: number;

        beforeEach(() => {
          num = faker.datatype.number();

          // @ts-expect-error: The key is always a key of the cacheDirectives object.
          cacheDirectives[key] = num;

          result = addCacheHeader(response, cacheDirectives);

          cacheHeader = result.headers.get("Cache-Control") as string;
        });

        it(`should add the ${value} directive`, () => {
          assertStringIncludes(cacheHeader, `${value}=${num}`);
        });
      });
    });
  });
});
