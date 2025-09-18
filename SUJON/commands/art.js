const axios = require('axios');
const fs = require('fs-extra');
const FormData = require('form-data');

module.exports.config = {
 name: "art",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 description: "Apply AI art style (anime)",
 commandCategory: "editing",
 usages: "reply to an image",
 cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
 const path = __dirname + `/cache/artify.jpg`;
 const { messageReply, threadID, messageID } = event;

 if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
 return api.sendMessage("✨অনুগ্রহ করে কোনো একটি ছবির রিপ্লাই দিন✨", threadID, messageID);
 }

 const url = messageReply.attachments[0].url;

 try {
 const response = await axios.get(url, { responseType: "arraybuffer" });
 fs.writeFileSync(path, Buffer.from(response.data));

 const form = new FormData();
 form.append("image", fs.createReadStream(path));

 const apiRes = await axios.post(
 "https://art-api-97wn.onrender.com/artify?style=anime",
 form,
 { headers: form.getHeaders(), responseType: "arraybuffer" }
 );

 fs.writeFileSync(path, apiRes.data);

 api.sendMessage({
 body: "✨𝙰𝚁𝚃𝙸𝙵𝚈 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳✨",
 attachment: fs.createReadStream(path)
 }, threadID, () => fs.unlinkSync(path), messageID);

 } catch (err) {
 console.error("🚨Artify Error🚨:", err.message);
 api.sendMessage("✨কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।✨", threadID, messageID);
 }
};
