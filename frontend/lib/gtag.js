export const GA_ID = "G-L0RKRLMSVW";

export const pageview = (url) => {
  window.gtag("config", GA_ID, {
    page_path: url,
  });
};