const messagesModel = require('../models/messagesModel');
const conversationsModel = require('../models/conversationsModel');
const openai = require('../config/openai');

const getAll = async (req, res) => {
    const { conversations_id } = req.query;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const messages = await messagesModel.getAll(conversations_id, limit, page);
    return res.status(200).json(messages);
};

const createMessage = async (req, res) => {
    const { conversations_id, sender, text, image_url } = req.body;

    const conversation = await conversationsModel.getById(conversations_id);
    if (!conversation) {
        return res.status(400).json({ erro: 'Conversa não encontrada ou foi deletada' });
    }

    const createdMessage = await messagesModel.createMessage({ conversations_id, sender, text, image_url });

    if (createdMessage.erro !== undefined) {
        return res.status(400).json({ erro: createdMessage.erro });
    }

    // Enviar mensagem para o ChatGPT
    if (sender === 'user') {
        const userName = 'Leo';  // Substitua pelo nome real do usuário
        const assistantName = 'Lucy';  // Substitua pelo nome real do assistente

        const prompt = `
        Olá, Assistente Virtual ${assistantName}! Meu nome é ${userName}, seu usuário.
        
        Aqui está a frase do usuário para você analisar e responder conforme a função desejada:
        
        "${text}"
        
        Funções disponíveis:
        1. Responder as Perguntas.
        2. Agendar reunião no Google Meet.
        3. Criar tabela no Google Sheets.
        4. Agendar tarefa no Google Calendar.
        5. Previsão do Tempo.
        6. Envio de Mensagens e Chamadas.
        7. Reproduzir Músicas e Vídeos.
        8. Navegação e Direções.
        9. Notícias e Atualizações.
        10. Assistência em Tarefas Domésticas.
        
        **Instruções adicionais:**
        - Responda de maneira amigável e pessoal, como se estivesse conversando com um amigo.
        - Sempre responda com uma saudação inicial (\`greeting\`) se o usuário iniciar com uma saudação (por exemplo, "Bom dia", "Boa tarde", "Olá", etc.).
        - Não inclua a saudação na resposta (\`response\`) (por exemplo, "Bom dia", "Boa tarde", "Olá", etc.).
        - Identifique a função solicitada pelo usuário e responda adequadamente.
        - Se a função solicitada estiver disponível nas funções listadas, forneça uma resposta positiva e útil.
        - Se a função solicitada não estiver disponível, indique isso na \`unavailable_function\`.
        - Sempre coloque \`greeting\`, \`function_identified\`, \`response\`, \`unavailable_function\` mesmo que a resposta seja vazia "".
        - Sempre responda o usuario na resposta (\`response\`), nem que sejá só para agradecer e encerrar a conversa.

        **Responda com as seguintes variáveis de saída:**

        - \`greeting\`: Saudação inicial (somente se o usuário iniciar com uma saudação).
        - \`function_identified\`: Função identificada.
        - \`response\`: Resposta adequada com base na função, sem saudação.
        - \`unavailable_function\`: Mensagem para funções não disponíveis.

        **Exemplo de resposta**:
        {
          "greeting": "Bom dia, Leo!",
          "function_identified": "Responder a Perguntas",
          "response": "Como posso te ajudar hoje?",
          "unavailable_function": ""
        }
        `;

        const retryRequest = async (retries = 3) => {
            try {
                const response = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 150,
                });

                return response;
            } catch (error) {
                if (error.code === 'insufficient_quota' && retries > 0) {
                    // Enviar mensagem ao usuário sobre a tentativa
                    await messagesModel.createMessage({
                        conversations_id,
                        sender: 'assistant',
                        text: 'Tentando novamente em 10 segundos...',
                        image_url: null,
                    });

                    console.warn('Quota exceeded, retrying in 10 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    return retryRequest(retries - 1);
                }
                throw error;
            }
        };

        try {
            const response = await retryRequest();

            const chatGPTReply = JSON.parse(response.choices[0].message.content.trim());
            console.log(chatGPTReply)
            const { greeting, response: assistantResponse } = chatGPTReply;

            const messagesToReturn = [{ sender: 'user', text }];
            if (greeting || assistantResponse) {
                const fullResponse = `${greeting} ${assistantResponse}`.trim();
                const autoReply = await messagesModel.createMessage({
                    conversations_id,
                    sender: 'assistant',
                    text: fullResponse,
                    image_url: null,
                });

                if (autoReply.erro !== undefined) {
                    return res.status(400).json({ erro: autoReply.erro });
                }

                messagesToReturn.push({ sender: 'assistant', text: fullResponse });
            }

            return res.status(201).json(messagesToReturn);
        } catch (error) {
            console.error('Error communicating with OpenAI:', error);

            // Enviar mensagem ao usuário sobre a falha final
            await messagesModel.createMessage({
                conversations_id,
                sender: 'assistant',
                text: 'Crédito esgotado. Por favor, verifique seu plano e detalhes de cobrança.',
                image_url: null,
            });

            return res.status(500).json({ erro: 'Erro ao comunicar com o ChatGPT' });
        }
    } else {
        return res.status(201).json(createdMessage);
    }
};

const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const deletedMessage = await messagesModel.deleteMessage(id);

    if (deletedMessage.erro !== undefined) {
        return res.status(400).json({ erro: deletedMessage.erro });
    } else {
        return res.status(200).json(deletedMessage);
    }
};

const updateMessage = async (req, res) => {
    const { id } = req.params;
    const { sender, text, image_url } = req.body;

    if (!sender || !text) {
        return res.status(400).json({ erro: 'Os campos sender e text são obrigatórios' });
    }

    if (!['user', 'assistant'].includes(sender)) {
        return res.status(400).json({ erro: 'O campo sender deve ser "user" ou "assistant"' });
    }

    const updatedMessage = await messagesModel.updateMessage(id, { sender, text, image_url });

    if (!updatedMessage) {
        return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    if (updatedMessage.erro !== undefined) {
        return res.status(400).json({ erro: updatedMessage.erro });
    } else {
        return res.status(200).json(updatedMessage);
    }
};

module.exports = {
    getAll,
    createMessage,
    deleteMessage,
    updateMessage
};
