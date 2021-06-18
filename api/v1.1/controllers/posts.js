const { PostException } = require('../../../src/modules/exceptions/postException');
const config = require('config');

let mongo;
let mongoDayAnalysis;
let mongoWeakAnalysis;
let mongoMonthAnalysis;
async function start() {
    const { Mongo } = require('../../../src/scripts/database/mongo');
    mongo = new Mongo('resummoner', 'Posts');
    mongoDayAnalysis = new Mongo('resummoner', 'DayAnalysis');
    mongoWeakAnalysis = new Mongo('resummoner', 'WeakAnalysis');
    mongoMonthAnalysis = new Mongo('resummoner', 'MonthAnalysis');
    await mongo.connect();
    await mongoDayAnalysis.connect();
    await mongoWeakAnalysis.connect();
    await mongoMonthAnalysis.connect();
}

function err(message) { throw new PostException(message); }

function getSourcesIds(sources) {
    const sourcesComparison = config.get('sourcesComparison');
    const keys = Object.keys(sourcesComparison);
    const sourcesIds = [];
    for (const source of sources) {
        if (!keys.includes(source)) err('Неверно выбраны источники');
        const sourceId = parseInt(sourcesComparison[source], 10);
        if (!sourcesIds.includes(sourceId)) sourcesIds.push(sourceId);
    }
    return sourcesIds;
}

function getThemeId(theme) {
    if (!theme || typeof (theme) != 'string' || theme === '') err('Неверно выбрана тема');
    let themeId;
    try {
        themeId = parseInt(theme, 10);
    } catch (e) { err('Неверно выбрана тема'); }
    if (!themeId || themeId <= 0 || themeId > 5) err('Неверно выбрана тема');
    return themeId;
}

function getUnixTime(reqTimeFrom, reqTimeTo) {
    const to = Date.parse(reqTimeTo) / 1000;
    const from = Date.parse(reqTimeFrom) / 1000;
    return [from, to];
}

start();

module.exports = (router) => {
    const routes = router();

    routes.get('/', async (req, res) => {
        try {
            const records = await mongo.getRecords(req.query.limit, req.query.skip);
            if (records === null) res.status(404).send('Bad skip or limit');
            else res.status(200).send(records);
        } catch (e) {
            console.error(e);
            res.status(500).send('Database connect error');
        }
    });

    routes.get('/themes', async (req, res) => {
        try {
            if (!req.query.theme) err('Не выбрана тема');
            if (!req.query.to || !req.query.from) err('Неверно указан временной промежуток');
            if (!req.query.sources) err('Не выбраны источники');
            if (req.query.sessionSkip !== 0 && !req.query.sessionSkip) err('Не указан шаг');
            const sourcesStr = req.query.sources.replace(/\s+/g, " ").trim()
            if (!sourcesStr) err('Не выбраны источники');
            const sources = sourcesStr.split(' ');
            if (!sources) err('Неверно выбраны источники');

            const sourcesIds = getSourcesIds(sources);
            const themeId = getThemeId(req.query.theme);
            const [from, to] = getUnixTime(req.query.from, req.query.to);
            const limit = parseInt(req.query.limit, 10);
            const skip = parseInt(req.query.sessionSkip, 10);
            const posts = await mongo.getPosts(themeId, to, from, sourcesIds, limit, skip);

            res.status(200).send({
                message: 'Успешно!',
                sessionSkip: skip,
                posts
            });
        } catch (e) {
            if (e.statusCode) res.status(e.statusCode).send({ message: e.message });
            else {
                console.error(e);
                res.status(500).send('Что-то пошло не так');
            }
        }
    });

    routes.get('/linechart', async (req, res) => {
        try {
            const timeDifference = req.query.lastDate - req.query.firstDate;
            console.log(timeDifference);
            const monthUnixTime = config.get('monthUnixTime');
            let data;
            if (timeDifference <= monthUnixTime) data = await mongoDayAnalysis.getDataForLineChart(req.query.indexTheme - 1);
            else if (timeDifference <= monthUnixTime * 6) data = await mongoWeakAnalysis.getDataForLineChart(req.query.indexTheme - 1);
            else if (timeDifference > monthUnixTime * 6) data = await mongoMonthAnalysis.getDataForLineChart(req.query.indexTheme - 1);
            if (data === null) res.status(404).send('Data on theme ' + req.query.indexTheme + ' is not received');
            else {
                res.status(200).send(data);
            }
        } catch (e) {
            console.error(e);
            res.status(500).send('Database connect error');
        }
    });

    return routes;
};
