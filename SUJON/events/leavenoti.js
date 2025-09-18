const moment = require("moment-timezone");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "2.0.1",
  credits: "CYBER SUJON",
  description: "Notify when a member leaves with media + short caption",
};

module.exports.onLoad = () => {
  const dir = path.join(__dirname, "cache", "leaveGif", "randomgif");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const leftID = event.logMessageData.leftParticipantFbId;
  const botID = api.getCurrentUserID();
  const threadID = event.threadID;

  if (leftID == botID) return;

  const threadData = global.data.threadData.get(threadID) || (await Threads.getData(threadID)).data;
  const userName = global.data.userName.get(leftID) || await Users.getNameUser(leftID);
  const isKicked = event.author != leftID;

  const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
  const hour = parseInt(moment.tz("Asia/Dhaka").format("HH"));
  const session = hour < 10 ? "𝙈𝙤𝙧𝙣𝙞𝙣𝙜" : hour <= 12 ? "𝘼𝙛𝙩𝙚𝙧𝙉𝙤𝙤𝙣" : hour <= 18 ? "𝙀𝙫𝙚𝙣𝙞𝙣𝙜" : "𝙉𝙞𝙜𝙝𝙩";
  const status = isKicked ? "managed" : "leave";

  // 🧾 ছোট ক্যাপশন এখানে
  let msg = (typeof threadData.customLeave === "undefined") ? 
  `{session} - {name} 𝙹𝙰 𝚅𝙰𝙶 𝚂𝙰𝙻𝙰 😗 \n 𝚃𝙾𝚁 𝙼𝙾𝚃𝙾 𝙰𝙱𝙰𝙻 𝙶𝚁𝙾𝚄𝙿 𝙰 𝙽𝙰 𝚃𝙷𝙰𝙺𝙰𝙸 𝚅𝙰𝙻𝙾 ✰\n\n✨{time}✨` : 
  threadData.customLeave;

  msg = msg
    .replace(/\{name}/g, userName)
    .replace(/\{type}/g, status)
    .replace(/\{session}/g, session)
    .replace(/\{time}/g, time);

  const mediaDir = path.join(__dirname, "cache", "leaveGif", "randomgif");
  const files = fs.readdirSync(mediaDir);
  let attachment = null;

  if (files.length > 0) {
    const chosenFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join(mediaDir, chosenFile);
    attachment = fs.createReadStream(filePath);
  }

  return api.sendMessage({ body: msg, attachment }, threadID);
};
