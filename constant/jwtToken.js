const jwt = require('jsonwebtoken');

function createToken(user) {
    let token = jwt.sign(
        {
          userId: user._id.toString(),
          organisation: "Appzia-Technology",
        },
        "ONE-STOP-SERVICE"
      );
      return token
}

module.exports = createToken;