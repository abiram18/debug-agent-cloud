const auth = require('./auth');

async function getUser() {
  console.log("📡 API called");

  // logical issue (wrong condition)
  let isValid = false;
  if (isValid = true) { // 💀 logical error
    console.log("Logic broken");
  }

  return await auth.login();
}

module.exports = { getUser };