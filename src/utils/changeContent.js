export const changeContent = (lang, en, ru, uz) => {
  if (lang === "en") {
    return en;
  } else if (lang === "ru") {
    return ru;
  } else {
    return uz;
  }
};
