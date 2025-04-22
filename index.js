const { Client, SlashCommandBuilder, GatewayIntentBits, EmbedBuilder, PermissionsBitField, REST, Routes, userMention, ActivityType, } = require('discord.js');
require('dotenv').config();
const fetch = require('node-fetch');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

function hasStaffRole(member) {
    // Check if the member has a role with the specified ID
    return member.roles.cache.has('role ID');
  }

// Bot ready event
client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
    client.user.setPresence({
        activities: [{ 
            name: 'Change your bots presence here', 
            type: ActivityType.Watching
        }],
        status: 'idle'
    });
});

// Command handler
client.on('messageCreate', (message) => {
    if (!message.content.startsWith('>') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    // Commands
    if (command === 'ping') {
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`Latency is **${Date.now() - message.createdTimestamp}ms**`)
            .setColor('#3498DB');
        message.channel.send({ embeds: [embed] });

    } else if (command === 'serverinfo') {
        const { guild } = message;
        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Info`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: 'Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Created', value: guild.createdAt.toDateString(), inline: true }
            )
            .setColor('#1ABC9C');
        message.channel.send({ embeds: [embed] });
    
    } else if (command ==='sc') {
        const embed = new EmbedBuilder()
        .setTitle(`Secret Command One!`)
        .setDescription('Congrats! you found a secret command! DM the owner of this bot (find it in the >about command) to get a reward!')
        .setColor(`#7FFFD4`)
        .setURL('https://www.youtube.com/watch?v=WlgoUlOkyzU&list=LL&index=11')
    message.channel.send({ embeds: [embed] });

    } else if (command === 'help') {
        const embed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setDescription('Here are the available commands:')
            .addFields(
                { name: '>ping', value: 'Check bot latency' },
                { name: '>who [@user]', value: 'Get user information' },
                { name: '>serverinfo', value: 'Get server information' },
                { name: '>avatar [@user]', value: 'Get the avatar of a user' },
                { name: '>roll', value: 'Roll a random number between 1-100' },
                { name: '>say [#channel] [message]', value: 'Make the bot say something in a specific channel' },
                { name: '>joke', value: 'Get a random joke' },
                { name: '>clear [amount]', value: 'Delete a number of messages (moderation)' },
                { name: '>ban [@user]', value: 'Ban a user (moderation)' },
                { name: '>kick [@user]', value: 'Kick a user (moderation)' },
                { name: '>mute [@user]', value: 'Mute a user (moderation)' },
                { name: '>unmute [@user]', value: 'Unmute a user (moderation)' },
                { name: '>poll [question]', value: 'Create a poll (still in development)' },
                { name: '>quote', value: 'Get an inspirational quote' },
                { name: '>about', value: 'Learn about the bot' },
                { name: '>test', value: 'The Test Command for boltythefluffywolf'},
                { name: '>cm', value: 'The cm Command for for everyone to hate you? idk.'},
                { name: '>staff', value: 'See the Current Staff in this server!'}
            )
            .setColor('#F1C40F');
        message.channel.send({ embeds: [embed] });

    } else if (command === "who") {
        let user = message.mentions.users.first() ||
                   (args[0] ? client.users.cache.get(args[0]) : message.author);
        
        if (!user) return message.reply("User not found!");
        
        const member = message.guild.members.cache.get(user.id);
        
        const embed = new EmbedBuilder()
          .setTitle(`${user.tag}'s Information`)
          .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
          .setColor("Blue")
          .addFields(
            { name: "Username", value: user.username, inline: true },
            { name: "User ID", value: user.id, inline: true },
            { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
          );
        
        if (member) {
          embed.addFields(
            { name: "Nickname", value: member.nickname || "None", inline: true },
            { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
            { name: "Roles", value: member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r).join(", ") || "None", inline: false },
            { name: "Permissions", value: member.permissions.toArray().map(p => `\`${p}\``).join(", ") || "None", inline: false },
            { name: "Highest Role", value: member.roles.highest.name, inline: true },
            { name: "Hoist Role", value: member.roles.hoist ? member.roles.hoist.name : "None", inline: true }
          );
        }
        
        message.channel.send({ embeds: [embed] });

    } else if (command === 'staff') {
        const embed = new EmbedBuilder()
        .setTitle('Current Staff!')
        .setDescription('Heres a List of current staff as of Febuary 2nd 2025 at 2:56am')
        .addFields(
            {name: 'Owner', value: 'Owner'},
            {name: 'Co-Owners', value: 'Co Owners'},
            {name: 'Admins', value: 'Admins'},
            {name: 'Moderators', value: 'Mods'},
            {name: 'Trainee Staff', value: 'None Currently'}
        )
        .setColor('Random')
        .setThumbnail('Avatar')
        .setURL('URL')
        .setTimestamp(new Date())
        .setFooter({ text: `Used by ${message.author.tag} using the !staff command`, iconURL: message.author.displayAvatarURL() });
        message.channel.send({ embeds: [embed] });

    } else if (command === 'avatar') {
        const user = message.mentions.users.first() || message.author;
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('#E67E22');
        message.channel.send({ embeds: [embed] });

    } else if (command === 'roll') {
        const number = Math.floor(Math.random() * 100) + 1;
        const embed = new EmbedBuilder()
            .setTitle('Random Roll')
            .setDescription(`🎲 You rolled a **${number}**!`)
            .setColor('#3498DB');
        message.channel.send({ embeds: [embed] });

    } else if (command === 'about') {
        const embed = new EmbedBuilder()
            .setTitle('About Me')
            .setDescription('About')
            .setColor('DarkVividPink')
        message.channel.send({ embeds: [embed] });
    } else if (command === 'rr') {
        const embed = new EmbedBuilder()
            .setTitle('Rick Astley Has Arrived!')
            .setDescription('Never Gonna Give You Up/ Never gonna let you down ')
            .setImage('https://www.giantfreakinrobot.com/wp-content/uploads/2022/08/rick-astley.jpg')
            .setColor('Orange')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUXbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA%3D')
        message.channel.send({ embeds: [embed] });

    } else if (command === 'quote') {
        const quotes = [
            "Every Problem has a Solution! (Alice Hoffman)",
            "Just one small positive thought in the morning can change your whole day (Dalai Lama)",
            "If you can't fly, then run, if you can't run, then walk, if you can't walk, then crawl, but whatever you do, you have to keep moving forward (Martin Luther King, Jr.)"
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        const embed = new EmbedBuilder()
            .setTitle('Heres an Inspirational Quote!')
            .setDescription(quote)
            .setColor('Gold')
            .setURL('https://www.google.com/search?q=inspirational+quotes&sca_esv=9cf692461ce39f51&sxsrf=AHTn8zppwS0TsesLO8dT68j8tmmBrNCZ_w%3A1738198910392&ei=fs-aZ8bRF6avwbkP85m1wAc&oq=inspi&gs_lp=Egxnd3Mtd2l6LXNlcnAaAhgDIgVpbnNwaSoCCAAyDhAAGIAEGJECGLEDGIoFMgoQABiABBhDGIoFMg0QABiABBixAxhDGIoFMgUQABiABDIREC4YgAQYsQMYgwEYxwEYrwEyChAAGIAEGEMYigUyCxAAGIAEGLEDGIsDMggQABiABBiLAzIIEAAYgAQYiwMyEBAAGIAEGLEDGEMYigUYiwNIhhhQlgZYwhFwA3gBkAEAmAF_oAHCBKoBAzAuNbgBA8gBAPgBAZgCCKAC3gTCAgoQABiwAxjWBBhHwgINEAAYgAQYsAMYQxiKBcICChAjGIAEGCcYigXCAgsQLhiABBiRAhiKBcICCxAAGIAEGJECGIoFwgILEAAYgAQYsQMYgwHCAhEQLhiABBixAxjRAxiDARjHAcICDhAuGIAEGLEDGNEDGMcBwgIUEC4YgAQYsQMY0QMYgwEYxwEYigXCAgQQIxgnwgIQEAAYgAQYsQMYQxiDARiKBcICDhAuGIAEGMcBGI4FGK8BwgINEAAYgAQYQxjJAxiKBcICCxAAGIAEGJIDGIoFwgINEC4YgAQYQxjUAhiKBcICChAuGIAEGEMYigXCAg4QABiABBixAxiDARiLA5gDAIgGAZAGCpIHAzMuNaAHoTw&sclient=gws-wiz-serp')
        message.channel.send({ embeds: [embed] });

    } else if (command === 'joke') {
        const jokes = [
            "Why don't skeletons fight each other? They don't have the guts!",
            "What do you call fake spaghetti? An impasta!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!"
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        const embed = new EmbedBuilder()
            .setTitle('Here\'s a joke for you!')
            .setDescription(joke)
            .setColor('#9B59B6');
        message.channel.send({ embeds: [embed] });

    } else if (command === 'zig') {
        const embed = new EmbedBuilder()
            .setTitle('About ziggy_1102')
            .setDescription('ziggy_1102 loves to be rick rolled, is a silly goober, enjoys spending time with friends, enjoys most spending time with his fiancés, and more!')
            .setColor('Aqua')
            .setURL('https://youtu.be/_pPbQixgRFU')
        message.channel.send({ embeds: [embed] });

    } else if (command === 'cm') {
        const embed = new EmbedBuilder()
            .setTitle('Coconut Malled You!')
            .setDescription('Heres a Coconut Mall')
            .setImage('https://i0.wp.com/gamechops.com/wp-content/uploads/3000x3000-629851-0C8F7C15-9B49-4F35-B152712046201CEC-0-6085681-coconutmall-scaled.jpg?w=2560&ssl=1')
            .setColor('#57c2f6')
        message.channel.send({ embeds: [embed] });

    } else if (['clear', 'ban', 'kick', 'mute', 'unmute', 'test', 'say'].includes(command)) {
        if (!message.member || !hasStaffRole(message.member)) {
            const embed = new EmbedBuilder()
                .setTitle('Ultimate Access Denied')
                .setDescription('You must be a staff member to use this command! Sucks to be you, and youre are not being frocks')
                .setColor('#E74C3C');
            return message.channel.send({ embeds: [embed] });
        } else if (command === 'say') {
            const channelMention = message.mentions.channels.first();
            const text = args.slice(1).join(' ');
    
            if (!channelMention || !text) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Please mention a channel and provide a message to say.')
                    .setColor('#E74C3C');
                message.channel.send({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setDescription(text)
                    .setColor('#1ABC9C');
                channelMention.send({ embeds: [embed] });
            }

        } else if (command === 'test') {
            const embed = new EmbedBuilder()
            .setTitle('This is The Test Command!')
            .setDescription('The Purpose of this is for boltythefluffywolf to practice making commands!')
            .setColor('#aa1b92')
            .setThumbnail('https://media.discordapp.net/attachments/1332447469921112125/1334232686088294563/Screenshot_2025-01-24_at_1.24.01_AM.png?ex=679bc885&is=679a7705&hm=4584f97e45abeb95cabfaf89995c40a2819339cc617d6009733284b95c6795fe&=&format=webp&quality=lossless&width=248&height=240')
            message.channel.send({ embeds: [embed] });
    
        } else if (command === 'clear') {
            const amount = parseInt(args[0], 10);
            if (isNaN(amount) || amount <= 0 || amount > 100) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Please provide a number of messages to delete (1-100).')
                    .setColor('#E74C3C');
                message.channel.send({ embeds: [embed] });
            } else {
                message.channel.bulkDelete(amount, true).then(() => {
                    const embed = new EmbedBuilder()
                        .setTitle('Messages Cleared')
                        .setDescription(`Successfully deleted **${amount}** messages.`)
                        .setColor('#1ABC9C');
                    message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 5000));
                }).catch(err => {
                    console.error(err);
                    const embed = new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('There was an error trying to delete messages in this channel.')
                        .setColor('#E74C3C');
                    message.channel.send({ embeds: [embed] });
                });
            }
        }

        if (command === 'ban') {
            const user = message.mentions.users.first();
            if (!user) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('You must mention a user to ban.')
                    .setColor('#E74C3C');
                return message.channel.send({ embeds: [embed] });
            }
            const reason = args.slice(1).join(' ') || 'No reason provided.';
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                member.ban({ reason })
                    .then(() => {
                        const embed = new EmbedBuilder()
                            .setTitle('User Banned')
                            .setDescription(`${user.tag} has been banned for: **${reason}**`)
                            .setColor('#E74C3C');
                        message.channel.send({ embeds: [embed] });
                    })
                    .catch(err => {
                        console.error(err);
                        const embed = new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription('There was an error trying to ban the user.')
                            .setColor('#E74C3C');
                        message.channel.send({ embeds: [embed] });
                    });
            }
        }

        if (command === 'kick') {
            const user = message.mentions.users.first();
            if (!user) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('You must mention a user to kick.')
                    .setColor('#E74C3C');
                return message.channel.send({ embeds: [embed] });
            }
            const reason = args.slice(1).join(' ') || 'No reason provided.';
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                member.kick({ reason })
                    .then(() => {
                        const embed = new EmbedBuilder()
                            .setTitle('User Kicked')
                            .setDescription(`${user.tag} has been kicked for: **${reason}**`)
                            .setColor('#E74C3C');
                        message.channel.send({ embeds: [embed] });
                    })
                    .catch(err => {
                        console.error(err);
                        const embed = new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription('There was an error trying to kick the user.')
                            .setColor('#E74C3C');
                        message.channel.send({ embeds: [embed] });
                    });
            }
        }

        if (command === 'mute') {
            const user = message.mentions.users.first();
            if (!user) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('You must mention a user to mute.')
                    .setColor('#E74C3C');
                return message.channel.send({ embeds: [embed] });
            }
            const reason = args.slice(1).join(' ') || 'No reason provided.';
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                member.timeout(60000, reason) // Timeout for 1 minute
                    .then(() => {
                        const embed = new EmbedBuilder()
                            .setTitle('User Muted')
                            .setDescription(`${user.tag} has been muted for: **${reason}**`)
                            .setColor('#E74C3C');
                        message.channel.send({ embeds: [embed] });
                    })
                    .catch(err => {
                        console.error(err);
                        const embed = new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription('There was an error trying to mute the user.')
                            .setColor('#E74C3C');
                        message.channel.send({ embeds: [embed] });
                    });
            }
        }

        if (command === 'unmute') {
            const user = message.mentions.users.first();
            if (!user) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('You must mention a user to unmute.')
                    .setColor('#E74C3C');
                return message.channel.send({ embeds: [embed] });
            }
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                member.timeout(null) // Remove the timeout
                    .then(() => {
                        const embed = new EmbedBuilder()
                            .setTitle('User Unmuted')
                            .setDescription(`${user.tag} has been unmuted.`)
                            .setColor('#1ABC9C');
                        message.channel.send({ embeds: [embed] });
                    })
                    .catch(err => {
                        console.error(err);
                        const embed = new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription('There was an error trying to unmute the user.')
                            .setColor('#E74C3C');
                        message.channel.send({ embeds: [embed] });
                    });
            }
        }
    }
});

