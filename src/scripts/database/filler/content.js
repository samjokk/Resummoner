const fetch = require('node-fetch');
const config = require('config');
const offset = config.get('offset');
const linkCommunity = config.get('linkCommunity');
const sleepTime = config.get('sleepTime');

class Content {
    _countCount = 0;
    _lastDate;

    async fullDataCollectionFrom100Posts(idCommunity, countOffset, themes) {
        let posts = new Array();
        let sortedPosts = new Array();
        let i = 0;
        posts = await this._get100Posts(idCommunity, countOffset, themes);
        console.log("Количество постов после сортировки: " + posts.length);
        for (let post in posts) {
            posts[post].comments = new Array(); //Массив веток комментариев к посту
            posts[post].comments = await this._getCommentsOnOnePost(idCommunity, posts[post].id, posts[post].comments_count); //Получаем массив веток комментариев к каждому посту (двумерный массив)
            sortedPosts.push(posts[post]);
            console.log('Обработано постов: ' + (i + 1) + ', темы: ' + posts[post].themes);
            i++;
        }
        console.log('ЗАПРОСОВ СДЕЛАНО: ' + this._countCount);
        return sortedPosts;
    }

    async _get100Posts(idCommunity, countOffset, themes) {
        let posts = new Array();
        try {
            const getPostsURL = config.get('getPostsURL');
            await sleep(sleepTime);
            let response = await fetch(getPostsURL + linkCommunity + idCommunity + offset + (countOffset * 100));
            response = await response.json();
            this._countCount++;
            this._lastDate = response.response.items[response.response.items.length - 1].date;
            console.log('Пришло ' + response.response.items.length + ' постов');
            for (let i = 0; i < response.response.items.length; i++) {
                const textPost = await this.createTextForOnePost(response.response.items[i]);
                const themesPost = await this.recognizeThemesOfOnePost(textPost, themes);
                if (themesPost.length > 0) posts.push(await this.createObject(response.response.items[i], textPost, themesPost));
            }
        }
        catch (err) {
            console.log(err);
            console.log('Последний пост, который удалось обработать (параметр offset): ' + countOffset * 100);
        }
        return posts;
    }

    async createTextForOnePost(post) {
        let textPost = post.text;
        let addedText = '';
        try {
            if (post.attachments[0].hasOwnProperty('link')) {
                const title = post.attachments[0].link.title;
                const description = post.attachments[0].link.description;
                if (title.length > 15) {
                    if (description.length > 15) {
                        if (title.slice(0, 15) === description.slice(0, 15))
                            addedText = description;
                        else if (description.length > title.length)
                            addedText = description;
                        else addedText = title;
                    }
                    else addedText = title;
                }
            }
            else if (post.attachments[0].hasOwnProperty('video')) {
                const descriptinon = post.attachments[0].video.description;
                if (descriptinon.length > 15) addedText = descriptinon;
            }
        }
        catch { }
        if ((addedText != '') && (textPost != addedText)) {
            if (textPost[textPost.length - 1] != '.')
                textPost += '.';
            textPost += '\n' + addedText;
        }
        return textPost;
    }

    async recognizeThemesOfOnePost(textPost, themes) {
        let themesPost = new Array();
        if (textPost.includes(themes[0][0]))
            for (let j = 1; j < themes[0].length; j++)
                if (textPost.includes(themes[0][j])) {
                    themesPost.push(1);
                    break;
                }
        if (textPost.includes(themes[1][0]))
            for (let j = 1; j < themes[1].length; j++)
                if (textPost.includes(themes[1][j])) {
                    themesPost.push(2);
                    break;
                }
        if ((textPost.includes(themes[2][0])) || (textPost.includes(themes[2][1])) || (textPost.includes(themes[2][2])) || (textPost.includes(themes[2][3])))
            for (let j = 4; j < themes[2].length; j++)
                if (textPost.includes(themes[2][j])) {
                    themesPost.push(3);
                    break;
                }
        if (textPost.includes(themes[3][0]))
            for (let j = 1; j < themes[3].length; j++)
                if (textPost.includes(themes[3][j])) {
                    themesPost.push(4);
                    break;
                }
        if ((themesPost[themesPost.length - 1] != 4) && (textPost.includes(themes[3][1])) && ((textPost.includes(themes[3][6])) || (textPost.includes(themes[3][7]))))
            themesPost.push(4);
        if (textPost.includes(themes[4][0]))
            for (let j = 1; j < themes[4].length; j++)
                if (textPost.includes(themes[4][j])) {
                    themesPost.push(5);
                    break;
                }
        return themesPost;
    }

    async createObject(response, fullPostText, themes) {
        let object = new Object();
        object.id = response.id;
        object.owner_id = response.owner_id;
        object.date = response.date;
        object.text = fullPostText;
        object.comments_count = response.comments.count;
        object.likes = response.likes.count;
        object.reposts = response.reposts.count;
        object.views = response.views.count;
        try {
            object.url_photo = response.attachments[0].video.image[0].url;
            let maxWidth = response.attachments[0].video.image[0].width;
            for (let i = 1; i < response.attachments[0].video.image.length; i++)
                if (response.attachments[0].video.image[i].width > maxWidth) {
                    object.url_photo = response.attachments[0].video.image[i].url;
                    maxWidth = response.attachments[0].video.image[i].width;
                }
        }
        catch { }
        try {
            object.url_photo = response.attachments[0].link.photo.sizes[0].url;
            let maxWidth = response.attachments[0].link.photo.sizes[0].width;
            for (let i = 1; i < response.attachments[0].link.photo.sizes.length; i++)
                if (response.attachments[0].link.photo.sizes[i].width > maxWidth) {
                    object.url_photo = response.attachments[0].link.photo.sizes[i].url;
                    maxWidth = response.attachments[0].link.photo.sizes[i].width;
                }
        }
        catch { }
        if (!object.hasOwnProperty('url_photo')) object.url_photo = '';
        object.themes = themes;
        return object;
    }

