"use babel";

const env = atom.config.get("language-coursescript.useStagingApi")
  ? "staging"
  : "prod";

const API_URLS = {
  prod: {
    parse: "https://cms.llsapp.com/v1/coursescript/parse",
    asset: "https://cms.llsapp.com/v1/asset/"
  },
  staging: {
    parse: "https://stag-cms.thellsapi.com/v1/coursescript/parse",
    asset: "https://stag-cms.thellsapi.com/v1/asset/"
  }
};

export default API_URLS[env];
