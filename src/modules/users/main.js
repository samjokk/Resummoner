const { Mongo } = require('../../scripts/database/mongo');
const { UserException } = require('../exceptions/userException');
const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');
let mongo;

async function connect() {
    if(!mongo) {
        mongo = new Mongo('resummoner', 'Users');
        await mongo.connect();
    }
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}

function getMongoId(userId) {
    return new mongodb.ObjectID(userId);
}

async function isEmailAlreadyUsed(userId, email) {
    const probable = await mongo.collection.findOne({ email });
    if(probable && probable._id != userId) 
        throw new UserException('Пользователь с такой почтой уже зарегистрирован!', 409);
}

function checkPotentialUser(user, passIsNotEmpty) {
    if(!user.firstName) throw new UserException('Некорректно указана фамилия!', 400);
    if(!user.lastName) throw new UserException('Некорректно указано имя!', 400);
    if(passIsNotEmpty && (!user.password || user.password.length < 8)) throw new UserException('Длина пароля меньше 8 символов!', 400);
    if(!user.email || user.email.length < 5) throw new UserException('Неверно введена почта!', 400);
}

function checkAuthUser(user) {
    if(!user.email || user.email.length < 5) throw new UserException('Некорректно введена почта!', 401);
    if(!user.password || user.password.length < 8) throw new UserException('Длина пароля меньше 8 символов!', 401);
}

async function regUser(user) {
    checkPotentialUser(user);

    const probable = await mongo.collection.findOne({ email: user.email });
    if(probable) throw new UserException('Пользователь с такой почтой уже зарегистрирован!', 409);

    user.password = await hashPassword(user.password);
    await mongo.addRecord(user);
    return await mongo.collection.findOne({ email: user.email });
}

async function authUser(user) {
    checkAuthUser(user);

    const probable = await mongo.collection.findOne({ email: user.email });
    if(!probable) throw new UserException('Неверный логин или пароль!', 401);
    
    const isMatch = await bcrypt.compare(user.password, probable.password);
    if(!isMatch) throw new UserException('Неверный логин или пароль!', 401);

    return probable;
}

async function getUser(userId) {
    const o_id = getMongoId(userId);
    const user = await mongo.collection.findOne({ _id: o_id });
    return user;
}

async function updateUser(userId, values) {
    const o_id = getMongoId(userId);
    const query = { _id: o_id };
    await mongo.collection.updateOne(query, values);
}

async function addFavorite(userId, postId) {
    let messageж
    const user_id = getMongoId(userId);
    const userInfo = await getUser(userId);
    const favorites = userInfo.favorites;
    if(!favorites.includes(postId)) favorites.push(postId)
    else {
        message = "Такая публикация уже добавлена";
        return message;        
    }
    const query = { _id: user_id };
    const values = { '$set': {
        favorites
    }};
    await mongo.collection.updateOne(query, values);
    message = "Публикация добавлена в избранное!";
    return message;
}

async function removeFavorite(userId, postId) {
    let message = "Такой публикации в избранных нет";
    const user_id = getMongoId(userId);
    const userInfo = await getUser(userId);
    const userFavorites = userInfo.favorites;
    const favorites = [];
    for(const post of userFavorites)
        if (post !== postId) 
            favorites.push(post);
        else message = "Публикация удалена из избранных!";

    const query = { _id: user_id };
    const values = { '$set': {
        favorites
    }};
    await mongo.collection.updateOne(query, values);
    return message;
}

module.exports = { 
    connect, 
    isEmailAlreadyUsed, 
    regUser, 
    authUser, 
    getUser, 
    checkPotentialUser, 
    checkAuthUser, 
    updateUser, 
    hashPassword,
    addFavorite,
    removeFavorite
};