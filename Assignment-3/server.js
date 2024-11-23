const express = require("express");
var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.static('./Assignment-3/public'));


let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

server.get("/about-me", (req, res) => {
  return res.render("about-me");
});
server.get("/", (req, res) => {
  return res.render("homepage");
});
server.get('/form', (req, res) => {
  res.render('form'); // Render form.ejs
});
server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
})