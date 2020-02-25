"use babel";

const COURSE_TYPES = {
  DARWIN: { courseType: 1, apiType: 1, courseName: "DARWIN" },
  LT: { courseType: 2, apiType: 2, courseName: "LT" },
  PT: { courseType: 3, apiType: 3, courseName: "PT" },
  OCC: { courseType: 4, apiType: 4, courseName: "OCC" },
  BE: { courseType: 4, apiType: 5, courseName: "BE" },
  PILOT: { courseType: 4, apiType: 6, courseName: "PILOT" },
  PHONICS: { courseType: 5, apiType: 7, courseName: "PHONICS" },
  BELL: { courseType: 6, apiType: 8, courseName: "BELL" },
  TOURISM: { courseType: 1, apiType: 9, courseName: "TOURISM" },
  LINGOCHAMP: { courseType: 7, apiType: 10, courseName: "LINGOCHAMP" },
  KION: { courseType: 9, apiType: 11, courseName: "KION" },
  "KION EXAM": { courseType: 10, apiType: 12, courseName: "KION EXAM" },
  "KION EXAM V2": { courseType: 12, apiType: 16, courseName: "KION EXAM V2" },
  "KION BOOSTER": { courseType: 13, apiType: 16, courseName: "KION BOOSTER" },
  "DARWIN BUSINESS": {
    courseType: 1,
    apiType: 9,
    courseName: "DARWIN BUSINESS"
  },
  TELIS: { courseType: 11, apiType: 14, courseName: "TELIS" },
  "DARWIN HIFI": { courseType: 1, apiType: 15, courseName: "DARWIN HIFI" },
  "DARWIN HOMEWORK": {
    courseType: 1,
    apiType: 17,
    courseName: "DARWIN HOMEWORK"
  },
  AIX: { courseType: 15, apiType: 18, courseName: "AIX" },
  "SPROUT DAILY READERS": {
    courseType: 16,
    apiType: 19,
    courseName: "SPROUT DAILY READERS"
  },
  "Darwin PvP": { courseType: 1, apiType: 20, courseName: "Darwin PvP" }
};

export default COURSE_TYPES;
