const connection = require('./connection');

const findOrCreateUser = async (profile) => {
  const query = 'SELECT * FROM users WHERE google_id = ?';
  const [users] = await connection.execute(query, [profile.id]);

  if (users.length > 0) {
    return users[0];
  }

  const dateUTC = new Date(Date.now()).toUTCString(); // Formato UTC string
  const insertQuery = `
      INSERT INTO users (google_id, name, email, profile_pic, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
  const [result] = await connection.execute(insertQuery, [
    profile.id,
    profile.displayName,
    profile.emails[0].value,
    profile.photos[0].value,
    dateUTC
  ]);

  const [newUser] = await connection.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
  return newUser[0];
};

const findUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const [users] = await connection.execute(query, [id]);
  return users[0];
};

module.exports = {
  findOrCreateUser,
  findUserById
};
