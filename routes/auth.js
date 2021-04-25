const router = require("express").Router();

const loginController = require("../controllers/auth/loginController");
const registerController = require("../controllers/auth/registerController");
const logoutController = require("../controllers/auth/logoutController");

const verifyController = require("../controllers/auth/verifyController");

router.use("/login", loginController);
router.use("/register", registerController);
router.use("/logout", logoutController);
router.use("/verification", verifyController);

module.exports = router;
