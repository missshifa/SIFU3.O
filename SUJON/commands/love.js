const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

// 📁 মডিউল কনফিগারেশন
module.exports.config = {
 name: "love2",
 version: "7.3.1",
 hasPermssion: 0,
 credits: "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 description: "Get Pair From Mention",
 commandCategory: "img",
 usages: "[@mention]",
 cooldowns: 5,
 dependencies: {
 "axios": "",
 "fs-extra": "",
 "path": "",
 "jimp": ""
 }
};

// 📥 ইমেজ ডাউনলোড ইউটিলিটি
const downloadFile = async (url, filePath) => {
 const response = await axios.get(url, { responseType: "arraybuffer" });
 fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));
};

// 📦 লোড টাইমে প্রয়োজনীয় ফাইল তৈরি
module.exports.onLoad = async () => {
 const dir = path.join(__dirname, "cache", "canvas");
 const imagePath = path.join(dir, "arr2.png");
 if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
 if (!fs.existsSync(imagePath)) {
 await downloadFile("https://i.imgur.com/iaOiAXe.jpeg", imagePath);
 }
};

// 🎨 বৃত্তাকার অ্যাভাটার
async function circle(image) {
 image = await jimp.read(image);
 image.circle();
 return await image.getBufferAsync("image/png");
}

// 🖼️ চূড়ান্ত ইমেজ জেনারেটর
async function makeImage({ one, two }) {
 const root = path.join(__dirname, "cache", "canvas");
 const background = await jimp.read(path.join(root, "arr2.png"));

 const avatarOnePath = path.join(root, `avt_${one}.png`);
 const avatarTwoPath = path.join(root, `avt_${two}.png`);
 const finalPath = path.join(root, `love2_${one}_${two}.png`);

 const avatarOneData = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
 fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneData, "utf-8"));

 const avatarTwoData = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
 fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoData, "utf-8"));

 const circleOne = await jimp.read(await circle(avatarOnePath));
 const circleTwo = await jimp.read(await circle(avatarTwoPath));

 background.composite(circleOne.resize(200, 200), 70, 110);
 background.composite(circleTwo.resize(200, 200), 465, 110);

 const finalBuffer = await background.getBufferAsync("image/png");
 fs.writeFileSync(finalPath, finalBuffer);

 fs.unlinkSync(avatarOnePath);
 fs.unlinkSync(avatarTwoPath);

 return finalPath;
}

// 🧠 রান টাইম ইভেন্ট
module.exports.run = async function ({ event, api }) {
 const { threadID, messageID, senderID, mentions } = event;
 const mention = Object.keys(mentions);

 const captions = [
 "💖 ⎯͢⎯⃝🩷😽 তুমি আমার চোখেতে সরলতার উপমা ⎯͢⎯⃝🩷🐰🍒",
 "💖 🥺❤️ প্রিয়.....! 😊\nকখনো কাঁদাও, কখনো হাসাও,\nআবার কখনো এমন ভালোবাসা দাও,\nযেন পৃথিবীর সব সুখ তোমার মাঝে খুঁজে পাই...! 💔❤️",
 "বিচ্ছেদের পরেও যোগাযোগ রাখার নামই হচ্ছে মায়া ____💖 💗🌺",
 "𝐏𝐞𝐨𝐩𝐥𝐞'𝐬 𝐦𝐞𝐦𝐨𝐫𝐢𝐞𝐬 𝐚𝐫𝐞 𝐦𝐨𝐫𝐞 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥 𝐭𝐡𝐚𝐧 𝐩𝐞𝐨𝐩𝐥𝐞'𝐬...\nমানুষে'র থেকে মানুষে'র স্মৃতি বেশি আপন হয়,\nমানুষ ছেড়ে যায়, কিন্তু স্মৃতি নয়-!!",
 "ইচ্ছে 'গুলো শব্দহীন...!!\nভাবনা সে-তো প্রতি দিন..!\nকল্পনার রং যদিও ঘন,\nকিন্তু বাস্তবতা ভীষণ কঠিন....!! 🌸💔",
 "ভালোবাসা মানে কেবল প্রেম নয়,\nবরং এমন একজন — যার হাসিতেই সকাল শুরু হয়, আর কান্নায় রাত ফুরায়!💖 💌🩵",
 "যে সম্পর্ক চোখে দেখা যায় না,\nতবুও মন জুড়ে থাকে — সেটাই সবচেয়ে সত্য ভালোবাসা!💖 🌙🥺",
 "তুমি হয়তো দূরে আছো,\nকিন্তু আমার প্রতিটা অনুভূতির ঠিকানা এখনো তুমি!💖 💞🕊️",
 "চোখের ভাষা বোঝে যে, সে-ই প্রিয় মানুষ।\nকারণ ভালোবাসা কখনো শব্দে নয়, দৃষ্টিতে প্রকাশ পায়!💖 🌸✨",
 "তুমি কেবল মানুষ না,\nতুমি একটা মিষ্টি অভ্যাস — যাকে ছাড়াও বাঁচা যায় না!💖 🐻🌈"
 ];

 if (!mention[0]) {
 return api.sendMessage("একজনকে মেনশন কর বলদ 😒!", threadID, messageID);
 }

 const one = senderID;
 const two = mention[0];

 try {
 const imagePath = await makeImage({ one, two });
 const message = {
 body: captions[Math.floor(Math.random() * captions.length)],
 attachment: fs.createReadStream(imagePath)
 };
 return api.sendMessage(message, threadID, () => fs.unlinkSync(imagePath), messageID);
 } catch (err) {
 console.error("🥲love2 মডিউলে সমস্যা:", err);
 return api.sendMessage(" 🤧ইমেজ তৈরি করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করো!", threadID, messageID);
 }
};
