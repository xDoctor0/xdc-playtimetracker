const { Client, Intents, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS],
});

let playtimeData = {};

const data = new SlashCommandBuilder()
    .setName('playtime')
    .setDescription('Fetch or reset player playtimes.')
    .addSubcommand(subcommand =>
        subcommand.setName('check')
            .setDescription('Check playtime')
            .addStringOption(option => option.setName('license').setDescription('Player license').setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand.setName('reset')
            .setDescription('Reset playtime')
            .addStringOption(option => option.setName('license').setDescription('Player license').setRequired(false)));

client.once('ready', () => {
    console.log('Bot is online!');
    client.application.commands.create(data);
});

onNet('syncPlaytimeToJS', (name, license, playtime) => {
    playtimeData[license] = { name, playtime };
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName, options } = interaction;
    if (commandName === 'playtime') {
        const license = options.getString('license');
        if (interaction.options.getSubcommand() === 'check') {
            const playerData = playtimeData[license];
            if (playerData) {
                const embed = new MessageEmbed()
                    .setColor('#ffcc00')
                    .setTitle('Player Playtime Details 🎮')
                    .setDescription('Fetching detailed information about the player...')
                    .setThumbnail('https://cdn.discordapp.com/attachments/1298289183336431727/1314190232387846196/1535595039.creatureofhabit_scp-049official.png?ex=6752de87&is=67518d07&hm=d9d263a908f7ed245ca48498c8f88d42fb0e93c4d6837c0ce6dd7d5952f5a1c1&') 
                    .setFooter({ text: 'Playtime Tracker | xDoctor', iconURL: 'https://cdn.discordapp.com/attachments/1298289183336431727/1314190232387846196/1535595039.creatureofhabit_scp-049official.png?ex=6752de87&is=67518d07&hm=d9d263a908f7ed245ca48498c8f88d42fb0e93c4d6837c0ce6dd7d5952f5a1c1&' }) 
                    .setTimestamp();

                const sentMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
                
                setTimeout(() => {
                    embed.addField('👤 Player Name', playerData.name, false);
                    interaction.editReply({ embeds: [embed] });
                }, 1000);

                setTimeout(() => {
                    embed.addField('🔑 License', license, false);
                    interaction.editReply({ embeds: [embed] });
                }, 2000);

                setTimeout(() => {
                    embed.addField('⏱️ Minutes Played', `${playerData.playtime} minutes`, false);
                    interaction.editReply({ embeds: [embed] });
                }, 3000);

                setTimeout(() => {
                    embed.addField('🌐 Server', 'xDoctor', false);
                    interaction.editReply({ embeds: [embed] });
                }, 4000);

            } else {
                interaction.reply(`❌ No data found for license: ${license}`);
            }
        } else if (interaction.options.getSubcommand() === 'reset') {
            if (license) {
                delete playtimeData[license];
                emit('resetPlaytimeForLicense', license);
                interaction.reply(`✅ Playtime for **${license}** has been reset.`);
            } else {
                playtimeData = {};
                emit('resetAllPlaytimes');
                interaction.reply('✅ All playtimes have been reset.');
            }
        }
    }
});

client.login(''); // add your bot token
