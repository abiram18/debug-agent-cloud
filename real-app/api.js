const auth = require('./auth');

async function getUser() {
  console.log("📡 API called");

  const token = await auth.login();
  return { name: "Abi", token };
}

module.exports = { getUser };