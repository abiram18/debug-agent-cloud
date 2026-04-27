const db = require('./db');

async function login() {
  console.log("🔐 Auth service");

  const user = await db.findUser();
  return "token-" + user.id;
}

module.exports = { login };