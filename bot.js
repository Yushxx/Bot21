const TelegramBot = require('node-telegram-bot-api');
const random = require('lodash/random');
const schedule = require('node-schedule');
const http = require('http');

// Remplacez 'YOUR_BOT_TOKEN' par le token de votre bot Telegram
const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });

function generate_sequence() {
    const sequence = ["🟦", "🟦", "🟦", "🟦", "✈️"];
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = random(0, i);
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]]; // Permuter les éléments
    }
    return sequence.join(" ");
}

// Modèle de séquence
const sequenceTemplate = `
🔔 CONFIRMED ENTRY!
✈️ kamikaze: 4
🔐 tentatives: 3
⏰ Validity: 5 minutes

`;

// Fonction pour envoyer une séquence dans le canal
function sendSequenceToChannel(chatId) {
    const sequenceMessage = `
${sequenceTemplate}
2.0:${generate_sequence()}
1.6:${generate_sequence()}
1.4:${generate_sequence()}
1.2:${generate_sequence()}

🚨 FONCTIONNE UNIQUEMENT SUR MELBET ET LINEBET AVEC LE CODE PROMO ZFree221 ✅️ !

[S'inscrire](https://bit.ly/3Wk9323)
[Comment jouer](https://t.me/c/2042765108/68)
`;

    // Options du clavier inline
    const inlineKeyboard = {
        inline_keyboard: [
            [
                { text: 'S\'inscrire', url: 'https://bit.ly/3Wk9323' },
                { text: 'Comment jouer', url: 'https://t.me/c/2042765108/68' }
            ]
        ]
    };

    const options = {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: inlineKeyboard
    };

    // Envoi du message dans le canal
    bot.sendMessage(chatId, sequenceMessage, options);
}

// Planification des envois de séquences
const scheduleJobWithInterval = (startHour, endHour, intervalMinutes) => {
    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            if (hour === endHour && minute > 0) break;  // Ne pas dépasser la fin de l'heure
            schedule.scheduleJob({ hour, minute }, () => {
                sendSequenceToChannel('@solkah00'); // Remplacez par l'identifiant de votre canal
            });
        }
    }
};



const scheduledTimes = [
    '0 8 * * *',     // 8h00
    '45 8 * * *',    // 8h45
    '30 9 * * *',    // 9h30
    '15 10 * * *',   // 10h15
    '0 12 * * *',    // 12h00
    '45 12 * * *',   // 12h45
    '3 13 * * *',     //13h03
    '30 13 * * *',   // 13h30
    '15 14 * * *',   // 14h15
    '0 16 * * *',    // 16h00
    '45 16 * * *',   // 16h45
    '30 17 * * *',   // 17h30
    '15 18 * * *',   // 18h15
    '0 18 * * *',    // 18h00
    '30 18 * * *',   // 18h30
    '0 19 * * *',    // 19h00
    '30 19 * * *',   // 19h30
    '0 20 * * *',    // 20h00
    '30 20 * * *',   // 20h30
    '0 21 * * *',    // 21h00
    '30 21 * * *',   // 21h30
    '0 22 * * *',    // 22h00
    '30 22 * * *',   // 22h30
    '0 23 * * *',    // 23h00
    '30 23 * * *',   // 23h30
    '0 0 * * *',     // 00h00
];

scheduledTimes.forEach((time) => {
    schedule.scheduleJob(time, () => {
        sendSequenceToChannel('@solkah00'); // Remplacez par l'identifiant de votre canal
    });
});


// Gérer la commande /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const inlineKeyboard = {
        inline_keyboard: [
            [
                { text: 'Voir la pomme', callback_data: 'voir_la_pomme' },
                { text: 'Test', callback_data: 'test_message' } // Bouton de test
            ]
        ]
    };
    const replyMarkup = { reply_markup: inlineKeyboard };

    bot.sendMessage(chatId, 'Cliquez sur "Voir la pomme" pour générer les séquences :', replyMarkup);
});

// Gérer le clic sur le bouton "Voir la pomme" ou "Test"
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'voir_la_pomme') {
        sendSequenceToChannel(chatId);
    } else if (query.data === 'test_message') {
        sendSequenceToChannel('-1002042765108'); // Envoi de séquence au canal
    }
});

// Code keep_alive pour éviter que le bot ne s'endorme
http.createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
}).listen(8080);
