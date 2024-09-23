const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

async function requireAuth(req, res, next) {
  try {
    //Read token off cookies
    const token = req.cookies.Authorization;
    //Decode the token
    const decoded = jwt.verify(token, process.env.SECRET);
    //Check token expiration
    if (Date.now() > decoded.exp) {
      return res.sendStatus(401); // token is expired
    }
    //Find admin using the decoded sub from token
    const admin = await Admin.findById(decoded.sub);
    if (!admin) return res.sendStatus(401);
    //Attach admin to request
    req.admin = admin._id;
    // Approve authorization
    next();
  } catch (err) {
    console.error("Authorization Error: ", err);
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = requireAuth;
