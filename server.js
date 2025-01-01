const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

// Inicializa o Express
const app = express();
const port = 3000;

// Middleware para lidar com o corpo das requisições em JSON
app.use(bodyParser.json());

// Seu webhook do Discord
const discordWebhookURL = 'https://discord.com/api/webhooks/YOUR_DISCORD_WEBHOOK_URL';

// Rota para receber as notificações do PagSeguro
app.post('/webhook', async (req, res) => {
    const { notificationCode } = req.body;

    if (!notificationCode) {
        return res.status(400).send('notificationCode é necessário');
    }

    try {
        // Substitua com seus dados de email e token PagSeguro
        const email = 'SEU_EMAIL_PAGSEGURO';
        const token = 'SEU_TOKEN_PAGSEGURO';
        const urlPagSeguro = `https://ws.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=${email}&token=${token}`;

        // Consulta a transação com o PagSeguro usando o notificationCode
        const response = await axios.get(urlPagSeguro);
        
        // Processa os dados da transação
        const transactionData = response.data;

        // Envia as informações para o Discord
        const discordMessage = {
            content: `Nova notificação do PagSeguro!\nStatus: ${transactionData.status}\nCódigo de Transação: ${transactionData.code}`,
        };

        await axios.post(discordWebhookURL, discordMessage);

        // Responde para o PagSeguro que a notificação foi recebida corretamente
        res.status(200).send('Notificação recebida com sucesso');
    } catch (error) {
        console.error('Erro ao consultar a transação ou enviar para o Discord:', error);
        res.status(500).send('Erro interno');
    }
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
