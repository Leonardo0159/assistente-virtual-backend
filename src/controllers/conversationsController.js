const conversationsModel = require('../models/conversationsModel');
const assistantModel = require('../models/assistentModel');

const getAll = async (req, res) => {
    const conversations = await conversationsModel.getAll();
    return res.status(200).json(conversations);
};

const createConversation = async (req, res) => {
    const { assistant_id } = req.body;

    const assistant = await assistantModel.getById(assistant_id);
    if (!assistant) {
        return res.status(400).json({ erro: 'Assistente não encontrado' });
    }

    const createdConversation = await conversationsModel.createConversation(req.body);

    if (createdConversation.erro !== undefined) {
        return res.status(400).json({ erro: createdConversation.erro });
    } else {
        return res.status(201).json(createdConversation);
    }
};

const deleteConversation = async (req, res) => {
    const { id } = req.params;
    const deletedConversation = await conversationsModel.deleteConversation(id);

    if (deletedConversation.erro !== undefined) {
        return res.status(400).json({ erro: deletedConversation.erro });
    } else {
        return res.status(200).json(deletedConversation);
    }
};

const updateConversation = async (req, res) => {
    const { id } = req.params;
    const updatedConversation = await conversationsModel.updateConversation(id, req.body);

    if (!updatedConversation) {
        return res.status(404).json({ erro: 'Conversa não encontrada' });
    }

    if (updatedConversation.erro !== undefined) {
        return res.status(400).json({ erro: updatedConversation.erro });
    } else {
        return res.status(200).json(updatedConversation);
    }
};

module.exports = {
    getAll,
    createConversation,
    deleteConversation,
    updateConversation
};
