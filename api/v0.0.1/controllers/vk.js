module.exports = (router) => {
  const request = require('request');
  const routes = router();
  const config = require('config');

  const meduzaOwnerId = config.get('meduzaOwnerId');
  const version = config.get('version');
  const accessToken = config.get('accessToken');

  /*routes.get('/:string/:offset', (req, res) => {
    try {
      request(`https://api.vk.com/method/wall.search?owner_id=${meduzaOwnerId}&access_token=${accessToken}&filter=owner&v=${version}&count=1&offset=${req.params.offset}&query=${config.get(req.params.string)}&extended=1`, function (error, response, body) {
        if(error)
          throw error;
  
        res.send(JSON.parse(response.body));
      });
    } 
    catch (e) {
      res.status(500).send(json('Что-то пошло не так'));
    }
  });*/

  routes.get('/test/:offset', (req, res) => {
    try {
      request(`https://api.vk.com/method/wall.get?owner_id=${meduzaOwnerId}&extended=1&access_token=${accessToken}&v=${version}&count=5&offset=${req.params.offset}`, (error, response, body) => {
        if(error) throw error;
        res.send(JSON.parse(body));
      });
    }
    catch(e) {
      res.status(500).send(json('Произошла ошибка'));
    }
  });

  routes.get('/:string', (req, res) => {
    try {
      request(`https://api.vk.com/method/wall.search?owner_id=${meduzaOwnerId}&v=${version}&access_token=${accessToken}&count=5&query=${req.params.string}&extended=0`, function (error, response, body) {
        if(error)
          throw error;
  
        res.send(JSON.parse(body));
      });
    }
    catch(e) {
      res.status(500).send(json('Что-то пошло не так'));
    }
    
  });

  routes.get('/', (req, res) => res.status(404).send("Not found"));

  return routes;
};
