const moment = require("moment-timezone");

module.exports.config = {
 name: "age",
 version: "2.0.0",
 hasPermission: 0,
 credits: "Islamic chat",
 description: "সঠিকভাবে বয়স গণনা করুন",
 usePrefix: true,
 commandCategory: "utility",
 usages: "[dd/mm/yyyy]",
 cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
 try {
 const input = args[0];
 if (!input) return api.sendMessage("❌ দয়া করে আপনার জন্ম তারিখ DD/MM/YYYY ফরম্যাটে লিখুন।", event.threadID);

 const [day, month, year] = input.split("/").map(i => parseInt(i));
 if (!day || day < 1 || day > 31) return api.sendMessage("❌ দিনের সংখ্যা ভুল হয়েছে!", event.threadID);
 if (!month || month < 1 || month > 12) return api.sendMessage("❌ মাসের সংখ্যা ভুল হয়েছে!", event.threadID);
 if (!year || year > new Date().getFullYear()) return api.sendMessage("❌ বছরের সংখ্যা ভুল হয়েছে!", event.threadID);

 const now = moment.tz("Asia/Dhaka");
 const birthDate = moment.tz(`${year}-${month}-${day}`, "YYYY-MM-DD", "Asia/Dhaka");
 
 if (!birthDate.isValid()) {
 return api.sendMessage("❌ অবৈধ জন্ম তারিখ! দয়া করে সঠিক তারিখ লিখুন।", event.threadID);
 }

 if (now.isBefore(birthDate)) {
 return api.sendMessage("❌ জন্ম তারিখ ভবিষ্যতের হতে পারে না!", event.threadID);
 }

 // Calculate total duration in different units
 const totalSeconds = now.diff(birthDate, 'seconds');
 const totalMinutes = Math.floor(totalSeconds / 60);
 const totalHours = Math.floor(totalMinutes / 60);
 const totalDays = Math.floor(totalHours / 24);
 const totalWeeks = Math.floor(totalDays / 7);
 const totalMonths = now.diff(birthDate, 'months');
 const totalYears = now.diff(birthDate, 'years');

 // Calculate remaining units
 const remainingMonths = totalMonths % 12;
 const remainingDays = Math.floor(now.diff(birthDate.add(totalMonths, 'months'), 'days'));
 const remainingHours = now.diff(birthDate.add(remainingDays, 'days'), 'hours');
 const remainingMinutes = now.diff(birthDate.add(remainingHours, 'hours'), 'minutes');
 const remainingSeconds = now.diff(birthDate.add(remainingMinutes, 'minutes'), 'seconds');

 const message = 
`•┄┅════❁🌺❁════┅┄•

┏━━━━━━━━━━━━━━━━━┓
┃  🕌𝗛 𝗜 𝗡 𝗔 𝗧 𝗔🕌
┗━━━━━━━━━━━━━━━━━┛

📅 আপনার জন্ম তারিখ: ${day}/${month}/${year}

🕰️ বয়সের বিশদ বিবরণ:
┏━━━━━━━━━━━━━━━━━┓
┃ 📅 বছর: ${totalYears} বছর ${remainingMonths} মাস
┃ 🌙 মোট মাস: ${totalMonths} মাস
┃ 📆 মোট সপ্তাহ: ${totalWeeks} সপ্তাহ
┃ 🗓️ মোট দিন: ${totalDays} দিন
┃ ⏳ মোট ঘন্টা: ${totalHours} ঘন্টা
┃ 🕒 মোট মিনিট: ${totalMinutes} মিনিট
┃ ⏱️ মোট সেকেন্ড: ${totalSeconds} সেকেন্ড
┗━━━━━━━━━━━━━━━━━┛

✨ আল্লাহ আপনার عمر বরকতময় করুন! আমীন ✨`;

 return api.sendMessage(message, event.threadID);

 } catch (error) {
 console.error(error);
 return api.sendMessage("❌ বয়স গণনা করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।", event.threadID);
 }
};
