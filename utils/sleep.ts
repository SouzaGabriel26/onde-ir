export function sleep(delay = 500) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
