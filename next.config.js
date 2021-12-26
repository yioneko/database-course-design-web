/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
  "database-course-design-model",
]);
module.exports = withTM({
  reactStrictMode: true,
});
