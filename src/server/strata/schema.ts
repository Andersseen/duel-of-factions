import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * A minimal hand-written Standard Schema v1 builder. Strata validates params, query and bodies
 * with any conforming schema; the game's inputs are tiny, so it does not need a schema library.
 */
export type Check<T> = (value: unknown) => T | readonly string[];

export function schema<T>(check: Check<T>): StandardSchemaV1<unknown, T> {
  return {
    "~standard": {
      version: 1,
      vendor: "duel-of-factions",
      validate(value) {
        const result = check(value);
        return Array.isArray(result)
          ? { issues: result.map((message: string) => ({ message })) }
          : { value: result as T };
      },
    },
  };
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
