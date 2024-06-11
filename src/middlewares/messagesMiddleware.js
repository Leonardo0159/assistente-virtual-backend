const validateMandatory = (req, res, next) => {
    const { conversations_id, sender, text } = req.body;

    if (!conversations_id || !sender || !text) {
        return res.status(400).json({ erro: 'Os campos conversations_id, sender e text são obrigatórios' });
    }

    if (!['user', 'assistant'].includes(sender)) {
        return res.status(400).json({ erro: 'O campo sender deve ser "user" ou "assistant"' });
    }

    next();
};

module.exports = {
    validateMandatory,
};
