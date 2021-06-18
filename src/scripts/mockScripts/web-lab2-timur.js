"use strict";

import { vkApiUri, token, version, offset, vkPostUri, showReceived, timeout, postsCount as _postsCount, fileName } from './config.json';
import fetch from 'node-fetch';
import { writeFile } from 'fs';

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

async function getGroupInfo(groupId) {
    const response = await fetch(`${vkApiUri}groups.getById?access_token=${token}&v=${version}&group_id=${groupId}`);
    if (response.ok) {
        const json = await response.json();
        return json;
    }
    console.error('Error');
}

async function getGroupMembers(groupId) {
    const response = await fetch(`${vkApiUri}groups.getMembers?access_token=${token}&count=1&v=${version}&group_id=${groupId}`);
    if (response.ok) {
        const json = await response.json();
        return json;
    }
    console.error('Error');
}

async function getPosts(groupId, postsCount) {
    if (postsCount < 0 || postsCount > 100) {
        console.error(`Incorrect value of the number of requested posts: ${postsCount}. 'postCount' must be no more than 100 and no less than 0`);
        return null;
    }
    const response = await fetch(`${vkApiUri}wall.get?access_token=${token}&count=${postsCount}&offset=${offset}&filter=owner&v=${version}&owner_id=-${groupId}`);
    if (response.ok) {
        const json = await response.json();
        return json;
    }
    console.error('Error');
}

async function getArrayOfPostComments(groupId, postId) {
    const response = await fetch(`${vkApiUri}wall.getComments?access_token=${token}&owner_id=-${groupId}&post_id=${postId}&v=${version}`);
    if (response.ok) {
        const json = await response.json();
        const items = json.response.items;
        let array = [];
        for(let i = 0; i < items.length; i++) {
            array.push({
                "id": items[i].id,
                "text": items[i].text
            });
        }
        return array;
    }
}

function getPostUrl(post) {
    return `${vkPostUri}${post.owner_id}_${post.id}`;
}

function getPostDate(post) {
    return new Date(post.date * 1000);
}

async function getArrayOfPosts(groupId, items) {
    let array = [];
    let currentObj;
    let post;
    let comments;
    for(let i = 0; i < items.length; i++) {
        if(showReceived)
            console.log('Posts received: ', i + 1);
        post = items[i];
        comments = await getArrayOfPostComments(groupId, post.id);
        currentObj = {
            "id": post.id,
            "link": getPostUrl(post),
            "date": getPostDate(post),
            "text": post.text,
            "views": post.views.count,
            "likes": post.likes.count,
            "reposts": post.reposts.count,
            "comments": {
                "count": post.comments.count,
                "comments": comments
            }
        }
        array.push(currentObj);
        await sleep(timeout);
    }
    return array;
}

async function createFile(id) {
    console.log(`Finding information by id: ${id}`);
    const jsonGroupInfo = await getGroupInfo(id);
    const groupInfo = jsonGroupInfo.response[0];

    const jsonGroupMembers = await getGroupMembers(id);
    const groupMembers = jsonGroupMembers.response;

    const posts = await getPosts(id, _postsCount);
    const arrayOfPosts = await getArrayOfPosts(id, posts.response.items);
    console.log('Complete!');

    let group = {
        "id": groupInfo.id,
        "name": groupInfo.name,
        "photo": groupInfo.photo_100,
        "membersCount": groupMembers.count,
        "posts": arrayOfPosts
    };

    writeFile(`${fileName}.json`, JSON.stringify(group, null, 2), err => { if(err) console.error(err); });
    console.log('Information has been written to groupInfo.json');
}

function getId() {
    console.log('Write group id:');
    const stdin = process.openStdin();
    stdin.on('data', async (id) => { 
        await createFile(Number(id)); 
        console.log('Write group id (or press Ctrl+C):'); 
    });
}

getId();
