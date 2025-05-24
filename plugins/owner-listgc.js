// cc to giuse

const handler = async (m, { conn }) => {
  // Assicurati che 'global.db' sia accessibile e contenga i dati dei chat
  // Se 'global.db' non è definito o non ha 'data.chats', potresti volerlo inizializzare
  // Esempio: if (!global.db || !global.db.data) global.db = { data: { chats: {} } };

  const user = global.db.data.users; // Questa variabile 'user' non sembra essere usata, puoi rimuoverla se non serve
  const nomebot = "IL TUO BOT"; // <<<<< ASSICURATI DI DEFINIRE O PASSARE QUESTA VARIABILE

  let txt = `𝐋𝐈𝐒𝐓𝐀 𝐃𝐄𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐃𝐈 ${nomebot}`;
  const fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  };

  const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);

  // Ordina i gruppi in base al numero di messaggi (se 'db.data.chats' è disponibile)
  const groupsSortedByMessages = [...groups].sort((a, b) => {
    // Assicurati che 'global.db.data.chats' sia definito prima di accedervi
    const groupMessagesA = global.db.data.chats?.[a[0]]?.messaggi || 0;
    const groupMessagesB = global.db.data.chats?.[b[0]]?.messaggi || 0;
    return groupMessagesB - groupMessagesA;
  });

  // Sintassi corretta, rimosso il `;` di troppo
  txt += `\n\n➣ 𝐓𝐨𝐭𝐚𝐥𝐞 𝐆𝐫𝐮𝐩𝐩𝐢: ${groupsSortedByMessages.length}\n`;

  for (let i = 0; i < groupsSortedByMessages.length; i++) {
    const [jid, chat] = groupsSortedByMessages[i];

    // Recupero dei metadati del gruppo in modo più robusto
    let groupMetadata = {};
    try {
      groupMetadata = await conn.groupMetadata(jid);
    } catch (e) {
      console.error(`Errore nel recupero metadati per ${jid}:`, e);
      // Se c'è un errore, continua con i metadati di default
    }

    const participants = groupMetadata.participants || [];
    const bot = participants.find((u) => conn.decodeJid(u.id) === conn.user.jid) || {};
    const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'; // Baileys usa 'admin' o 'superadmin'
    const totalParticipants = participants.length;

    // Recupero del nome del gruppo
    let groupName = 'Nome non disponibile';
    try {
      groupName = await conn.getName(jid);
    } catch (e) {
      console.error(`Errore nel recupero nome per ${jid}:`, e);
      // Se c'è un errore, continua con il nome di default
    }

    // Recupero dei messaggi del gruppo da global.db.data.chats
    const groupMessages = global.db.data.chats?.[jid]?.messaggi || 0;

    // Recupero del link di invito al gruppo
    let groupInviteLink = 'Non sono admin';
    if (isBotAdmin) {
      try {
        groupInviteLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(jid)}`;
      } catch (e) {
        console.error(`Errore nel recupero link invito per ${jid}:`, e);
        groupInviteLink = 'Errore';
      }
    }

    // Aggiungi le informazioni al testo
    txt += `\n➣ 𝐧𝐮𝐦𝐞𝐫𝐨: ${i + 1}\n`;
    txt += `➣ 𝐧𝐨𝐦𝐞: ${groupName}\n`;
    txt += `➣ 𝐦𝐞𝐦𝐛𝐫𝐢: ${totalParticipants}\n`;
    txt += `➣ 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢: ${groupMessages}\n`;
    txt += `➣ 𝐚𝐝𝐦𝐢𝐧: ${isBotAdmin ? '✓' : '☓'}\n`;
    txt += `➣ 𝐢𝐝: ${jid}\n`;
    txt += `➣ 𝐥𝐢𝐧𝐤: ${groupInviteLink}\n`;
  }

  // Invia il testo raccolto
  m.reply(txt.trim());
}
handler.command = /^(listgc)$/i;
handler.owner = true;
export default handler;
