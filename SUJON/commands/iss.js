const request = require('request');

module.exports.config = {
  name: "iss",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "See the coordinates that the spacecraft is in Lac",
  commandCategory: "Tool",
  usages: "iss",
  cooldowns: 5,
  dependencies: {
    "request": ""
  }
};

module.exports.run = function({
  api,
  event,
  args,
  client,
  __GLOBAL
}) {
  return request(`http://api.open-notify.org/iss-now.json`, (err, response, body) => {
    if (err) throw err;
    var jsonData = JSON.parse(body);
    api.sendMessage(` ✨𝙲𝚞𝚛𝚛𝚎𝚗𝚝 𝚕𝚘𝚌𝚊𝚝𝚒𝚘𝚗 𝚘𝚏 𝙸𝚗𝚝𝚎𝚛𝚗𝚊𝚝𝚒𝚘𝚗𝚊𝚕 𝚂𝚙𝚊𝚌𝚎 𝚂𝚝𝚊𝚝𝚒𝚘𝚗🌌🌠🌃 \n-latitude: ${jsonData.iss_position.latitude}\n- Longitude: ${jsonData.iss_position.longitude}`, event.threadID, event.messageID);
  });
}
