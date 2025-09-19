const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "tempmail",
  version: "2.0.0",
  hasPermission: 0,
  credits: "SHIFAT",
  description: "প্রতি ইউজারের জন্য আলাদা temp ইমেইল তৈরি ও ইনবক্স চেক",
  commandCategory: "utility",
  usages: ["tempmail", "tempmail checkmail"],
  cooldowns: 5
};

const userMailFolder = path.join(__dirname, 'tempmail_data');
if (!fs.existsSync(userMailFolder)) fs.mkdirSync(userMailFolder);

module.exports.run = async function ({ api, event, args }) {
  const userID = event.senderID;
  const threadID = event.threadID;
  const userFile = path.join(userMailFolder, `${userID}.json`);

  // ========== STEP 1: CHECKMAIL ==========
  if (args[0] === "checkmail") {
    if (!fs.existsSync(userFile)) {
      return api.sendMessage("Create a temp email first.: tempmail", threadID);
    }

    try {
      const { email, id } = JSON.parse(fs.readFileSync(userFile));
      const res = await axios.get(`https://smstome.com/api/email-messages?email_id=${encodeURIComponent(id)}`);
      const messages = res.data.data;

      if (messages.length === 0) {
        return api.sendMessage(`📭 ${email} এ No mail has arrived yet. Please try again later.।`, threadID);
      }

      const first = messages[0];
      const from = first.from_name;
      const subject = first.subject;
      const msg = first.message || "বার্তা নেই";
      const attachmentUrl = first.attachments[0]?.link;

      if (attachmentUrl) {
        const image = await axios.get(attachmentUrl, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${userID}_mail.jpg`);
        fs.writeFileSync(imgPath, Buffer.from(image.data, 'binary'));

        await api.sendMessage({
          body: `📧 মেইল পাওয়া গেছে:\n👤 প্রেরক: ${from}\n📌 বিষয়: ${subject}\n💬 বার্তা: ${msg}`,
          attachment: fs.createReadStream(imgPath)
        }, threadID);

        fs.unlinkSync(imgPath);
      } else {
        await api.sendMessage(`📧 নতুন মেইল:\n👤 প্রেরক: ${from}\n📌 বিষয়: ${subject}\n💬 বার্তা: ${msg}`, threadID);
      }

    } catch (err) {
      console.error(err);
      return api.sendMessage(" There is a problem checking mail. Please try again later.।", threadID);
    }

    return;
  }

  // ========== STEP 2: CREATE NEW TEMPMAIL ==========
  if (fs.existsSync(userFile)) {
    const { email } = JSON.parse(fs.readFileSync(userFile));
    return api.sendMessage(` You have already created a temp email:\n📨 ${email}\n\n Sign up to receive new emails: tempmail checkmail`, threadID);
  }

  try {
    const res = await axios.get('https://smstome.com/api/get-random-email?device_id=QQ3A.200705.002');
    const data = res.data.data;

    const email = data.email;
    const id = data.id;

    fs.writeFileSync(userFile, JSON.stringify({ email, id }));

    api.sendMessage(`🧾 Your new temp email has been created.:\n📨 ${email}\n🆔 Mail ID: ${id}\n\nℹ️ Now put this email on any site and write it later.:\n👉 tempmail checkmail`, threadID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Failed to create email. Please try again later.", threadID);
  }
};


