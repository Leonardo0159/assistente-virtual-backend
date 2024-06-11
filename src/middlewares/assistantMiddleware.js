const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.user_id === undefined) {
        return res.status(400).json({ message: 'O campo "user_id" é obrigatório' });
    }

    if (body.name === undefined) {
        return res.status(400).json({ message: 'O campo "name" é obrigatório' });
    }

    next();
};

module.exports = {
    validateMandatory
};
