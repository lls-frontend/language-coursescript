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
  "DARWIN BUSINESS": {
    courseType: 1,
    apiType: 9,
    courseName: "DARWIN BUSINESS"
  },
  "DARWIN EXTENSION": { courseType: 1, apiType: 26, courseName: "DARWIN EXTENSION" },
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
  "Darwin PvP": { courseType: 1, apiType: 20, courseName: "Darwin PvP" },
  "SPROUT WORD COURSE": {
    courseType: 17,
    apiType: 21,
    courseName: "SPROUT DAILY WORDS"
  },
  "SPROUT EXTENSION":{
    courseType: 18,
    apiType: 22,
    courseName: "SPROUT EXTENSION"
  },
  "SPROUT GOODNIGHT": {
    courseType: 18,
    apiType: 23,
    courseName: "SPROUT GOODNIGHT"
  },
  "OL SHORT VIDEO": { courseType: 19, apiType: 24, courseName: "OL SHORT VIDEO" },
  "SPROUT COMPAT READERS": {
    courseType: 20,
    apiType: 28,
    courseName: "SPROUT_COMPATRDR",
  },
  "OL LISTENING": {
    courseType: 1, apiType: 29, courseName: "OL LISTENING" 
  }
};

export default COURSE_TYPES;
