const validateMandatory = (req, res, next) => {
    const { assistant_id } = req.body;

    if (assistant_id === undefined) {
        return res.status(400).json({ message: 'O campo "assistant_id" é obrigatório' });
    }

    if (assistant_id === '') {
        return res.status(400).json({ message: '"assistant_id" não pode ser vazio' });
    }

    if (assistant_id === null) {
        return res.status(400).json({ message: '"assistant_id" não pode ser null' });
    }

    next();
};

module.exports = {
    validateMandatory
};
