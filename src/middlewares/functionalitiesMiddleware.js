const validateMandatory = (req, res, next) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ erro: 'Os campos name e description são obrigatórios' });
    }

    next();
};

module.exports = {
    validateMandatory,
};
