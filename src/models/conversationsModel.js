const connection = require('./connection');

const getAll = async () => {
    const [conversations] = await connection.execute('SELECT * FROM conversations WHERE deleted_at IS NULL');
    return conversations;
};

const getById = async (id) => {
    const [conversation] = await connection.execute('SELECT * FROM conversations WHERE id = ? AND deleted_at IS NULL', [id]);
    if (conversation.length === 0) {
        return null;
    }
    return conversation[0];
};

const createConversation = async (conversation) => {
    const { assistant_id } = conversation;
    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO conversations (assistant_id, created_at) VALUES (?, ?)';
    const [result] = await connection.execute(query, [assistant_id, dateUTC]);

    const [newConversation] = await connection.execute('SELECT * FROM conversations WHERE id = ?', [result.insertId]);
    return newConversation[0];
};

const deleteConversation = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();
    const query = 'UPDATE conversations SET deleted_at = ? WHERE id = ?';
    await connection.execute(query, [dateUTC, id]);

    return { message: 'Conversa deletada com sucesso' };
};

const updateConversation = async (id, conversation) => {
    const { assistant_id } = conversation;
    const dateUTC = new Date(Date.now()).toUTCString();

    const [existingConversation] = await connection.execute('SELECT * FROM conversations WHERE id = ? AND deleted_at IS NULL', [id]);
    if (existingConversation.length === 0) {
        return null;
    }

    const query = 'UPDATE conversations SET assistant_id = ?, updated_at = ? WHERE id = ?';
    await connection.execute(query, [assistant_id, dateUTC, id]);

    const [updatedConversation] = await connection.execute('SELECT * FROM conversations WHERE id = ?', [id]);
    return updatedConversation[0];
};

module.exports = {
    getAll,
    getById,
    createConversation,
    deleteConversation,
    updateConversation
};
