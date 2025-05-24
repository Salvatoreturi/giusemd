// Questo comando è stato creato da youns sotto proposta di Google Traduttore
import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        await m.reply("Che vuoi?");
        return;
    }

    try {
        conn.sendPresenceUpdate('composing', m.chat);

        let prompt = `Sei un bot su WhatsApp programmato da Giuse. Ti chiami giusemd e la tua repository è "https://github.com/giuse1106/giusemd" Devi avere appunto un carattere carino da ragazzo 14enne. Devi rispondere in modo da sembrare veramente alya, qualsiasi cosa io dica o chieda.  (scrivi > © ᴘᴏᴡᴇʀᴇᴅ ʙʏ *GiuseMD* alla fine dopo ogni risposta): "${text}"`;

        var apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(prompt)}`);
        var res = await apii.json();

        if (res && res.result) {
            await m.reply(res.result);
        } else {
            await m.reply("Non ho ricevuto una risposta valida dall'API. Riprova più tardi.");
        }
    } catch (e) {
        await conn.reply(
            m.chat,
            `Si è verificato un errore. Per favore, riprova più tardi.\n\n#report ${usedPrefix + command}\n\n${wm}`,
            m
        );
        console.error(`Errore nel comando ${usedPrefix + command}:`, e);
    }
};

handler.command = ['alya', 'Alya'];
handler.help = ['alya <testo>', 'Alya <testo>'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;
