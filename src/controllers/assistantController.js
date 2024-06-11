const assistantModel = require('../models/assistentModel');
const userModel = require('../models/userModel');

const getAll = async (req, res) => {
    const assistants = await assistantModel.getAll();
    return res.status(200).json(assistants);
};

const createAssistant = async (req, res) => {
    const { user_id } = req.body;

    const user = await userModel.findUserById(user_id);
    if (!user) {
        return res.status(400).json({ erro: 'Usuário não encontrado' });
    }

    const createdAssistant = await assistantModel.createAssistant(req.body);

    if (createdAssistant.erro !== undefined) {
        return res.status(400).json({ erro: createdAssistant.erro });
    } else {
        return res.status(201).json(createdAssistant);
    }
};

const deleteAssistant = async (req, res) => {
    const { id } = req.params;
    const deletedAssistant = await assistantModel.deleteAssistant(id);

    if (deletedAssistant.erro !== undefined) {
        return res.status(400).json({ erro: deletedAssistant.erro });
    } else {
        return res.status(200).json(deletedAssistant);
    }
};

const updateAssistant = async (req, res) => {
    const { id } = req.params;
    const updatedAssistant = await assistantModel.updateAssistant(id, req.body);

    if (!updatedAssistant) {
        return res.status(404).json({ erro: 'Assistente não encontrado' });
    }

    if (updatedAssistant.erro !== undefined) {
        return res.status(400).json({ erro: updatedAssistant.erro });
    } else {
        return res.status(200).json(updatedAssistant);
    }
};

module.exports = {
    getAll,
    createAssistant,
    deleteAssistant,
    updateAssistant
};
