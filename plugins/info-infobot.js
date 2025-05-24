import { cpus, totalmem, freemem, platform } from 'os'
import speed from 'performance-now'
import { sizeFormatter } from 'human-readable'
import ws from 'ws'
import fetch from 'node-fetch'
import fs from 'fs';
import path from 'path';

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

const handler = async (m, { conn, usedPrefix }) => {
  const uniqueUsers = new Map()

  global.conns.forEach(c => {
    if (c.user && c.ws?.socket?.readyState !== ws.CLOSED) {
      uniqueUsers.set(c.user.jid, c)
    }
  })

  const totalUsers = uniqueUsers.size
  const totalreg = Object.keys(global.db.data.users).length
  const totalbots = Object.keys(global.db.data.settings).length
  const totalStats = Object.values(global.db.data.stats).reduce((t, s) => t + s.total, 0)
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  const groups = chats.filter(([id]) => id.endsWith('@g.us'))
  const totalChats = Object.keys(global.db.data.chats).length

  const pluginsDir = './plugins';
  let totalPlugins = 0;

  try {
    const files = fs.readdirSync(pluginsDir);
    totalPlugins = files.filter(file => file.endsWith('.js')).length;
  } catch (err) {
    console.error("Errore durante la lettura della cartella plugins:", err);
    totalPlugins = 'Errore';
  }

  const cpusInfo = cpus().map(cpu => {
    cpu.total = Object.values(cpu.times).reduce((a, b) => a + b, 0)
    return cpu
  })

  const cpu = cpusInfo.reduce((acc, cpu, _, { length }) => {
    acc.total += cpu.total
    acc.speed += cpu.speed / length
    acc.times.user += cpu.times.user
    acc.times.nice += cpu.times.nice
    acc.times.sys += cpu.times.sys
    acc.times.idle += cpu.times.idle
    acc.times.irq += cpu.times.irq
    return acc
  }, {
    speed: 0,
    total: 0,
    times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
  })

  let _muptime
  if (process.send) {
    process.send('uptime')
    _muptime = await new Promise(resolve => {
      process.once('message', resolve)
      setTimeout(resolve, 1000)
    }) * 1000
  }

  let uptime = clockString(_muptime)
  let timestamp = speed()
  let latency = speed() - timestamp

  const text = `
> *🤖 INFO BOT*

🧩 *Prefisso:* \`${usedPrefix}\`
📦 *Plugin:* ${totalPlugins}
🤝 *Sub-Bot attivi:* ${totalUsers}
👤 *Utenti registrati:* ${formatNumber(totalreg)}
💬 *Gruppi registrati:* ${formatNumber(totalChats)}
📈 *Comandi eseguiti:* ${formatNumber(totalStats)}

> 💻 *System*

💻 *Piattaforma:* ${platform()}
⏱️ *Uptime:* ${uptime}
🧠 *Velocità:* ${latency.toFixed(2)} ms
📊 *RAM:* ${format(totalmem() - freemem())} / ${format(totalmem())}
📗 *RAM Libera:* ${format(freemem())}
🔗 *Status:* https://stats.uptimerobot.com/fsZ8sFRH1v

`.trim()

  // Link immagine
  const imgURL = 'https://i.postimg.cc/hGTf4J7Z/IMG-20250405-WA0152.jpg'
  const thumb = await fetch(imgURL).then(res => res.buffer())

  const locationFake = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'info-bot',
    },
    message: {
      locationMessage: {
        name: "🌕 |几千ㄖ 乃ㄖㄒ 💫",
        jpegThumbnail: thumb,
      },
    },
    participant: '0@s.whatsapp.net',
  }

  await conn.sendMessage(m.chat, {
    text,
    contextInfo: {
      externalAdReply: {
        title: "🤖 🄶🄸🅄🅂🄴 • 🄼🄳",
        body: "Sistema & statistiche live",
        thumbnail: thumb,
        sourceUrl: "https://github.com/Giuse1106/giusemd", // opzionale
        mediaType: 1,
        renderLargerThumbnail: false,
      }
    }
  }, { quoted: locationFake })
}

function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d + 'G', h + 'H', m + 'M', s + 'S'].join(' ')
}

handler.help = ['info']
handler.tags = ['main']
handler.command = ['infobot']

export default handler
