const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const dotenv = require('dotenv');

dotenv.config();

// 명언 API URL
const QUOTEAPI = 'https://api.quotable.io/random';

// 명언을 출력할 채널 ID (디스코드에서 해당 채널의 ID를 가져와서 설정)
const channelId = process.env.CHANNEL;  

// 일정 시간 간격 
const intervalTime = 60000;

client.once('ready', () => {    
    // 일정 시간마다 명언을 출력하는 함수 호출
    setInterval(async () => {
        try {
            const channel = await client.channels.fetch(channelId);
            if (channel && channel.isTextBased()) {
                const response = await axios.get(QUOTEAPI);
                const quote = response.data.content + " - " + response.data.author;
                channel.send(quote);
            } else {
                console.error('Channel is not a text channel');
            }
        } catch (error) {
            console.error('Error fetching quote or sending message: ', error);
        }
    }, intervalTime);
});

client.on('messageCreate', async message => {
    // "!quote" 명령어를 감지
    if (message.content === '!quote') {
        try {
            // 명언 가져오기
            const response = await axios.get(QUOTEAPI);
            const quote = response.data.content + " - " + response.data.author;
            message.channel.send(quote);
        } catch (error) {
            console.error('Error fetching quote: ', error);
            message.channel.send('Sorry, I could not fetch a quote at the moment.');
        }
    }
        // "!help" 명령어를 감지
        if (message.content === '!help') {
            const helpMessage = `
            **Bot Commands:**
            1분마다 명언을 출력합니다!
            \`!quote\` - 명언을 가져오기.
            \`!help\` - 도움말.
            `;
            message.channel.send(helpMessage);
        }
});

// 봇 로그인
client.login(process.env.DISCORD_TOKEN);
