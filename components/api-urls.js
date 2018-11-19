'use babel';

const env = atom.config.get('language-coursescript.environment')

const API_URLS = {
  Prod: {
    parse: 'https://cms.llsapp.com/v1/coursescript/parse',
    asset: 'https://cms.llsapp.com/v1/asset/',
  },
  Staging: {
    parse: 'https://stag-cms.thellsapi.com/v1/coursescript/parse',
    asset: 'https://stag-cms.thellsapi.com/v1/asset/',
  },
}

export default API_URLS[env]
