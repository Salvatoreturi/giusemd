import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
// import config from '../../config.js'; // Non è più necessario per il controllo owner qui

let handler = async (m, { conn, text, isOwner }) => {
    // const ownerNumber = config.owner[0][0] + '@s.whatsapp.net'; // Rimuovi questa linea
    // if (m.sender !== ownerNumber) { // Rimuovi questo blocco if
    //     m.reply('Solo il proprietario può usare questo comando.');
    //     return;
    // }

    m.reply('Tentativo di aggiornare i plugin dalla repository...');

    const repoUrl = 'https://api.github.com/repos/giuse1106/giusemd/contents/plugins';

    try {
        const response = await fetch(repoUrl);
        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error('Errore: Risposta API di GitHub in formato inaspettato.');
            m.reply('Errore durante il recupero della lista dei plugin.');
            return;
        }

        let aggiornati = 0;
        let falliti = 0;

        for (const fileInfo of data) {
            if (fileInfo.type === 'file' && fileInfo.name.endsWith('.js')) {
                const fileUrl = fileInfo.download_url;
                const filePath = path.join('./plugins', fileInfo.name);

                try {
                    const fileResponse = await fetch(fileUrl);
                    const fileContent = await fileResponse.text();
                    await fs.writeFile(filePath, fileContent, 'utf8');
                    aggiornati++;
                    console.log(`Aggiornato: ${fileInfo.name}`);
                } catch (error) {
                    console.error(`Errore durante il download o la scrittura di ${fileInfo.name}:`, error);
                    falliti++;
                }
            }
        }

        m.reply(`Aggiornamento completato.\nPlugin aggiornati: ${aggiornati}\nPlugin falliti: ${falliti}`);
        console.log('Riavvia il bot per applicare le modifiche.');

    } catch (error) {
        console.error('Errore durante la comunicazione con GitHub API:', error);
        m.reply('Errore durante l\'aggiornamento dei plugin.');
    }
};

handler.help = ['aggiorna'];
handler.tags = ['owner'];
handler.command = /^aggiorna$/i;
handler.owner = true; // Affidati a questo controllo

export default handler;
