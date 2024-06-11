const functionalitiesModel = require('../models/functionalitiesModel');

const getAll = async (req, res) => {
    const functionalities = await functionalitiesModel.getAll();
    return res.status(200).json(functionalities);
};

const createFunctionality = async (req, res) => {
    const { name, description } = req.body;
    const newFunctionality = await functionalitiesModel.createFunctionality({ name, description });
    return res.status(201).json(newFunctionality);
};

const deleteFunctionality = async (req, res) => {
    const { id } = req.params;
    const deleted = await functionalitiesModel.deleteFunctionality(id);
    if (!deleted) {
        return res.status(404).json({ erro: 'Funcionalidade não encontrada ou já deletada' });
    }
    return res.status(200).json({ message: 'Funcionalidade deletada com sucesso' });
};

const updateFunctionality = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await functionalitiesModel.updateFunctionality(id, { name, description });
    if (!updated) {
        return res.status(404).json({ erro: 'Funcionalidade não encontrada ou já deletada' });
    }
    return res.status(200).json({ message: 'Funcionalidade atualizada com sucesso' });
};

module.exports = {
    getAll,
    createFunctionality,
    deleteFunctionality,
    updateFunctionality
};
