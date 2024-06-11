const connection = require('./connection');

const getAll = async (conversations_id, limit = 20, page = 1) => {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM messages WHERE deleted_at IS NULL';
    let params = [];

    if (conversations_id) {
        query += ' AND conversations_id = ?';
        params.push(conversations_id);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [messages] = await connection.execute(query, params);
    return messages.reverse(); // reverse to show the most recent messages last
};

const getById = async (id) => {
    const [message] = await connection.execute('SELECT * FROM messages WHERE id = ? AND deleted_at IS NULL', [id]);
    if (message.length === 0) {
        return null;
    }
    return message[0];
};

const createMessage = async (message) => {
    const { conversations_id, sender, text, image_url } = message;
    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO messages (conversations_id, sender, text, image_url, created_at) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.execute(query, [conversations_id, sender, text, image_url || null, dateUTC]);

    const [newMessage] = await connection.execute('SELECT * FROM messages WHERE id = ?', [result.insertId]);
    return newMessage[0];
};

const deleteMessage = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();
    const query = 'UPDATE messages SET deleted_at = ? WHERE id = ?';
    await connection.execute(query, [dateUTC, id]);

    return { message: 'Mensagem deletada com sucesso' };
};

const updateMessage = async (id, message) => {
    const { sender, text, image_url } = message;
    const dateUTC = new Date(Date.now()).toUTCString();

    const [existingMessage] = await connection.execute('SELECT * FROM messages WHERE id = ? AND deleted_at IS NULL', [id]);
    if (existingMessage.length === 0) {
        return null;
    }

    const query = 'UPDATE messages SET sender = ?, text = ?, image_url = ?, updated_at = ? WHERE id = ?';
    await connection.execute(query, [sender, text, image_url || null, dateUTC, id]);

    const [updatedMessage] = await connection.execute('SELECT * FROM messages WHERE id = ?', [id]);
    return updatedMessage[0];
};

module.exports = {
    getAll,
    getById,
    createMessage,
    deleteMessage,
    updateMessage
};
