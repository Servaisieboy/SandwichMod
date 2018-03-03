const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const resultOpts = ["Result", "Exact result", "Decimal approximation"];
const prefix = "sm!";

client.on('ready',() => {
    console.log('De bot is opgestart!');
});


client.on("message", async message => {

  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit({embed: {
      color: 0xfb0000,
      title: "SandwichModerator",
      description: `Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© SandwichModeration",
    }}});
  }
  
  if(command === "say") {
    if(!message.member.roles.some(r=>["Beheerder", "Moderator"].includes(r.name))) return message.reply('je hebt hiervoor de role Moderator of Beheerder nodig!');
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send({embed: {
      color: 0xff8487,
      description: (sayMessage),
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© SandwichModeration",
    }}})
  }

  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["Beheerder", "Moderator"].includes(r.name)) )
      return message.reply("Je hebt geen permissie om dit commando uit te voeren!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Je bent vergeten de speler te mentionen die je wilt kicken!");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Vul een reden in om deze speler te kicken!");
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply({embed: {
      color: 0xfb0000,
      description: `**${member.user.tag}** is succesvol gekickt door **${message.author.tag}** omdat: **${reason}**`,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© SandwichModeration",
    }}});

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Beheerder", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply({embed: {
        color: 0xdc821f,
        title: "SandwichModerator",
        description: "Helaas kan ik deze speler niet verbannen! :sob: ",
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© SandwichModeration",
      }}});

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Vul een reden in om deze speler te verbannen!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
      message.reply({embed: {
        color: 0xf704f0 ,
        description: `**${member.user.tag}** is succesvol verbannen door **${message.author.tag}** omdat: **${reason}**`,
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© SandwichModeration",
      }}});
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply({embed: {
        color: 0x42f505,
        title: "SandwichModerator",
        description: "Vul een getal in tussen de 2 en de 100 om de berichten te kunnen verwijderen",
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© SandwichModeration",
      }}})
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});


client.on('message', message => {
	if (message.author === client.user) return;
	if (message.content.startsWith(prefix + 'playerinfo')) {
        message.channel.sendMessage({embed: {
            color: 0xee93f0,
            author: {
              name: "SandwichMod - Playerinfo",
              icon_url: client.user.avatarURL,
              url: "https://discord.gg/eRVsEMn",
            },
            thumbnail: {
              url: message.author.avatarURL
            },
            fields: [{
                name: "Username:",
                value: message.author.username
              },
              {
                name: "UserID:",
                value: message.author.id
              },
              {
                name: "Roles:",
                value: message.member.highestRole.name
              },
              {
                name: "Join Time:",
                value: message.member.joinedAt
              },
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "© SandwichMod"
            }
          }
        });
	}
});

client.on('message', message => {
  if (message.content === 'sm!help') {
    message.channel.send({embed: {
      color: 0xf704f0 ,
      title: 'SandwichMod - Helpdesk',
      description: `sm!help - Toont dit menu.\nsm!ping - Controleert of de bot nog actief is.\nsm!kick - Kick een gebruiker.\nsm!ban - Verban een gebruiker.\nsm!playerinfo - Laat al je gebruikersinfo zien.\nsm!regels - Laat alle regels zien.\nsm!locaties - Laat zien waar alle locaties zijn (MT Gericht). \nsm!invite - Verstuurd de invite link van de bot. \nsm!bc <channel> <HEX> <Roles> <Bericht> - Broadcast een embed bericht in een channel naar keuze.`,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© SandwichModeration",
      }
    }
  });
}
});


client.on('message', message => {
  if (message.content === 'sm!locaties') {
    message.channel.send({embed: {
      color: 0xf704f0 ,
      title: 'SandwichMod - Locaties',
      description: `**SandwichClothes TheCity:**\nx: -1065 z: -1221\n**SandwichBakery TheCity:**\n#Soon`,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© SandwichModeration",
      }
    }
  });
}
});

