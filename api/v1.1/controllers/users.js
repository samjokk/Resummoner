const { User } = require('../../../src/models/User');
const { UserException } = require('../../../src/modules/exceptions/userException');
const { check, validationResult } = require('express-validator');
const { 
    isEmailAlreadyUsed, 
    regUser, 
    authUser, 
    getUser, 
    updateUser, 
    checkPotentialUser, 
    hashPassword,
    addFavorite, 
    removeFavorite
} = require('../../../src/modules/users/main');

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (router) => {
    const routes = router();
    routes.post(
    '/register', 
    [
        check('email', 'Некорректно введена почта!').normalizeEmail().isEmail()
    ], 
    async (req, res) => {
        try {
            const error = validationResult(req);
            if(!error.isEmpty()) throw new UserException(error.array()[0].msg, 400);

            const user = new User(req.body, 'reg');
            const authorizedUser = await regUser(user);
            if(!authorizedUser) throw new UserException('Что-то пошло не так. Обратитесь к администратору', 500);
            
            const date = new Date();
            const token = jwt.sign(
                { userId: authorizedUser._id, from: date, to: date.setHours(date.getHours() + 1)},
                config.get('jwtToken')
            );

            res.status(201).json({ token, userId: authorizedUser._id, message: 'Вы успешно зарегистрировались!' });
        } catch(e) {
            res.status(e.statusCode).send({ 'message': e.message});
        }
    });

    routes.post(
    '/auth',
    [
        check('email', 'Некорректно введена почта!').normalizeEmail().isEmail()
    ],
    async (req, res) => {
        try {
            const error = validationResult(req);
            if(!error.isEmpty()) throw new UserException(error.array()[0].msg, 400);

            const user = new User(req.body, 'auth');
            const authorizedUser = await authUser(user);
            if(!authorizedUser) throw new UserException('Что-то пошло не так. Обратитесь к администратору', 500);
            
            const date = new Date();
            const token = jwt.sign(
                { userId: authorizedUser._id, from: date, to: date.setHours(date.getHours() + 1) },
                config.get('jwtToken')
            );

            res.status(200).json({ token, userId: authorizedUser._id, message: 'Вы авторизованы!'});
        } catch(e) {
            res.status(e.statusCode).send({ 'message': e.message });
        }
    });

    routes.get(
    '/',
    async (req, res) => {
        try {
            const token = await req.header('Authorization');
            if(token === 'null') throw new UserException('Не авторизован', 204);

            const decoded = jwt.verify(token, config.get('jwtToken'));
            if(Date.now() >= decoded.to) throw new UserException('Некорректный токен', 205);

            const userInfo = await getUser(decoded.userId);
            res.json({ 
                firstName: userInfo.firstName, 
                lastName: userInfo.lastName, 
                email: userInfo.email, 
                favorites: userInfo.favorites,
                image: userInfo.image
            });
        } catch(e) {
            res.status(e.statusCode).send({ 'message': e.message });
        }
    });

    routes.put(
    '/update',
    [
        check('email', 'Некорректно введена почта!').normalizeEmail().isEmail()
    ],
    async (req, res) => {
        try {
            const token = await req.header('Authorization');
            if(token === 'null') throw new UserException('Не авторизован', 204);

            let decoded;
            try { decoded = jwt.verify(token, config.get('jwtToken')); }
            catch(e) { throw new UserException('Некорректный токен', 205); }
            if(Date.now() >= decoded.to) throw new UserException('Некорректный токен', 205);

            const error = validationResult(req);
            if(!error.isEmpty()) throw new UserException(error.array()[0].msg, 400);

            const userId = decoded.userId;
            const body = await req.body;
            await isEmailAlreadyUsed(userId, body.email);
            
            const password = body.password;
            let passIsNotEmpty = false;
            const user = {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email
            }
            if(password && password !== '') { 
                user.password = password; 
                passIsNotEmpty = true; 
            }
            
            checkPotentialUser(user, passIsNotEmpty);
            if(passIsNotEmpty) user.password = await hashPassword(user.password);

            const values = { "$set": user }

            await updateUser(userId, values);
            res.status(200).send({ 'message': 'Изменения сохранены!' });
        } catch(e) {
            res.status(e.statusCode).send({ 'message': e.message });
        }
    });

    routes.put(
    '/image',
    async (req, res) => {
        try {
            const token = await req.header('Authorization');
            if(token === 'null') throw new UserException('Не авторизован', 204);

            let decoded;
            try { decoded = jwt.verify(token, config.get('jwtToken')); }
            catch(e) { throw new UserException('Некорректный токен', 205); }
            if(Date.now() >= decoded.to) throw new UserException('Некорректный токен', 205);

            const userId = decoded.userId;
            const body = await req.body;

            const values = {
                "$set": {
                    image: body.image
                }
            }

            await updateUser(userId, values);
            res.status(200).send({ 'message': 'Фотография обновлена!' });
        } catch(e) {
            console.log(res.status, '\n', e);
            res.status(e.statusCode).send({ 'message': e.message });
        }
    });

    routes.get(
    '/favorites',
    async (req, res) => {
        try {
            const token = await req.header('Authorization');
            if(token === 'null') throw new UserException('Не авторизован', 204);

            let decoded;
            try { decoded = jwt.verify(token, config.get('jwtToken')); } 
            catch(e) { throw new UserException('Некорректный токен', 205); }
            if(Date.now() >= decoded.to) throw new UserException('Некорректный токен', 205);

            const postId = await req.header('PostId');
            if(!postId) throw new UserException('Некорректно передана информация о посте', 400);
            const userId = decoded.userId;
            const action = req.query.action;
            const flag = action === 'remove';

            let message;
            if(flag) message = await removeFavorite(userId, postId);
            else message = await addFavorite(userId, postId);
            res.status(200).send({ message });
        } catch(e) {
            if(e.statusCode) res.status(e.statusCode).send({ 'message': e.message });
            else res.status(500).send({ message: 'Что-то пошло не так... Обратитесь к администратору', error: e });
        }
    });
    return routes;
}