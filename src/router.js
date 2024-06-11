const express = require('express');
const passport = require('./config/passport');

const userController = require('./controllers/userController')
const assistantController = require('./controllers/assistantController');
const assistantMiddleware = require('./middlewares/assistantMiddleware');
const conversationsController = require('./controllers/conversationsController');
const conversationsMiddleware = require('./middlewares/conversationsMiddleware');
const messagesController = require('./controllers/messagesController');
const messagesMiddleware = require('./middlewares/messagesMiddleware');
const functionalitiesController = require('./controllers/functionalitiesController');
const functionalitiesMiddleware = require('./middlewares/functionalitiesMiddleware');

const router = express.Router();

//Rotas Users
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login-failure' }),
    (req, res) => {
        res.redirect('/login-success');
    }
);
router.get('/login-success', (req, res) => {
    res.send('Login bem-sucedido! Bem-vindo, ' + req.user.displayName);
});
router.get('/login-failure', (req, res) => {
    res.send('Falha no login. Tente novamente.');
});
router.get('/auth/logout', userController.logout);
router.get('/auth/current_user', userController.currentUser);

// Rotas Assistants
router.get('/assistants', assistantController.getAll);
router.post('/assistants', assistantMiddleware.validateMandatory, assistantController.createAssistant);
router.delete('/assistants/:id', assistantController.deleteAssistant);
router.put('/assistants/:id', assistantMiddleware.validateMandatory, assistantController.updateAssistant);

// Rotas Conversations
router.get('/conversations', conversationsController.getAll);
router.post('/conversations', conversationsMiddleware.validateMandatory, conversationsController.createConversation);
router.delete('/conversations/:id', conversationsController.deleteConversation);
router.put('/conversations/:id', conversationsMiddleware.validateMandatory, conversationsController.updateConversation);

// Rotas Messages
router.get('/messages', messagesController.getAll);
router.post('/messages', messagesMiddleware.validateMandatory, messagesController.createMessage);
router.delete('/messages/:id', messagesController.deleteMessage);
router.put('/messages/:id', messagesMiddleware.validateMandatory, messagesController.updateMessage);

// Rotas Functionalities
router.get('/functionalities', functionalitiesController.getAll);
router.post('/functionalities', functionalitiesMiddleware.validateMandatory, functionalitiesController.createFunctionality);
router.delete('/functionalities/:id', functionalitiesController.deleteFunctionality);
router.put('/functionalities/:id', functionalitiesMiddleware.validateMandatory, functionalitiesController.updateFunctionality);

module.exports = router;