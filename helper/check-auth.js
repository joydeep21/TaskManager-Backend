const jwt = require("jsonwebtoken");
const constant = require("./constant");
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
// const verifyAsync = util.promisify(jwt.verify);

module.exports = async (req, res, next) => {
  // console.log("hiiii===}}}");
  try {
    const host = req.headers.host;
    const domainname = req.hostname;
    const token = req.headers.authorization.split(" ")[1];
    // console.log("bhxbhb",token,"gcgfcc",req.headers.authorization,host ,domainname);

    
    if (token == null) return res.sendStatus(401);
    if (
      domainname != "localhost" &&
      domainname != "192.168.46.130" &&
      host != "localhost:3008" &&
      host != "192.168.46.130:3005" &&
      domainname!="task-manger-backend-skr2.onrender.com" &&
      host !="task-manger-backend-skr2.onrender.com"
    ) {
      return res.sendStatus(401);
    } else {
      const decoded = await jwt.verify(token, constant.secretKey);
      req.id = decoded.id;
      // if (user.status === active) {
      //   res.set("Connection", "close");
      //   next();
      // } else {
      //   return res
      //     .status(403)
      //     .json({ code: 1, result: [], message: "User blocked" });
      // }
      next();
    }
  } catch (error) {
    console.log(error,"error");
    res
      .status(401)
      .json({ code: 1, result: error, message: "Authentication failed" });
  }
};
