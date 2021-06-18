let mongo;
async function start() {
    const { Mongo } = require('../../../src/scripts/database/mongo');
    mongo = new Mongo('resummoner', 'vk');
    await mongo.connect();
}

start();

module.exports = (router) => {
    const routes = router();

    routes.get('/:skip', async (req, res) => {
        try {
            res.send(await mongo.getRecords(3, Number(req.params.skip)));
        } catch (e) {
            console.error(e);
            res.status(500).send('Database connect error');
        }
    });

    routes.get('/', (req, res) => res.status(404).send("Not found"));

    return routes;
};
