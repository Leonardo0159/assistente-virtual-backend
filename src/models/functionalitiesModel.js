const connection = require('./connection');

const getAll = async () => {
    const [rows] = await connection.execute('SELECT * FROM functionalities');
    return rows;
};

const getById = async (id) => {
    const [rows] = await connection.execute('SELECT * FROM functionalities WHERE id = ?', [id]);
    return rows[0];
};

const createFunctionality = async ({ name, description }) => {
    const [result] = await connection.execute(
        'INSERT INTO functionalities (name, description) VALUES (?, ?)',
        [name, description]
    );
    return { id: result.insertId, name, description };
};

const deleteFunctionality = async (id) => {
    const [result] = await connection.execute(
        'DELETE FROM functionalities WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
};

const updateFunctionality = async (id, { name, description }) => {
    const [result] = await connection.execute(
        'UPDATE functionalities SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
    );
    return result.affectedRows > 0;
};

module.exports = {
    getAll,
    getById,
    createFunctionality,
    deleteFunctionality,
    updateFunctionality,
};
