module.exports.config = {

 'name': "hack2",

 'version': "1.0.",

 'hasPermssion': 0x0,

 'credits': "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",

 'description': "experts",

 'commandCategory': "fb I'd hacking",

 'usages': "fake hake",

 'cooldowns': 0x0

};

module.exports.wrapText = (_0x18d1a3, _0x4fc262, _0x1b513e) => {

 return new Promise(_0x34738c => {

 if (_0x18d1a3.measureText(_0x4fc262).width < _0x1b513e) {

 return _0x34738c([_0x4fc262]);

 }

 if (_0x18d1a3.measureText('W').width > _0x1b513e) {

 return _0x34738c(null);

 }

 const _0x3590a2 = _0x4fc262.split(" ");

 const _0x2fb00c = [];

 let _0x53f2c7 = '';

 while (_0x3590a2.length > 0) {

 let _0x343129 = false;

 while (_0x18d1a3.measureText(_0x3590a2[0]).width >= _0x1b513e) {

 const _0x24d86e = _0x3590a2[0];

 _0x3590a2[0] = _0x24d86e.slice(0, -1);

 if (_0x343129) {

 _0x3590a2[1] = '' + _0x24d86e.slice(-1) + _0x3590a2[1];

 } else {

 _0x343129 = true;

 _0x3590a2.splice(1, 0, _0x24d86e.slice(-1));

 }

 }

 if (_0x18d1a3.measureText('' + _0x53f2c7 + _0x3590a2[0]).width < _0x1b513e) {

 _0x53f2c7 += _0x3590a2.shift() + " ";

 } else {

 _0x2fb00c.push(_0x53f2c7.trim());

 _0x53f2c7 = '';

 }

 if (_0x3590a2.length === 0) {

 _0x2fb00c.push(_0x53f2c7.trim());

 }

 }

 return _0x34738c(_0x2fb00c);

 });

};

module.exports.run = async function ({

 args: _0x2bc5e9,

 Users: _0xc9e7cb,

 Threads: _0x88f3d,

 api: _0x3ce027,

 event: _0x567418,

 Currencies: _0x94125

}) {

 const {

 loadImage: _0x3ed11d,

 createCanvas: _0x27f055

 } = require("canvas");

 const _0x58d026 = global.nodemodule["fs-extra"];

 const _0x1aead3 = global.nodemodule.axios;

 let _0x52a08a = __dirname + "/cache/background.png";

 let _0x24124d = __dirname + "/cache/Avtmot.png";

 var _0x39d922 = Object.keys(_0x567418.mentions)[0] || _0x567418.senderID;

 var _0x5561c6 = await _0xc9e7cb.getNameUser(_0x39d922);

 var _0xffcf3d = ["https://drive.google.com/uc?id=1_S9eqbx8CxMMxUdOfATIDXwaKWMC-8ox&export=download"];

 var _0x1952be = _0xffcf3d[Math.floor(Math.random() * _0xffcf3d.length)];

 let _0x1a2f5a = (await _0x1aead3.get("https://graph.facebook.com/" + _0x39d922 + "/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", {

 'responseType': "arraybuffer"

 })).data;

 _0x58d026.writeFileSync(_0x24124d, Buffer.from(_0x1a2f5a, "utf-8"));

 let _0x1d85c1 = (await _0x1aead3.get('' + _0x1952be, {

 'responseType': "arraybuffer"

 })).data;

 _0x58d026.writeFileSync(_0x52a08a, Buffer.from(_0x1d85c1, "utf-8"));

 let _0x314273 = await _0x3ed11d(_0x52a08a);

 let _0x3711b6 = await _0x3ed11d(_0x24124d);

 let _0xb95ecf = _0x27f055(_0x314273.width, _0x314273.height);

 let _0x86ba61 = _0xb95ecf.getContext('2d');

 _0x86ba61.drawImage(_0x314273, 0, 0, _0xb95ecf.width, _0xb95ecf.height);

 _0x86ba61.font = "400 23px Arial";

 _0x86ba61.fillStyle = "#1878F3";

 _0x86ba61.textAlign = "start";

 const _0x522f50 = await this.wrapText(_0x86ba61, _0x5561c6, 1160);

 _0x86ba61.fillText(_0x522f50.join("\n"), 136, 335);

 _0x86ba61.beginPath();

 _0x86ba61.drawImage(_0x3711b6, 57, 290, 66, 68);

 const _0x891a24 = _0xb95ecf.toBuffer();

 _0x58d026.writeFileSync(_0x52a08a, _0x891a24);

 _0x58d026.removeSync(_0x24124d);

 return _0x3ce027.sendMessage({

 'body': " ",

 'attachment': _0x58d026.createReadStream(_0x52a08a)

 }, _0x567418.threadID, () => _0x58d026.unlinkSync(_0x52a08a), _0x567418.messageID);

};
