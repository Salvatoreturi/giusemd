import { existsSync, promises as _0x4053a6 } from 'fs';
import _0x154140 from 'path';
const handler = async (_0x242462, {
  conn: _0x3de9bb,
  usedPrefix: _0x5601c8
}) => {
  if (global.conn.user.jid !== _0x3de9bb.user.jid) {
    return _0x3de9bb.sendMessage(_0x242462.chat, {
      'text': "*Utilizza questo comando direttamente nel numero principale del Bot.*"
    }, {
      'quoted': _0x242462
    });
  }
  await _0x3de9bb.sendMessage(_0x242462.chat, {
    'text': "ⓘ 𝐑𝐢𝐩𝐫𝐢𝐬𝐭𝐢𝐧𝐨 𝐝𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨..."
  }, {
    'quoted': _0x242462
  });
  try {
    if (!existsSync("./Sessioni/")) {
      return await _0x3de9bb.sendMessage(_0x242462.chat, {
        'text': "*La cartella Sessioni non esiste o e' vuota.*"
      }, {
        'quoted': _0x242462
      });
    }
    const _0x3c4101 = await _0x4053a6.readdir("./Sessioni/");
    let _0x13f91a = 0x0;
    for (const _0x365736 of _0x3c4101) {
      if (_0x365736 !== "creds.json") {
        await _0x4053a6.unlink(_0x154140.join("./Sessioni/", _0x365736));
        _0x13f91a++;
      }
    }
    if (_0x13f91a === 0x0) {
      await _0x3de9bb.sendMessage(_0x242462.chat, {
        'text': "ⓘ 𝐋𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐬𝐨𝐧𝐨 𝐯𝐮𝐨𝐭𝐞 ‼️"
      }, {
        'quoted': _0x242462
      });
    } else {
      await _0x3de9bb.sendMessage(_0x242462.chat, {
        'text': "ⓘ 𝐒𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐢 " + _0x13f91a + " 𝐚𝐫𝐜𝐡𝐢𝐯𝐢 𝐧𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢"
      }, {
        'quoted': _0x242462
      });
    }
  } catch (_0x5f33bf) {
    console.error('Err-ore', _0x5f33bf);
    await _0x3de9bb.sendMessage(_0x242462.chat, {
      'text': "Errore"
    }, {
      'quoted': _0x242462
    });
  }
  let _0xb6609d = global.db.data.nomedelbot || " ꧁ ĝ̽̓̀͑ỉ͔͖̜͌ư̡͕̭̇s̠҉͍͊ͅẹ̿͋̒̕ẹ̿͋̒̕ ꧂ 「 ᵇᵒᵗ 」 ";
  let _0xc3323b = {
    'key': {
      'participants': "0@s.whatsapp.net",
      'fromMe': false,
      'id': 'Halo'
    },
    'message': {
      'locationMessage': {
        'name': '' + _0xb6609d,
        'jpegThumbnail': await (await fetch("https://qu.ax/cSqEs.jpg")).buffer(),
        'vcard': "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
      }
    },
    'participant': '0@s.whatsapp.net'
  };
  await _0x3de9bb.sendMessage(_0x242462.chat, {
    'text': "ⓘ 𝐎𝐫𝐚 𝐬𝐚𝐫𝐚𝐢 𝐢𝐧 𝐠𝐫𝐚𝐝𝐨 𝐝𝐢 𝐥𝐞𝐠𝐠𝐞𝐫𝐞 𝐢 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐝𝐞𝐥 𝐛𝐨𝐭"
  }, {
    'quoted': _0xc3323b
  });
};
handler.help = ['del_reg_in_session_owner'];
handler.tags = ["owner"];
handler.command = /^(deletession|ds|clearallsession)$/i;
handler.admin = true;
export default handler;
