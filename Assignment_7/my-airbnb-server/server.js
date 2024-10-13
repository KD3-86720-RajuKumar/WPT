const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require("./config");
const utils = require("./utils");

const app = express();
app.use(cors());
app.use(express.json());

app.use((request, response, next) => {
  if (
    request.url === "/user/login" ||
    request.url === "/user/register"

    //request.url.startwith("/image/")
  ) {
    next();
  } else {
    //console.log("No Json Token Not Available");
    //get the Token
    //const token = request.headers["token"];
    const authtoken = request.headers.authorization;
    const token = authtoken.split(" ")[1];
    console.log("$ ", token);

    if (!token || token.length === 0) {
      response.send(utils.createErrorResult("missing token"));
    } else {
      try {
        //verify the token
        const payload = jwt.verify(token, config.secret);

        //add the user Id to the request
        request.userId = payload["id"];

        //TODO: expiry logic

        //call the real route
        next();
      } catch (ex) {
        response.send(utils.createErrorResult("invalid token"));
      }
    }
  }
});

//add the routs
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const propertyRouter = require("./routes/property");
const bookingRouter = require("./routes/booking");
const imageRouter = require("./routes/image");

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/property", propertyRouter);
app.use("/booking", bookingRouter);
app.use("/image", imageRouter);

app.listen(4000, "0.0.0.0", () => {
  console.log("server started on port 4000");
});
