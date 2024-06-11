const authCallback = (req, res) => {
    res.redirect('/');  // Redirect to the home page after successful login
};

const logout = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            req.logout((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Logout failed', error: err });
    }
};

const currentUser = (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
};

module.exports = {
    authCallback,
    logout,
    currentUser
};
