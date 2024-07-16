const TelegramBot = require('node-telegram-bot-api');
const random = require('lodash/random');
const schedule = require('node-schedule');
const http = require('http');

// Remplacez 'YOUR_BOT_TOKEN' par le token de votre bot Telegram
const bot = new TelegramBot('5670838538:AAGFKGb0S7_2WzOtoLGEOXslEeyC9nlAsH0', { polling: true });

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
const scheduledTimes = [
    '0-30/8 8 * * *',    // De 8h00 à 8h30 chaque 5 min
    '0-10/15 9 * * *',   // De 9h00 à 9h30 chaque 10 min
    '30-59/20 9-10 * * *', // De 9h30 à 11h chaque 15 min
    '0-7/10 12 * * *',    // De 12h à 13h chaque 7 min
    '0-30/15 16 * * *',  // De 16h à 16h30 chaque 10 min
    '25-50/5 16 * * *',  // De 16h25 à 16h50 chaque 3 min
    '0-30/15 17 * * *',  // De 17h à 17h30 chaque 10 min
    '0-14/20 18 * * *',  // De 18h à 19h chaque 15 min
    '0-5/10 20 * * *',    // De 20h à 20h30 chaque 5 min
    '30-50/15 20 * * *', // De 20h30 à 22h30 chaque 20 min
    '0-20/5 22 * * *',   // De 22h à 22h20 chaque 3 min
    '0-30/10 23 * * *',  // De 23h à 00h chaque 15 min
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
