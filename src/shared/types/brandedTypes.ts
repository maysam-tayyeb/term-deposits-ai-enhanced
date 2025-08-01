/**
 * Branded types utility for creating type-safe primitives
 *
 * Example usage:
 * type UserId = Brand<number, "UserId">;
 * type Email = Brand<string, "Email">;
 */

export type Brand<T, B extends string> = T & { readonly __brand: B };

export type NumberBrand<B extends string> = Brand<number, B>;
export type StringBrand<B extends string> = Brand<string, B>;

/**
 * Helper for creating branded type constructors
 *
 * Example:
 * const createUserId = createBrandedType<number, "UserId">("UserId");
 * const userId = createUserId(123);
 */
export function createBrandedType<T, B extends string>() {
  return (value: T): Brand<T, B> => value as Brand<T, B>;
}
