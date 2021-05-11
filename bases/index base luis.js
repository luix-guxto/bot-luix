const
{
  WAConnection,
  MessageType,
  Presence,
  MessageOptions,
  Mimetype,
  WALocationMessage,
  WA_MESSAGE_STUB_TYPES,
  ReconnectMode,
  ProxyAgent,
  GroupSettingChange,
  waChatKey,
  mentionedJid,
  processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal")
const moment = require("moment-timezone")
const fs = require("fs")
const {
  color,
  bgcolor
} = require('./lib/color')
const {
  help
} = require('./lib/help')
const {
  menuadm
} = require('./lib/menuadm')
const {
  menudono
} = require('./lib/menudono')
const {
  linguas
} = require('./lib/linguas')
const {
  donasi
} = require('./lib/donasi')
const {
  fetchJson
} = require('./lib/fetcher')
const {
  recognize
} = require('./lib/ocr')
const {
  wait,
  simih,
  getBuffer,
  h2k,
  generateMessageID,
  getGroupAdmins,
  getRandom,
  banner,
  start,
  info,
  success,
  close
} = require('./lib/functions')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const {
  removeBackgroundFromImageFile
} = require('remove.bg')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const vcard = 'BEGIN:VCARD\n'
+ 'VERSION:3.0\n'
+ 'FN:Luix_Guxto\n'
+ 'ORG: Luix_Guxto BotLuix;\n'
+ 'TEL;type=CELL;type=VOICE;waid=553199949012:+55 31 9994-9012\n'
+ 'END:VCARD'
prefix = '.'
blocked = []

/********** LOAD FILE **************/

/********** END FILE ***************/

const time = moment().tz('America/New_York').format("HH:mm:ss")
const arrayBulan = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const bulan = arrayBulan[moment().format('MM') - 1]
const config = {
  BotLuix: 'nop',
  instagram: 'nop',
  nomer: 'wa.me/553199949012',
  youtube: 'nop',
  whatsapp: 'Comming soon',
  tanggal: `TANGGAL: ${moment().format('DD')} ${bulan} ${moment().format('YYYY')}`,
  waktu: time
}

function kyun(seconds) {
  function pad(s) {
    return (s < 10 ? '0': '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Horas ${pad(minutes)} Minutos ${pad(seconds)} Segundos`
}


const {
  tanggal,
  waktu,
  instagram,
  whatsapp,
  youtube,
  nomer,
  ontime
} = config


const {
  exec
} = require("child_process")

const client = new WAConnection()

client.on('qr', qr => {
  qrcode.generate(qr, {
    small: true
  })
  console.log(`[ ${time} ] QR code esta pronto, leia rapidamente no wpp`)
})

client.on('credentials-updated', () => {
  const authInfo = client.base64EncodedAuthInfo()
  console.log(`atualizacao de credenciais!`)

  fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')

client.connect();

//client.on('user-presence-update', json => console.log(json.id + ' presence is => ' + json.type)) || console.log(`${time}: Bot by Luix_Guxto, digite !menu`)

client.on('group-participants-update', async (anu) => {
  if (!welkom.includes(anu.jid)) return
  try {
    const mdata = await client.groupMetadata(anu.jid)
    console.log(anu)
    if (anu.action == 'add') {
      num = anu.participants[0]
      try {
        ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
      } catch {
        ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
      }
      teks = `*OLÁ* @${num.split('@')[0]} \n𝗕𝗘𝗠 𝗩𝗜𝗡𝗗𝗢 𝗔𝗢\n*${mdata.subject}*\n\n
‼️Antes de tudo eu recomendo ler as regras para evitar banimentos.\n\n

‼️ Grupo de chat onde postamos gore, shitpost e pornô.\n\n

‼️Gore sai todos os dias de semana entre às 19:00 até 00:00\n\n

‼️Foi banido? Nem insiste no PV do adm pq você não vai voltar.\n\n

*👑 Querida fcc anti-gore, ao atacar este grupo, fiquem cientes que seus adm's irão sofrer report até serem banidos. 👑*
      *`
      let buff = await getBuffer(ppimg)
      client.sendMessage(mdata.id, buff, MessageType.image, {
        caption: teks, contextInfo: {
          "mentionedJid": [num]}})
    } else if (anu.action == 'remove') {
      num = anu.participants[0]
      try {
        ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
      } catch {
        ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
      }
      teks = `*Até a próxima* @${num.split('@')[0]}`
      let buff = await getBuffer(ppimg)
      client.sendMessage(mdata.id, buff, MessageType.image, {
        caption: teks, contextInfo: {
          "mentionedJid": [num]}})
    }
  } catch (e) {
    console.log('Error : %s', color(e, 'red'))
  }
})
client.on('CB:Blocklist', json => {
  if (blocked.length > 2) return
  for (let i of json[1].blocklist) {
    blocked.push(i.replace('c.us', 's.whatsapp.net'))
  }
})

client.on('message-new', async (mek) => {
  try {
    if (!mek.message) return
    if (mek.key && mek.key.remoteJid == 'status@broadcast') return
    if (mek.key.fromMe) return
    global.prefix
    global.blocked
    const content = JSON.stringify(mek.message)
    const from = mek.key.remoteJid
    const type = Object.keys(mek.message)[0]

    const {
      text,
      extendedText,
      contact,
      location,
      liveLocation,
      image,
      video,
      sticker,
      document,
      audio,
      product
    } = MessageType
    const time = moment.tz('America/New_York').format('DD/MM HH:mm:ss')
    body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation: (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption: (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption: (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text: ''
    budy = (type === 'conversation') ? mek.message.conversation: (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text: ''
    const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
    const args = body.trim().split(/ +/).slice(1)
    const isCmd = body.startsWith(prefix)
    mess = {
      wait: 'ESPERE EU TERMINAR ANTES DE PEDIR DNV CORNO',
      success: 'SUCESSO',
      error: {
        stick: 'da pra fazer figurinha disso?',
        Iv: 'PUTS LINK INVALIDO'
      },
      only: {
        group: '*BOT PERTENCE A UnitedKindom CASO QUEIRA USAR ENTRE NESSE LINK:*\n\nhttps://wa.me/5531999949012',
        ownerG: 'SOMENTE PROPRIETARIO ',
        ownerB: 'SOMENTE PROPRIETARIO ',
        admin: 'SOMENTE ADMINISTRADOR ',
        Badmin: 'O BOT DEVE SER ADMINISTRADOR'
      }
    }

    const botNumber = client.user.jid
    const ownerNumber = ["553199949012@s.whatsapp.net"]
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? mek.participant: mek.key.remoteJid
    const groupMetadata = isGroup ? await client.groupMetadata(from): ''
    const groupName = isGroup ? groupMetadata.subject: ''
    const groupId = isGroup ? groupMetadata.jid: ''
    const groupMembers = isGroup ? groupMetadata.participants: ''
    const groupDesc = isGroup ? groupMetadata.desc: ''
    const groupAdmins = isGroup ? getGroupAdmins(groupMembers): ''
    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
    const isGroupAdmins = groupAdmins.includes(sender) || false
    const isWelkom = isGroup ? welkom.includes(from): false
    const isNsfw = isGroup ? nsfw.includes(from): false
    const isSimi = isGroup ? samih.includes(from): false
    const isOwner = ownerNumber.includes(sender)
    const isUrl = (url) => {
      return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
    }
    const reply = (teks) => {
      client.sendMessage(from, teks, text, {
        quoted: mek
      })
    }
    const sendMess = (hehe, teks) => {
      client.sendMessage(hehe, teks, text)
    }
    const mentions = (teks, memberr, id) => {
      (id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {
        contextInfo: {
          "mentionedJid": memberr
        }}): client.sendMessage(from, teks.trim(), extendedText, {
        quoted: mek, contextInfo: {
          "mentionedJid": memberr
        }})
    }
    colors = ['red',
      'white',
      'black',
      'blue',
      'yellow',
      'green']
    const isMedia = (type === 'imageMessage' || type === 'videoMessage')
    const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
    const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
    const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
    if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mCOMANDO\x1b[1;37m]', time, color(command), 'de', color(sender.split('@')[0]), '\nargumentos :', color(args.length))
    if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mMENSSAGEN\x1b[1;37m]', time, color('Messagem'), 'de', color(sender.split('@')[0]), '\nargumentos :', color(args.length))
    if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mCOMANDO\x1b[1;37m]', time, color(command), 'de', color(sender.split('@')[0]), 'em', color(groupName), '\nargumentos :', color(args.length))
    if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mMENSAGEM\x1b[1;37m]', time, color('Messagem'), 'de', color(sender.split('@')[0]), 'em', color(groupName), '\nargumentos :', color(args.length))
    switch (command) {
      
      //inicio dos comandos//
      
      case 'scanear':
        if (!isGroup) return reply(mess.only.group)
        if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
          const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo: mek
          const media = await client.downloadAndSaveMediaMessage(encmedia)
          reply(mess.wait)
          await recognize(media, {
            lang: 'eng+ind', oem: 1, psm: 3
          })
          .then(teks => {
            reply(teks.trim())
            fs.unlinkSync(media)
          })
          .catch(err => {
            reply(err.message)
            fs.unlinkSync(media)
          })
        } else {
          reply(`marque uma foto que deseja scanear ${prefix}scanear, verifique se há testo para scanear!!!`)
        }
        break
      case 'waifu':
        if (!isGroup) return reply(mess.only.group)
        anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=waifu`, {
          method: 'get'
        })
        reply(mess.wait)
        var n = JSON.parse(JSON.stringify(anu));
        var nimek = n[Math.floor(Math.random() * n.length)];
        pok = await getBuffer(nimek)
        client.sendMessage(from, pok, image, {
          quoted: mek, caption: `uma foto de uma *Waifu*!! 😏`
        })
        break
      case 'animes':
        if (!isGroup) return reply(mess.only.group)
        anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=anime`, {
          method: 'get'
        })
        reply(mess.wait)
        var n = JSON.parse(JSON.stringify(anu));
        var nimek = n[Math.floor(Math.random() * n.length)];
        pok = await getBuffer(nimek)
        client.sendMessage(from, pok, image, {
          quoted: mek, caption: `uma foto de um anime aleatório!!😎`
        })
        break
      case 'neko':
        if (!isGroup) return reply(mess.only.group)
        anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=neko`, {
          method: 'get'
        })
        reply(mess.wait)
        var n = JSON.parse(JSON.stringify(anu));
        var nimek = n[Math.floor(Math.random() * n.length)];
        pok = await getBuffer(nimek)
        client.sendMessage(from, pok, image, {
          quoted: mek, caption: `Uma foto de uma *Neko*! 😜`
        })
        break
      case 'loli':
        if (!isGroup) return reply(mess.only.group)
        anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=loli`, {
          method: 'get'
        })
        reply(mess.wait)
        var n = JSON.parse(JSON.stringify(anu));
        var nimek = n[Math.floor(Math.random() * n.length)];
        pok = await getBuffer(nimek)
        client.sendMessage(from, pok, image, {
          quoted: mek, caption: `Uma foto de uma *Loli*! 🥺`
        })
        break
      case 'charles':
        if (!isGroup) return reply(mess.only.group)
        anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=monkey`, {
          method: 'get'
        })
        reply(mess.wait)
        var n = JSON.parse(JSON.stringify(anu));
        var nimek = n[Math.floor(Math.random() * n.length)];
        pok = await getBuffer(nimek)
        client.sendMessage(from, pok, image, {
          quoted: mek, caption: `Olha que fofa essa foto do *Charles* 🥺🥺🥺`
        })
        break
      case 'foto':
        if (!isGroup) return reply(mess.only.group)
        if (args.length < 1) return reply(`*OQ DESEJA PROCURAR*?`)
        anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=${body.slice(6)}`, {
          method: 'get'
        })
        reply(`Espere um pouco, Pesquisando sobre \n${body.slice(6)}\nCaso nao envie a foto tente pesquisar em inglês`)
        var n = JSON.parse(JSON.stringify(anu));
        var nimek = n[Math.floor(Math.random() * n.length)];
        pok = await getBuffer(nimek)
        client.sendMessage(from, pok, image, {
          quoted: mek, caption: `Uma foto de um(a)\n${body.slice(6)}`
        })
        break
      case 'yt':
        if (!isGroup) return reply(mess.only.group)
        if (args.length < 1) return reply('Qual o link do video?')

        if (!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
        anu = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${args[0]}`, {
          method: 'get'
        })
        if (anu.error) return reply(anu.error)
        teks = `*Title* : ${anu.title}`
        thumb = await getBuffer(anu.thumb)
        client.sendMessage(from, thumb, image, {
          quoted: mek, caption: teks
        })
        buffer = await getBuffer(anu.result)
        client.sendMessage(from, buffer, video, {
          mimetype: 'video/mp4', filename: `${anu.title}.mp4`, quoted: mek
        })
        break
      case 'mandaaiolink':
        if (!isGroup) return reply(mess.only.group)
        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
        linkgc = await client.groupInviteCode (from)
        yeh = `https://chat.whatsapp.com/${linkgc}\n\nlink do groupo\n*${groupName}*`
        client.sendMessage(from, yeh, text, {
          quoted: mek
        })
        break
      case 'tagall':
        if (!isGroup) return reply(mess.only.group)
        if (!isGroupAdmins) return reply(mess.only.admin)
        members_id = []
        teks = (args.length > 1) ? body.slice(8).trim(): ''
        teks += '\n\n'
        for (let mem of groupMembers) {
          teks += `=> @${mem.jid.split('@')[0]}\n`
          members_id.push(mem.jid)
        }
        mentions(teks, members_id, true)
        break
        case 'tagdono':
        if (!isGroup) return reply(mess.only.group)
        if (!isOwner) return reply(mess.only.ownerB)
        members_id = []
        teks = (args.length > 1) ? body.slice(8).trim(): ''
        teks += '\n\n'
        for (let mem of groupMembers) {
          teks += `=> @${mem.jid.split('@')[0]}\n`
          members_id.push(mem.jid)
        }
        mentions(teks, members_id, true)
        break
      case 'linguas':
        if (!isGroup) return reply(mess.only.group)
        client.sendMessage(from, linguas(prefix), text)
        break
      case 'menu':
        if (!isGroup) return reply(mess.only.group)
        client.sendMessage(from, help(prefix), text)
        break
      case 'menuadm':
        if (!isGroup) return reply(mess.only.group)
        if (!isGroupAdmins) return reply(mess.only.admin)
        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
        client.sendMessage(from, menuadm(prefix), text)
        break
      case 'menudono':
        if (!isOwner) return reply('*QUEM É VOCÊ?*')
        client.sendMessage(from, menudono(prefix), text)
        break
      case 'doação':
        if (!isGroup) return reply(mess.only.group)
        client.sendMessage(from, donasi(), text)
        break
      case 'chance':
        case 'sera':
          if (!isGroup) return reply(mess.only.group)
          if (args.length < 1) return reply('qual chance deseja calcular?')
          rate = body.slice(8)
          const ra = ['0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '35',
            '44',
            '51',
            '63',
            '72',
            '83',
            '93',
            '95',
            '99',
            '100',
            '1000',
            '100000000000']
          const te = ra[Math.floor(Math.random() * ra.length)]
          client.sendMessage(from, 'Chance de : *'+rate+'*\n\nporcentagem de acontecer : '+ te+'%', text, {
            quoted: mek
          })
          break
        case 'chances':
          case 'seras':
            if (!isOwner) return reply(`*comando correto é !chance*`)
            if (args.length < 1) return reply('qual chance deseja calcular?')
            rate = body.slice(9)
            const la = ['100',
              '1000',
              '100000000000',
              '10000',
              '100000',
              '1000000',
              '10000000',
              '100000000',
              '1000000000',
              '10000000000']
            const me = la[Math.floor(Math.random() * la.length)]
            client.sendMessage(from, 'Chance de : *'+rate+'*\n\nporcentagem de acontecer : '+ me+'%', text, {
              quoted: mek
            })
            break
          case 'chamce':
            case 'serás':
              if (!isOwner) return reply(`*comando correto é !chance*`)
              if (args.length < 1) return reply('qual chance deseja calcular?')
              rate = body.slice(8)
              const ma = ['0',
                '0',
                '0',
                '0']
              const ke = ma[Math.floor(Math.random() * ma.length)]
              client.sendMessage(from, 'Chance de : *"'+rate+'"*\n\nporcentagem de acontecer : '+ ke+'%', text, {
                quoted: mek
              })
              break
   case 'info':
              if (!isGroup) return reply(mess.only.group)
              uptime = process.uptime()
              teks = `*Nome do bot* : ${me.name}\n*Dono* : *Luix_Guxto*\n*Numero do dono* : \nwa.me/553199949012\n*@ do bot* : @${me.jid.split('@')[0]}\n*Prefixo* : " ${prefix} "\n*Total de contatos bloqueados* : ${blocked.length}\n*O bot esta ativo a* :\n${kyun(uptime)}`
              buffer = await getBuffer(me.imgUrl)
              client.sendMessage(from, buffer, image, {
                caption: teks, contextInfo: {
                  mentionedJid: [me.jid]}})
              break
            case 'blocklist':
              case 'lista_de_bloqueados':
                case 'bloqueados':
                  if (!isGroup) return reply(mess.only.group)
                  teks = 'Lista de bloqueados :\n'
                  for (let block of blocked) {
                    teks += `┣➢ @${block.split('@')[0]}\n`
                  }
                  teks += `Total : ${blocked.length}`
                  client.sendMessage(from, teks.trim(), extendedText, {
                    quoted: mek, contextInfo: {
                      "mentionedJid": blocked
                    }})
                  break
                case 'hidetag':
                  if (!isGroup) return reply(mess.only.group)
                  if (!isOwner) return reply('QUEM É VC PORRA?')
                  var value = body.slice(9)
                  var group = await client.groupMetadata(from)
                  var member = group['participants']
                  var mem = []
                  member.map(async adm => {
                    mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
                  })
                  var options = {
                    text: value,
                    contextInfo: {
                      mentionedJid: mem
                    },
                    quoted: mek
                  }
                  client.sendMessage(from, options, text)
                  break
                case 'citação':
                  case 'citacao':
                    if (!isGroup) return reply(mess.only.group)
                    var gh = body.slice(9)
                    var quote = gh.split("|")[0];
                    var wm = gh.split("|")[1];
                    const pref = `Usage: \n${prefix}citacao texto|marca d'agua\n\nEx :\n${prefix}citacao Meu pau|-bolsonaro 2020`
                    if (args.length < 1) return reply(pref)
                    reply(mess.wait)
                    anu = await fetchJson(`https://terhambar.com/aw/qts/?kata=${quote}&author=${wm}&tipe=random`, {
                      method: 'get'
                    })
                    buffer = await getBuffer(anu.result)
                    client.sendMessage(from, buffer, image, {
                      caption: 'Sua citacao', quoted: mek
                    })
                    break
                  case 'bug':
                    if (!isGroup) return reply(mess.only.group)
                    if (args.length < 1) return reply('qual o bug?')
                    const pesan = body.slice(5)
                    if (pesan.length > 300) return client.sendMessage(from, 'Mensagem de no maximo 300 carácteres!', msgType.text, {
                      quoted: mek
                    })
                    var nomor = mek.participant
                    const teks1 = `*[REPORT]*\nNome : @${nomor.split("@s.whatsapp.net")[0]}\nMensagem : ${pesan}`
                    var options = {
                      text: teks1,
                      contextInfo: {
                        mentionedJid: [nomor]},
                    }
                    client.sendMessage('553199949012@s.whatsapp.net', options, text, {
                      quoted: mek
                    })
                    reply('Problemas foram relatados ao proprietário do BOT, relatórios falsos não serão respondidos.')
                    break
                  case 'letra':
                    if (!isGroup) return reply(mess.only.group)
                    teks = body.slice(7)
                    anu = await fetchJson(`http://scrap.terhambar.com/lirik?word=${teks}`, {
                      method: 'get'
                    })
                    reply('Letra da musica '+teks+' :\n\n'+anu.result.lirik)
                    break
                  case 'text3d':
                    if (!isGroup) return reply(mess.only.group)
                    if (args.length < 1) return reply('onde esta o texto irmao?')
                    teks = `${body.slice(8)}`
                     if (teks.length > 10) return client.sendMessage(from, 'No maximo 10 caracteres', text, {
                      quoted: mek
                    })
                    buff = await getBuffer(`https://docs-jojo.herokuapp.com/api/text3d?text=${teks}`, {
                      method: 'get'
                    })
                    client.sendMessage(from, buff, image, {
                      quoted: mek, caption: `${teks}`
                    })
                    break
                  case 'map':
                    if (!isGroup) return reply(mess.only.group)
                    anu = await fetchJson(`https://mnazria.herokuapp.com/api/maps?search=${body.slice(5)}`, {
                      method: 'get'
                    })
                    buffer = await getBuffer(anu.gambar)
                    client.sendMessage(from, buffer, image, {
                      quoted: mek, caption: `${body.slice(5)}`
                    })
                    break
                  case 'stiker':
                    case 'sticker':
                      case 's':
                        case 'st':
                          if (!isGroup) return reply(mess.only.group)
                          if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo: mek
                            const media = await client.downloadAndSaveMediaMessage(encmedia)
                            ran = getRandom('.webp')
                            await ffmpeg(`./${media}`)
                            .input(media)
                            .on('start', function (cmd) {
                              console.log(`Started : ${cmd}`)
                            })
                            .on('error', function (err) {
                              console.log(`Error : ${err}`)
                              fs.unlinkSync(media)
                              reply(mess.error.stick)
                            })
                            .on('end', function () {
                              console.log('Finish')
                              buff = fs.readFileSync(ran)
                              client.sendMessage(from, buff, sticker, {
                                quoted: mek
                              })
                              fs.unlinkSync(media)
                              fs.unlinkSync(ran)
                            })
                            .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                            .toFormat('webp')
                            .save(ran)
                          } else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
                            const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo: mek
                            const media = await client.downloadAndSaveMediaMessage(encmedia)
                            ran = getRandom('.webp')
                            reply(mess.wait)
                            await ffmpeg(`./${media}`)
                            .inputFormat(media.split('.')[1])
                            .on('start', function (cmd) {
                              console.log(`Started : ${cmd}`)
                            })
                            .on('error', function (err) {
                              console.log(`Error : ${err}`)
                              fs.unlinkSync(media)
                              tipe = media.endsWith('.mp4') ? 'video': 'gif'
                              reply(`VIDEO MT GRANDE`)})
                            .on('end', function () {
                              console.log('Finish')
                              buff = fs.readFileSync(ran)
                              client.sendMessage(from, buff, sticker, {
                                quoted: mek
                              })
                              fs.unlinkSync(media)
                              fs.unlinkSync(ran)
                            })
                            .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                            .toFormat('webp')
                            .save(ran)
                          } else {
                            reply(`Nenhuma foto detectada use ${prefix}st respondendo ou na legenda de alguma foto ou gif`)
                          }
                          break
                        case 'fala':
                          if (!isGroup) return reply(mess.only.group)
                          if (args.length < 1) return client.sendMessage(from, 'Qual o codigo da lingua?', text, {
                            quoted: mek
                          })
                          const gtts = require('./lib/gtts')(args[0])
                          if (args.length < 2) return client.sendMessage(from, 'Qual seria o texto?', text, {
                            quoted: mek
                          })
                          dtt = body.slice(9)
                          ranm = getRandom('.mp3')
                          rano = getRandom('.ogg')
                          dtt.length > 300
                          ? reply('Texto de no maximo 300 caracteres'): gtts.save(ranm, dtt, function() {
                            exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
                              fs.unlinkSync(ranm)
                              buff = fs.readFileSync(rano)
                              if (err) return reply('Sei disso nao')
                              client.sendMessage(from, buff, audio, {
                                quoted: mek, ptt: true
                              })
                              fs.unlinkSync(rano)
                            })
                          })
                          //inicio dos comandos de proprietario//
                          break
                        case 'setprefix':
                          case 'setarcomando':
                            case 'setcomando':
                              case '%%%':
                                if (args.length < 1) return
                                if (!isOwner) return reply(mess.only.ownerB)
                                prefix = args[0]
                                reply(`Prefixo foi alterado com sucesso para : ${prefix}`)
                                break
                              case 'clearall':
                                if (!isOwner) return reply(' *QUEM É VOCÊ* ?')
                                anu = await client.chats.all()
                                client.setMaxListeners(25)
                                for (let _ of anu) {
                                  client.deleteChat(_.jid)
                                }
                                reply('todas as conversas apagadas  /_ /')
                                break
                              case 'block':
                                client.updatePresence(from, Presence.composing)
                                client.chatRead (from)
                                if (!isGroup) return reply(mess.only.group)
                                if (!isOwner) return reply(mess.only.ownerB)
                                client.blockUser (`${body.slice(7)}@c.us`, "add")
                                client.sendMessage(from, `Membro Bloqueado! :${body.slice(7)}@c.us`, text)
                                break
                              case 'unblock':
                                if (!isGroup) return reply(mess.only.group)
                                if (!isOwner) return reply(mess.only.ownerB)
                                client.blockUser (`${body.slice(9)}@c.us`, "remove")
                                client.sendMessage(from, `Membro desbloqueado!!:${body.slice(9)}@c.us`, text)
                                break
                              case 'bc':
                                if (!isOwner) return reply(' *QUEM É VC* ?')
                                if (args.length < 1) return reply('qual a mensagem?')
                                anu = await client.chats.all()
                                if (isMedia && !mek.message.videoMessage || isQuotedImage) {
                                  const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo: mek
                                  buff = await client.downloadMediaMessage(encmedia)
                                  for (let _ of anu) {
                                    client.sendMessage(_.jid, buff, image, {
                                      caption: `Mensagem do criador\n\n${body.slice(4)}`
                                    })
                                  }
                                  reply(' transmissão de sucesso')
                                } else {
                                  for (let _ of anu) {
                                    sendMess(_.jid, `mensagem do criador!\n\n${body.slice(4)}.`)
                                  }
                                  reply('mensagem enviada a todos!')
                                }
                                break
                              case 'mensg':
                                if (!isOwner) return reply(' *QUEM É VC* ?')
                                if (args.length < 1) return reply('qual a mensagem?')
                                anu = await client.chats.all()
                                if (isMedia && !mek.message.videoMessage || isQuotedImage) {
                                  const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo: mek
                                  buff = await client.downloadMediaMessage(encmedia)
                                  for (let _ of anu) {
                                    client.sendMessage(_.jid, buff, image, {
                                      caption: `*${body.slice(7)}*`
                                    })
                                  }
                                  reply(' transmissão de sucesso')
                                } else {
                                  for (let _ of anu) {
                                    sendMess(_.jid, `${body.slice(7)}`)
                                  }
                                  reply('mensagem enviada a todos!')
                                }
                                break
                              //fim dos comandos de proprietario//
                              //inicio dos comandos de adm//
                              case 'setpp':
                                case 'mudar-foto':
                                  if (!isGroup) return reply(mess.only.group)
                                  if (!isGroupAdmins) return reply(mess.only.admin)
                                  if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                  media = await client.downloadAndSaveMediaMessage(mek)
                                  await client.updateProfilePicture (from, media)
                                  reply('Alterado o icon do grupo com sucesso')
                                  break
                                case 'add':
                                  case 'adicionar':
                                    if (!isGroup) return reply(mess.only.group)
                                    if (!isGroupAdmins) return reply(mess.only.admin)
                                    if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                    if (args.length < 1) return reply('certamente aqueles que desejam adicionar filhos adotivos?')
                                    if (args[0].startsWith('08')) return reply('Use o código do pais ')
                                    try {
                                      num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
                                      client.groupAdd(from, [num])
                                    } catch (e) {
                                      console.log('Error :', e)
                                      reply('Falha ao adicionar talvez porque seja privado')
                                    }
                                    break
                                  case 'grupo':
                                    if (!isGroup) return reply(mess.only.group)
                                    if (!isGroupAdmins) return reply(mess.only.admin)
                                    if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                    if (args[0] === 'abrir') {
                                      reply(`grupo aberto com sucesso`)
                                      client.groupSettingChange(from, GroupSettingChange.messageSend, false)
                                    } else if (args[0] === 'fechar') {
                                      reply(`Grupo fechado com sucesso`)
                                      client.groupSettingChange(from, GroupSettingChange.messageSend, true)
                                    }
                                    break
                                  case 'criador':
                                    case 'dono':
                                      client.sendMessage(from, {
                                        displayname: "Luis", vcard: vcard
                                      }, MessageType.contact, {
                                        quoted: mek
                                      })
                                      client.sendMessage(from, 'Esse é o contato do meu criador, caso use imune este é o link do chat dele wa.me/+553199949012', MessageType.text, {
                                        quoted: mek
                                      })
                                      break
                                    case 'setnome':
                                      if (!isGroup) return reply(mess.only.group)
                                      if (!isGroupAdmins) return reply(mess.only.admin)
                                      if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                      teks = `${body.slice(9)} `
                                      client.groupUpdateSubject(from, teks)
                                      client.sendMessage(from, 'Nome do grupo alterado com sucesso', text, {
                                        quoted: mek
                                      })
                                      break
                                    case 'setdesc':
                                      if (!isGroup) return reply(mess.only.group)
                                      if (!isGroupAdmins) return reply(mess.only.admin)
                                      if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                      teks = `${body.slice(9)} `
                                      client.groupUpdateDescription(from, teks)
                                      client.sendMessage(from, 'Descrição alterada com sucesso', text, {
                                        quoted: mek
                                      })
                                      break
                                    case 'rebaixar':
                                      if (!isGroup) return reply(mess.only.group)
                                      if (!isGroupAdmins) return reply(mess.only.admin)
                                      if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                      if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag de quem deseja remover o adm!')
                                      mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                                      if (mentioned.length > 1) {
                                        teks = ''
                                        for (let _ of mentioned) {
                                          teks += `sua posição de adm foi removida :\n`
                                          teks += `@_.split('@')[0]`
                                        }
                                        mentions(teks, mentioned, true)
                                        client.groupDemoteAdmin(from, mentioned)
                                      } else {
                                        mentions(`sua posição de adm foi removida :\n @${mentioned[0].split('@')[0]} nao chora 😂`, mentioned, true)
                                        client.groupDemoteAdmin(from, mentioned)
                                      }
                                      break
                                    case 'promover':
                                      if (!isGroup) return reply(mess.only.group)
                                      if (!isGroupAdmins) return reply(mess.only.admin)
                                      if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                      if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag do alvo que vc deseja chutar!')
                                      mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                                      if (mentioned.length > 1) {
                                        teks = ''
                                        for (let _ of mentioned) {
                                          teks += `parabens por se tornar o adm do grupo :\n`
                                          teks += `@_.split('@')[0]`
                                        }
                                        mentions(teks, mentioned, true)
                                        client.groupMakeAdmin(from, mentioned)
                                      } else {
                                        mentions(`Parabens @${mentioned[0].split('@')[0]} voce foi promovido para adm do grupo`, mentioned, true)
                                        client.groupMakeAdmin(from, mentioned)
                                      }
                                      break
                                    case 'banir':
                                      if (!isGroup) return reply(mess.only.group)
                                      if (!isGroupAdmins) return reply(mess.only.admin)
                                      if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                      if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('marque o cara que vc quer chutar!')
                                      mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                                      if (mentioned.length > 1) {
                                        teks = ''
                                        for (let _ of mentioned) {
                                          teks += `NÃO FICA QUIETO TOMA BAN :\n`
                                          teks += `@_.split('@')[0]`
                                        }
                                        mentions(teks, mentioned, true)
                                        client.groupRemove(from, mentioned)
                                      } else {
                                        mentions(`RESPEITE AS REGRAS DA PROXIMA VEZ 🤬 @${mentioned[0].split('@')[0]}`, mentioned, true)
                                        client.groupRemove(from, mentioned)
                                      }
                                      break
                                    case 'listadmin':
                                      if (!isGroup) return reply(mess.only.group)
                                      teks = `Lista de administradores do grupo *${groupMetadata.subject}*\nQuantidade de adms : ${groupAdmins.length}\n\n`
                                      no = 0
                                      for (let admon of groupAdmins) {
                                        no += 1
                                        teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
                                      }
                                      mentions(teks, groupAdmins, true)
                                      break
                                    case 'welcome':
                                      if (!isGroup) return reply(mess.only.group)
                                      if (!isGroupAdmins) return reply(mess.only.admin)
                                      if (args.length < 1) return ('DIGITE 0 PARA DESATIVAR E 1 PARA ATIVAR')
                                      if (Number(args[0]) === 1) {
                                        if (isWelkom) return reply('ATIVO !!!')

                                        welkom.push(from)

                                        fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
                                        reply('SUCESSO AO DESLIGAR O RECURSO DE BEM-VINDO/LEFT NESTE GRUPO')
                                      } else if (Number(args[0]) === 0) {
                                        welkom.splice(from, 1)
                                        fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
                                        reply('SUCESSO AO DESLIGAR O RECURSO DE BEM-VINDO LEFT NESTE GRUPO')
                                      } else {
                                        reply('*0o0*')
                                      }
                                      break
                                    case 'clone':
                                      if (!isGroup) return reply(mess.only.group)
                                      if (!isOwner) return reply(' *QUEM É VC?*')
                                      if (args.length < 1) return reply(' *TAG de quem deseja roubar a foto de perfil!!!* ')
                                      if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
                                      mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
                                      let {
                                        jid,
                                        id,
                                        notify
                                      } = groupMembers.find(x => x.jid === mentioned)
                                      try {
                                        pp = await client.getProfilePicture(id)
                                        buffer = await getBuffer(pp)
                                        client.updateProfilePicture(botNumber, buffer)
                                        mentions(`Foto de perfil roubada com sucesso! @${id.split('@')[0]}`, [jid], true)
                                      } catch (e) {
                                        reply(' *Nao possui foto ;-;*')
                                      }
                                      break
                                    //fim dos comandos de adm//
                                    case 'reverter':
                                      if (!isGroup) return reply(mess.only.group)
                                      if (!isQuotedSticker) return reply('MARQUE A STICKER QUE DESEJA REVERTER !')
                                      reply(mess.wait)
                                      encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
                                      media = await client.downloadAndSaveMediaMessage(encmedia)
                                      ran = getRandom('.png')
                                      exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                                        fs.unlinkSync(media)
                                        if (err) return reply('Sticker de gif nao é possivel reverter!!!')
                                        buffer = fs.readFileSync(ran)
                                        client.sendMessage(from, buffer, image, {
                                          quoted: mek, caption: 'ACABOU '
                                        })
                                        fs.unlinkSync(ran)
                                      })
                                      break
                                    case 'anime':
                                      if (!isGroup) return reply(mess.only.group)
                                      if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
                                        reply(mess.wait)
                                        const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo: mek
                                        media = await client.downloadMediaMessage(encmedia)
                                        await wait(media).then(res => {
                                          client.sendMessage(from, res.video, video, {
                                            quoted: mek, caption: res.teks.trim()})
                                        }).catch(err => {
                                          reply(err)
                                        })
                                      } else {
                                        reply(' *ENVIE A FOTO DO ANIME QUE DESEJA PROCURAR* ')
                                      }
                                      break
                                    //fim dos comandos
                                    default:
                                      if (isGroup && isSimi && budy != undefined) {
                                        console.log(budy)
                                        muehe = await simih(budy)
                                        console.log(muehe)
                                        reply(muehe)
                                      } else {
                                        console.log(color('[ERRO]', 'red'), 'Comando nao registrado de', color(sender.split('@')[0]))
                                      }
                                    }
                                } catch (e) {
                                  console.log('Error : %s', color(e, 'red'))}})