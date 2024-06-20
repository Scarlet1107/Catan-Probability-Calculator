const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"], // 対応する言語を列挙します
    localeDetection: true, // 言語検出を有効にする
  },
  localePath: path.resolve("./public/locales"), // 言語ファイルのパス
};
