const connection = require('./connection');

const getAll = async () => {
    const [assistants] = await connection.execute('SELECT * FROM assistants WHERE deleted_at IS NULL');
    return assistants;
};

const getById = async (id) => {
    const [assistant] = await connection.execute('SELECT * FROM assistants WHERE id = ? AND deleted_at IS NULL', [id]);
    if (assistant.length === 0) {
        return null;
    }
    return assistant[0];
};

const createAssistant = async (assistant) => {
    const { user_id, name } = assistant;
    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO assistants (user_id, name, created_at) VALUES (?, ?, ?)';
    const [result] = await connection.execute(query, [user_id, name, dateUTC]);

    const [newAssistant] = await connection.execute('SELECT * FROM assistants WHERE id = ?', [result.insertId]);
    return newAssistant[0];
};

const deleteAssistant = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();
    const query = 'UPDATE assistants SET deleted_at = ? WHERE id = ?';
    await connection.execute(query, [dateUTC, id]);

    return { message: 'Assistente deletado com sucesso' };
};

const updateAssistant = async (id, assistant) => {
    const { name } = assistant;
    const dateUTC = new Date(Date.now()).toUTCString();

    const [existingAssistant] = await connection.execute('SELECT * FROM assistants WHERE id = ? AND deleted_at IS NULL', [id]);
    if (existingAssistant.length === 0) {
        return null;
    }

    const query = 'UPDATE assistants SET name = ?, updated_at = ? WHERE id = ?';
    await connection.execute(query, [name, dateUTC, id]);

    const [updatedAssistant] = await connection.execute('SELECT * FROM assistants WHERE id = ?', [id]);
    return updatedAssistant[0];
};

module.exports = {
    getAll,
    getById,
    createAssistant,
    deleteAssistant,
    updateAssistant
};
