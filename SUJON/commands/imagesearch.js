module.exports.config = {

  name: "imgs",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Search an Image",
  commandCategory: "image",
  usages: "imagesearch [text]",
  cooldowns: 5,
  dependencies: {

     "axios":"",
     "fs-extra":"",
    "googlethis":"",
        "cloudscraper":""
  }
};




module.exports.run = async ({matches, event, api, extra, args}) => {

    const axios = global.nodemodule['axios'];
    const google = global.nodemodule["googlethis"];
const cloudscraper = global.nodemodule["cloudscraper"];
const fs = global.nodemodule["fs"];
try{
var query = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
  //let query = args.join(" ");
  api.sendMessage(`🧐 𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝙵𝙾𝚁 ${query}...`, event.threadID, event.messageID);

  let result = await google.image(query, {safe: false});
  if(result.length === 0) {
    api.sendMessage(`⚠️𝚈𝚘𝚞𝚛 𝚒𝚖𝚊𝚐𝚎 𝚜𝚎𝚊𝚛𝚌𝚑 𝚍𝚒𝚍 𝚗𝚘𝚝 𝚛𝚎𝚝𝚞𝚛𝚗 𝚊𝚗𝚢 𝚛𝚎𝚜𝚞𝚕𝚝⚠️ .`, event.threadID, event.messageID)
    return;
  }

  let streams = [];
  let counter = 0;

  console.log(result)

  for(let image of result) {
    // Only show 6 images
    if(counter >= 6)
      break;

    console.log(`${counter}: ${image.url}`);

    // Ignore urls that does not ends with .jpg or .png
    let url = image.url;
    if(!url.endsWith(".jpg") && !url.endsWith(".png"))
      continue;

   let path = __dirname + `/cache/search-image-${counter}.jpg`;
    let hasError = false;
    await cloudscraper.get({uri: url, encoding: null})
      .then((buffer) => fs.writeFileSync(path, buffer))
      .catch((error) => {
        console.log(error)
        hasError = true;
      });

    if(hasError)
      continue;

    console.log(`Pushed to streams: ${path}`) ;
    streams.push(fs.createReadStream(path).on("end", async () => {
      if(fs.existsSync(path)) {
        fs.unlink(path, (err) => {
          if(err) return console.log(err);

          console.log(`Deleted file: ${path}`);
        });
      }
    }));

    counter += 1;
  }

  api.sendMessage("✨𝚂𝚎𝚗𝚍𝚒𝚗𝚐 𝚜𝚎𝚊𝚛𝚌𝚑 𝚛𝚎𝚜𝚞𝚕𝚝...", event.threadID, event.messageID)

  let msg = {
    body: `╭────────✨🎀✨────────╮\n     ✨𝙸𝚖𝚊𝚐𝚎 𝚂𝚎𝚊𝚛𝚌𝚑 𝚁𝚎𝚜𝚞𝚕𝚝\n"${query}"\n\nFound: ${result.length} image${result.length > 1 ? 's' : ''}\nOnly showing: 6 images\n\n────────✨🎀✨────────`,
    attachment: streams
  };

  api.sendMessage(msg, event.threadID, event.messageID);
}catch(e){
  console.log("ERR: "+e)
  api.sendMessage("⚠️ERR: "+e, event.threadID, event.messageID);
}
};

