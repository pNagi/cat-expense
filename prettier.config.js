/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  singleQuote: false,
  tabWidth: 2,
  tailwindFunctions: ["twMerge"],
};
