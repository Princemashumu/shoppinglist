const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('Datanase.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route to get items by user ID
server.get('/fruitVeg', (req, res) => {
  const userId = req.query.userId;
  const items = router.db.get('fruitVeg').filter({ userId }).value();
  res.jsonp(items);
});

// Add similar routes for other categories
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
