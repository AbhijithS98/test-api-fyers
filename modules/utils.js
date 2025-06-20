const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../responseDatas");
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

function saveJSON(filename, data) {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved ${filename}`);
}

module.exports = { saveJSON };
