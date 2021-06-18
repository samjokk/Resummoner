const { uri } = require('../env');

async function getUser(token) {
    if(token) {
        const res = await fetch(`${uri}api/users/`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        return res;
    }
}

async function regUser(user) {
    const res = await fetch(`${uri}api/users/register`, {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: user
    });
    return res;
}

async function updateUser(user) {
    const res = await fetch(`${uri}api/users/update`, {
        method: 'PUT',
        body: user,
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
        }
    });
    return res;
}

async function updateImage(user) {
    const res = await fetch(`${uri}api/users/image`, {
        method: 'PUT',
        body: user,
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
        }
    });
    return res;
}

async function getPosts(theme, sources, from, to, sessionSkip) {
    let limit;
    if(sessionSkip === 0) limit = 5;
    else limit = 3;
    const res = await fetch(`${uri}api/posts/themes?theme=${theme}&sources=${sources}&from=${from}&to=${to}&limit=${limit}&sessionSkip=${sessionSkip}`);
    return res;
}

module.exports = { getUser, regUser, updateUser, updateImage, getPosts }