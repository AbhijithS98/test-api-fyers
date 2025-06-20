const { saveJSON } = require("./utils");

module.exports = async function(fyers) {
  console.log("=> Fetching account data...");

  try {
    const profile = await fyers.get_profile();
    saveJSON("profile.json", profile);

    const funds = await fyers.get_funds();
    saveJSON("funds.json", funds);

    const holdings = await fyers.get_holdings();
    saveJSON("holdings.json", holdings);

    const positions = await fyers.get_positions();
    saveJSON("positions.json", positions);

    const orders = await fyers.get_orders();
    saveJSON("orders.json", orders);

  } catch (err) {
    console.error(">>> Error in account module:", err);
  }
};
