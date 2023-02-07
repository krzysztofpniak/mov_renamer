const fs = require("fs");
const { execSync } = require("child_process");
const R = require("ramda");
const moment = require("moment");

const dir = "/Users/krzysztofpniak/Downloads/Pola2/";

const files = R.pipe(
  fs.readdirSync,
  R.map(R.concat(dir)),
  R.filter(R.pipe(R.toLower, R.endsWith(".mov")))
)(dir);

const getMetaData = R.pipe(
  (filename) => `ffprobe -v quiet -show_format -print_format json ${filename}`,
  (cmd) =>
    execSync(cmd, {
      encoding: "utf-8",
    }),
  JSON.parse,
  R.prop("format")
);

const getCreationDate = R.pipe(
  getMetaData,
  R.path(["tags", "creation_time"]),
  (date) => moment(date).format("YYYY-MM-DD HHmmss")
);

const getNewName = R.pipe(getCreationDate, (date) => `${dir}${date}.mov`);

R.forEach((f) => fs.renameSync(f, getNewName(f)), files);
