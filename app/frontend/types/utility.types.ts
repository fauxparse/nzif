/**
 * Returns true if the type is an empty object, false otherwise.
 */
export type Empty<T> = T extends { [key in keyof T]: never } ? true : false;

/**
 * Expands a union for readability in the inspector.
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
