export function intentionallyDelay() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}
