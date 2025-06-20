const { saveJSON } = require("./utils");

module.exports = async function(fyers) {
  console.log("=> Fetching market data...");

  try {
    const quotes = await fyers.getQuotes(["NSE:SBIN-EQ", "NSE:TCS-EQ"]);
    saveJSON("quotes.json", quotes);

    const depth = await fyers.getMarketDepth({
      symbol: ["NSE:SBIN-EQ", "NSE:TCS-EQ"],
      ohlcv_flag: 1,
    });
    saveJSON("marketDepth.json", depth);
  } catch (err) {
    console.error(">>> Error in market module:", err);
  }
};