    async _getCommentsOnOnePost(idCommunity, idPost, countComments) {
        const linkPost = config.get('linkPost');
        const needLikes = config.get('needLikes');
        const linkComment = config.get('linkComment');
        const requestGetCommentsURL = config.get('requestGetCommentsURL');
        let commentBranches = new Array();
        let offsetComments = 0;
        try {
            while (countComments > 0) {
                await sleep(sleepTime);
                let response = await fetch(requestGetCommentsURL + linkCommunity + idCommunity + linkPost + idPost + needLikes + offset + (offsetComments * 100));
                response = await response.json();
                this._countCount++;
                console.log('Получено ' + response.response.items.length + ' родительских комментариев');
                if (response.response.items.length === 0) break;
                countComments -= response.response.items.length;
                for (let i = 0; i < response.response.items.length; i++) { // Считываем ветку коммента
                    countComments -= response.response.items[i].thread.count;
                    if (response.response.items[i].hasOwnProperty('text') && response.response.items[i].text != '') {
                        let branchOneComment = new Array();
                        branchOneComment.push(response.response.items[i].likes.count);
                        branchOneComment.push(response.response.items[i].text);
                        //Получить дочерние комменты к 1 родительскому
                        if (response.response.items[i].thread.count > 0) {
                            await sleep(sleepTime);
                            let responseReplyComments = await fetch(requestGetCommentsURL + linkCommunity + idCommunity + linkPost + idPost + linkComment + response.response.items[i].id);
                            responseReplyComments = await responseReplyComments.json();
                            this._countCount++;
                            console.log('Получено ' + responseReplyComments.response.count + ' дочерних комментариев');
                            let limit = responseReplyComments.response.count;
                            if (limit > 100) limit = 100;
                            for (let j = 0; j < limit; j++) { // Идём по дочерним комментам
                                if (responseReplyComments.response.items[j].hasOwnProperty('text') && responseReplyComments.response.items[j].text != '') {
                                    let text = responseReplyComments.response.items[j].text;
                                    text = text.slice(text.indexOf('|') + 1);
                                    text = text.slice(0, text.indexOf(']')) + text.slice(text.indexOf(']') + 1);
                                    branchOneComment.push(text);
                                }
                            }
                        }
                        commentBranches.push(branchOneComment);
                    }
                }
                offsetComments++;
            }
            return commentBranches;
        }
        catch (err) {
            console.log(err);
            console.log('Id последнего поста который был в обработке: ' + idPost);
        }

    }

    async updateSavedPosts(objects, idCommunity) {
        const themes = config.get('themes');
        objects = await this.selectionObjectsByDate(objects);
        console.log("Все публикации из источника " + idCommunity + " отсортированы и готовы к обновлению!");
        let posts = new Array();
        if (objects.length > 0) {
            let offset = 100;
            let requestCount = 0;
            while (requestCount < objects.length) {
                requestCount += offset;
                if (requestCount > objects.length) {
                    requestCount = objects.length;
                    offset = requestCount % offset;
                }
                let requestIdsPosts = "";
                for (let i = requestCount - offset; i < requestCount; i++) requestIdsPosts += idCommunity + '_' + objects[i].id + ',';
                requestIdsPosts = requestIdsPosts.substring(0, requestIdsPosts.length - 1);
                //Запрашиваем обновлённые посты
                const getPostsByIdURL = config.get('getPostsByIdURL');
                await sleep(sleepTime);
                let response = await fetch(getPostsByIdURL + requestIdsPosts);
                response = await response.json();
                this._countCount++;
                console.log('Пришло ' + response.response.length + ' постов');
                for (let i = 0; i < response.response.length; i++) {
                    console.log('Постов пришло: ' + response.response.length);
                    console.log('Итерация: ' + i);
                    console.log('requestCount: ' + requestCount);
                    console.log('Объектов всего: ' + objects.length);

                    const textPost = await this.createTextForOnePost(response.response[i]);
                    const themesPost = await this.recognizeThemesOfOnePost(textPost, themes);;
                    let post = await this.createObject(response.response[i], textPost, themesPost);
                    post.comments = new Array(); //Массив веток комментариев к посту
                    post.comments = await this._getCommentsOnOnePost(idCommunity, post.id, post.comments_count); //Получаем массив веток комментариев к каждому посту (двумерный массив)
                    posts.push(post);
                    console.log("Добавлено обновлённых постов: " + i);
                }
            }
        }
        console.log('ЗАПРОСОВ СДЕЛАНО:' + this._countCount);
        return posts;
    }

    async selectionObjectsByDate(objects) {
        const startDate = config.get('startDateMonth')
        let sortedObjects = new Array();
        console.log("Объектов до сортировки по дате: " + objects.length);
        for (const object in objects)
            if (objects[object].date > startDate)
                sortedObjects.push(objects[object]);
        console.log("Объектов после сортировки по дате: " + sortedObjects.length);
        return sortedObjects;
    }

    getLastDate() {
        return this._lastDate;
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = { Content }
