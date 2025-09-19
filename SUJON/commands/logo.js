const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports.config = {
 name: "logo",
 version: "1.0.0",
 hasPermission: 0,
 credits: "CYBER SUJON",
 description: "Generate a custom CYBER BOT TAEM logo",
 commandCategory: "utility",
 usages: "[name]",
 cooldowns: 3
};

module.exports.run = async ({ api, event, args, Users }) => {
 const text = args.join(" ");
 const name = text || await Users.getNameUser(event.senderID);

 const framePath = path.join(__dirname, "templates", "cyber_frame.png");
 const fontPath = path.join(__dirname, "fonts", "CyberFont.ttf"); // তোমার পছন্দের ফন্ট এখানে বসাও
 const outputPath = path.join(__dirname, "cache", `${event.senderID}_logo.png`);

 if (!fs.existsSync(fontPath)) {
 return api.sendMessage(" ফন্ট ফাইল পাওয়া যায়নি! fonts ফোল্ডারে 'CyberFont.ttf' রাখো।", event.threadID);
 }

 registerFont(fontPath, { family: "CyberFont" });

 try {
 // ইউজারের প্রোফাইল পিক ডাউনলোড
 const avatarURL = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512`;
 const avatarPath = path.join(__dirname, "cache", `${event.senderID}_avatar.png`);
 const avatarData = (await axios.get(avatarURL, { responseType: "arraybuffer" })).data;
 fs.writeFileSync(avatarPath, Buffer.from(avatarData, "utf-8"));

 // ইমেজ লোড
 const frame = await loadImage(framePath);
 const avatar = await loadImage(avatarPath);

 const canvas = createCanvas(768, 768);
 const ctx = canvas.getContext("2d");

 // ব্যাকগ্রাউন্ড কালো
 ctx.fillStyle = "#000000";
 ctx.fillRect(0, 0, canvas.width, canvas.height);

 // প্রোফাইল ছবি গোল করে কাটা
 ctx.save();
 ctx.beginPath();
 ctx.arc(384, 384, 180, 0, Math.PI * 2, true);
 ctx.closePath();
 ctx.clip();
 ctx.drawImage(avatar, 204, 204, 360, 360);
 ctx.restore();

 // ফ্রেম বসাও
 ctx.drawImage(frame, 0, 0, 768, 768);

 // নিচে টেক্সট বসাও
 ctx.font = "bold 36px CyberFont";
 ctx.fillStyle = "#ffffff";
 ctx.textAlign = "left";
 ctx.fillText(name.toUpperCase(), 40, 360); // চাইলে adjust করতে পারো

 // ইমেজ সেভ করে পাঠাও
 const buffer = canvas.toBuffer("image/png");
 fs.writeFileSync(outputPath, buffer);

 api.sendMessage(
 {
 body: "✨ আপনার লোগো তৈরি হয়েছে!",
 attachment: fs.createReadStream(outputPath)
 },
 event.threadID,
 () => {
 fs.unlinkSync(outputPath);
 fs.unlinkSync(avatarPath);
 }
 );
 } catch (err) {
 console.error(err);
 api.sendMessage("🥺লোগো বানাতে সমস্যা হয়েছে!", event.threadID);
 }
};
