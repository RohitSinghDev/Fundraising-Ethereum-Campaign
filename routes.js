const routes = require("next-routes")();

routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:address/requests", "/campaigns/requests/index")
  .add("/campaigns/:address", "/campaigns/show")
  .add("/campaigns/:address/requests/new", "/campaigns/requests/new");
// after : is the wildacrd or variable

module.exports = routes;
