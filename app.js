const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
//const authexpressJwt = require("./helper/jwt");
const errorHandler = require("./helper/errorHandler");

app.use(cors());
app.options("*", cors());
//app.use(authexpressJwt.call);

// Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
console.log("Secret from env:", process.env.secret);

//app.use(authJwt);
app.use(errorHandler);

// Routers
const ProductsRouter = require("./routers/products");
const OrdersRouter = require("./routers/orders");
const CategoriesRouter = require("./routers/categories");
const UsersRouter = require("./routers/users");
const CouponRouter = require("./routers/coupon");
const cartRouters = require("./routers/carts");

//const authexpressJwt = require("./helper/jwt");

// Define API URL and port
const api = process.env.API_URL || "/api";
const port = process.env.PORT || 3001;

app.use(`${api}/products`, ProductsRouter);
app.use(`${api}/orders`, OrdersRouter);
app.use(`${api}/categories`, CategoriesRouter);
app.use(`${api}/users`, UsersRouter);
app.use(`${api}/coupon`, CouponRouter);
app.use(`${api}/carts`, cartRouters);

// MongoDB connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    // useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1); // Exit process if database connection fails
  });

// Start server
app.listen(port, () => {
  console.log(`Server is now running at http://localhost:${port}`);
});
