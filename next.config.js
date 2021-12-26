/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
  "database-course-design-model",
]);
module.exports = withTM({
  reactStrictMode: true,
  env: {
    MYSQL_HOST: "",
    MYSQL_USER: "",
    MYSQL_PASSWORD: "",
    MYSQL_DATABASE: "",
    SALT_LENGTH: 16,
    HASH_ALGORITHM: "sha512",
    JWT_SECRET: "",
    HOST: "http://localhost:3000",
  },
});
