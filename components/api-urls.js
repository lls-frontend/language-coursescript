"use babel";

const env = atom.config.get("language-coursescript.useStagingApi")
  ? "staging"
  : "prod";

// const apiUrls = {
//   [Env.production]: 'https://cms.llsapp.com/v1',
//   [Env.develop]: 'https://dev-cms.thellsapi.com/v1', // 'https://stag-cms.thellsapi.com/v1',
// };

// const newApiUrls = {
//   [Env.production]: 'https://cms.llsapp.com/frontend/v1',
//   [Env.develop]: 'https://dev-cms.thellsapi.com/frontend/v1', //'https://stag-plat-cms.thellsapi.com/v1',
// };

const API_URLS = {
  prod: {
    parse: "https://cms.llsapp.com/v1/coursescript/parse",
    asset: "https://cms.llsapp.com/v1/asset/",
    bffAsset: "https://cms.llsapp.com/frontend/v1/atom/"
  },
  staging: {
    parse: "https://dev-cms.thellsapi.com/v1/coursescript/parse", // "https://stag-cms.thellsapi.com/v1/coursescript/parse",
    asset: "https://dev-cms.thellsapi.com/v1/asset/", // "https://stag-cms.thellsapi.com/v1/asset/",
    bffAsset: "https://dev-cms.thellsapi.com/frontend/v1/atom/" // "https://stag-plat-cms.thellsapi.com/v1/atom/assets/"
  }
};

export default API_URLS[env];
