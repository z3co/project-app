import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * @description
 * Wraps a promise in a try catch block and gives a typesafe return
 *
 * @example
 * const result = await tryCatch(fetchTodos());
 * if (result.error) {
 *    // Put your error handling here
 * } else {
 *   // Process the result here
 * }
 *
 * @param {Promise} promise
 * **/
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