client.on('message', message => {
  if (message.content === 'sm!regels') {
    message.channel.send({embed: {
      color: 0xf704f0 ,
      title: 'SandwichMod - Regels',
      description: `**REGELS:**\n \n-Niet adverteren.\n-Wees respectvol tegenover elkaar.\n-Niet schelden.\n-Geen fake namen.\n-Geen screamers of slecht bedoelde linkjes.\n-Geen verkorte linkjes sturen naar mensen!\n-Geen VPN.\n-Niet constant switchen van channel.\n-Spammen in de chat kan een perm ban opleveren.\n \n**Twitter:** https://twitter.com/SandwichMT`,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© SandwichModeration",
      }
    }
  });
}
});




client.on('message', message => {
  
  if (message.content === 'sm!invite') {
    message.author.send({embed: {
      color: 0xf704f0 ,
      title: 'SandwichMod - Invite',
      description: `https://discordapp.com/oauth2/authorize?client_id=417677803425628189&permissions=8&scope=bot \n \n**Twitter:** \nhttps://twitter.com/SandwichMT`,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© SandwichModeration",
      
      
      }
    }
  })
}
});

client.on("message", async message => {

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "report") {
    
    const rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Kan de speler niet vinden.");
    const rreason = args.join(" ").slice(22);
    if(!rreason) return message.channel.send("Je moet wel een reden aangeven")

    const reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#ffb600")
    .addField("Naam", `${rUser}`)
    .addField("Door", `${message.author}`)
    .addField("Channel", message.channel)
    .addField("Tijd", message.createdAt)
    .addField("Reden", rreason);

    const reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("Kan geen channel vinden met het naam``reports``.");


    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);
    return message.reply("Jouw report is doorgestuurd! ;)")

    return
       
      
  }
}
);

  client.on("message", async message => {

    if(message.channel.name === "reclame") {
        if (reclamedelay.has(message.author.id)) {
            message.author.send('Je moet 24 uur wachten.');
            message.delete();
        }
        else reclamedelay.add(message.author.id);
    }
    if(message.author.bot) return;
    
    if(message.content.indexOf(prefix) !== 0) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
  
    
    if(command === "bc") {
        if(!message.member.roles.some(r=>["Beheerder"].includes(r.name))) return message.reply('geen perms.');
        const channel = message.mentions.channels.first();
        if (!channel) return message.reply('Je hebt geen channel aangeduid.');
        const kleur = args[1];
        if(!kleur) return message.reply('Je hebt geen kleur opgegeven');
        const kleur2 = message.content.slice(kleur.length).trim().split(/ +/g);
        const mention = args[2];
        if(!mention) return message.reply('Je hebt een mention opgegeven.');
        const mention2 = message.content.slice(mention.length).trim().split(/ +/g);
        const bericht = args.slice(3).join(' ');
        if (mention === "everyone") {
            const embed = new Discord.RichEmbed().setColor(`${kleur}`).addField('Mededeling', `${bericht}`);
            const msg = await channel.send('@everyone');
            channel.send(embed);
  
        }
        if (mention !== "everyone") {
            const mentionid = message.guild.roles.find('name', `${mention.replace('_', ' ')}`);
            const mentionid2 = mentionid.id;
            const msg = await channel.send(`<@&${mentionid2}>`);
            const embed = new Discord.RichEmbed().setColor(`${kleur}`).addField('Mededeling', `${bericht}`);
            channel.send(embed);
        }
  
  
    } 
    if(command === "setgame") {
        if(message.member.roles.some(r=>["Beheerder"].includes(r.name))) {
            const play = args.join(' ');
            if(!play) return message.reply('je hebt niet alles correct ingevuld!');
            client.user.setActivity(`${play}`);
        }
        else return message.reply('Je hebt geen toegang tot dit commando.')
    }
  });
  
  setTimeout(() => {
    reclamedelay.delete(message.author.id);
  }, 86400000);



client.login(process.env.NDE3Njc3ODAzNDI1NjI4MTg5.DXxZCw.Ay7VTA38Fyg0e7Jva7nwG6BoY8Q);