client.on('messageCreate', (message) => {
    const prefix = '>'; // Set your desired prefix here
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'dm') {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply("You don't have permission to use this command.");
      }
  
      const user = message.mentions.users.first();
      if (!user) {
        return message.reply("Please mention a user to DM.");
      }
  
      const dmContent = args.slice(1).join(' ');
      if (!dmContent) {
        return message.reply("Please provide a message to send.");
      }
  
      user.send(dmContent)
        .then(() => message.reply(`Message sent to ${user.tag}`))
        .catch(error => message.reply("Couldn't send the DM. The user might have DMs disabled."));
    }
  });

  client.on('messageCreate', async (message) => {
    const prefix = '>'; // Set your desired prefix here
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'poll') {
      // Check if the user has permission to create polls (optional)
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.reply("You don't have permission to create polls.");
      }
  
      // Check if there are enough arguments
      if (args.length < 3) {
        return message.reply('Usage: >poll "Question" "Option 1" "Option 2" ...');
      }
  
      // Extract the question and options
      const question = args.shift().replace(/"/g, '');
      const options = args.map(opt => opt.replace(/"/g, ''));
  
      // Create the embed
      const pollEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📊 Poll')
        .setDescription(question)
        .setTimestamp()
        .setFooter({ text: `Poll created by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
  
      // Add options to the embed
      const emojiList = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
      options.forEach((option, index) => {
        if (index < 10) {
          pollEmbed.addFields({ name: `Option ${index + 1}`, value: `${emojiList[index]} ${option}` });
        }
      });
  
      // Send the embed and add reactions
      try {
        const pollMessage = await message.channel.send({ embeds: [pollEmbed] });
        for (let i = 0; i < options.length && i < 10; i++) {
          await pollMessage.react(emojiList[i]);
        }
      } catch (error) {
        console.error('Error creating poll:', error);
        message.reply('An error occurred while creating the poll.');
      }
    }
  });

  const prefix = '>'; // Set your desired prefix here
  client.on('messageCreate', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'se') {
      if (!message.member.permissions.has('MANAGE_GUILD')) {
        return message.reply("You don't have permission to use this command.");
      }
  
      const channel = message.mentions.channels.first() || message.channel;
      const [title, description, color] = args.join(' ').split('|').map(arg => arg.trim());
  
      if (!title || !description) {
        return message.reply('Usage: !se #channel Title | Description | Color (optional)');
      }
  
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color || '#0099ff')
        .setTimestamp()
        .setFooter({ text: `Sent by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
  
      channel.send({ embeds: [embed] })
        .then(() => message.reply(`Embed sent successfully to ${channel}`))
        .catch(error => {
          console.error(error);
          message.reply('There was an error sending the embed');
        });
    }
  });

// Bot login
client.login(process.env.TOKEN);
