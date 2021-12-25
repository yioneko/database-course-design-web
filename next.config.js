/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    MYSQL_HOST: "",
    MYSQL_USER: "",
    MYSQL_PASSWORD: "",
    MYSQL_DATABASE: "",
    SALT_LENGTH: 16,
    HASH_ALGORITHM: "sha512",
  },
};
