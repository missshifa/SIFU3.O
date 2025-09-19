const request = require("request");
const fs = require("fs");

module.exports.config = {
 name: "random",
 version: "1.0.0",
 hasPermission: 0,
 credits: "Cyber-Sujon",
 description: "Send a random sad video by name",
 commandCategory: "media",
 usages: "/random <name>",
 cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
 const axios = require("axios");
 const nameParam = args.join(" ");
 if (!args[0]) {
 return api.sendMessage(
 " ✨Please enter a name.\n✨Example: .random shifat",
 event.threadID,
 event.messageID
 );
 }

 try {
 const apis = await axios.get("https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json");
 const n = apis.data.api;
 const res = await axios.get(`${n}/video/random?name=${encodeURIComponent(nameParam)}`);

 const videoUrl = res.data.url;
 const name = res.data.name;
 const cp = res.data.cp;
 const ln = res.data.count;
 const filePath = __dirname + "/cache/video.mp4";

 const file = fs.createWriteStream(filePath);
 request(videoUrl)
 .pipe(file)
 .on("close", () => {
 return api.sendMessage({
 body:
 `${cp}\n\n` +
 `🎞️ মোট ভিডিও: ${ln}টি\n` +
 `➕ এই ভিডিওটি API-তে যুক্ত করেছেন: ${name}\n\n` +
 `🤖 Powered by ✨ 𝐇 𝐈 𝐍 𝐀 𝐓 𝐀 ✨`,
 attachment: fs.createReadStream(filePath)
 }, event.threadID, event.messageID);
 });

 } catch (err) {
 console.error(err);
 return api.sendMessage("😢 No videos found with this name....💔", event.threadID, event.messageID);
 }
};
