const axios = require("axios");
// <<< পরিবর্তন ১: এখানে আমরা শুধুমাত্র ফাংশনটি লোড করছি
const currenciesData = require("../../includes/database/currencies");

async function getBaseApi() {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
    return res.data.mahmud;
  } catch (e) {
    console.error("Base API লোড করতে সমস্যা:", e);
    return null;
  }
}

module.exports.config = {
  name: "qz",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "SHIFAT (Fixed by Gemini)",
  description: "Random quiz খেলো",
  commandCategory: "game",
  usages: "[en/bn]",
  cooldowns: 5,
  envConfig: {
    rewardCoins: 500,
    rewardExp: 100
  }
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const input = (args[0] || "").toLowerCase();
    const category = input === "en" || input === "english" ? "english" : "bangla";

    const baseApi = await getBaseApi();
    if (!baseApi) {
      return api.sendMessage("❌ বেস API লোড হয়নি!", event.threadID, event.messageID);
    }

    const res = await axios.get(`${baseApi}/api/quiz?category=${category}`);
    const quiz = res.data;

    if (!quiz || !quiz.question) {
      return api.sendMessage("❌ এই ক্যাটাগরির জন্য কোনো Quiz পাওয়া যায়নি।", event.threadID, event.messageID);
    }

    const { question, correctAnswer, options } = quiz;
    const { a, b, c, d } = options;

    const quizMsg =
      `\n╭──✦ ${question}\n` +
      `├‣ 𝗔) ${a}\n` +
      `├‣ 𝗕) ${b}\n` +
      `├‣ 𝗖) ${c}\n` +
      `├‣ 𝗗) ${d}\n` +
      `╰──────────────────‣\n` +
      `𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐲𝐨𝐮𝐫 𝐚𝐧𝐬𝐰𝐞𝐫.`;

    api.sendMessage(quizMsg, event.threadID, (err, info) => {
      if (err) return console.error(err);

      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        correctAnswer
      });

      setTimeout(() => {
        // একটি try-catch ব্লক যোগ করা হলো কারণ মেসেজটি এর আগেই ডিলিট হয়ে যেতে পারে
        try {
            api.unsendMessage(info.messageID);
        } catch (e) {
            console.log("Quiz message might have been unsent already.");
        }
      }, 40000);
    }, event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ কুইজ লোড করতে সমস্যা হয়েছে, আবার চেষ্টা করো।", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { correctAnswer, author } = handleReply;

  if (event.senderID !== author) {
    return api.sendMessage("❌ এই কুইজ তোমার জন্য নয়।", event.threadID, event.messageID);
  }

  // <<< পরিবর্তন ২: এখানে আমরা currencies মডিউলটিকে ইনিশিয়ালাইজ করছি
  // এটি এখন usable (ব্যবহারযোগ্য)
  if (!global.models) {
      return api.sendMessage("❌ ডাটাবেস মডেল লোড হয়নি।", event.threadID, event.messageID);
  }
  const Currencies = currenciesData({ models: global.models });


  await api.unsendMessage(handleReply.messageID).catch(e => console.log("Reply message might have been unsent already."));
  
  const userAnswer = event.body.trim().toLowerCase();
  const { rewardCoins, rewardExp } = this.config.envConfig;

  if (userAnswer === correctAnswer.toLowerCase()) {
    try {
      // ✅ কয়েন/EXP অ্যাড করা
      await Currencies.increaseMoney(event.senderID, rewardCoins);
      await Currencies.increaseExp(event.senderID, rewardExp);

      api.sendMessage(
        `✅ সঠিক উত্তর!\nতুমি পেয়েছো ${rewardCoins} কয়েন এবং ${rewardExp} EXP 🎉`,
        event.threadID,
        event.messageID
      );
    } catch (dbError) {
        console.error("ডাটাবেসে পুরস্কার যোগ করতে সমস্যা:", dbError);
        api.sendMessage("✅ সঠিক উত্তর! কিন্তু পুরস্কার যোগ করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
    }
  } else {
    api.sendMessage(
      `❌ ভুল উত্তর!\nসঠিক উত্তর ছিল: ${correctAnswer}`,
      event.threadID,
      event.messageID
    );
  }
};
