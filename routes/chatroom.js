const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const roomController = require("../controllers/roomController");

const auth = require("../middlewares/auth"); //For verifying jwt

router.get("/", auth, catchErrors(roomController.getChatroomByName));
router.post("/", auth, catchErrors(roomController.createChatroom));
router.get('/messages/:chatroomId', auth, catchErrors(roomController.getChatroomMessages));


module.exports = router;