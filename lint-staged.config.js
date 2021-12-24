module.exports = {
  "**/*.(j|t)s?(x)": (filenames) => [
    "tsc --noEmit",
    `next lint --fix --file ${filenames
      .map((file) => file.split(process.cwd())[1])
      .join(" --file ")}`,
    `prettier --write ${filenames.join(" ")}`,
  ],
};
