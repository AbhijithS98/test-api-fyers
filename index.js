var fyersModel = require("fyers-api-v3").fyersModel;
var fyers = new fyersModel({ path: "logs/", enableLogging: true });
require('dotenv').config();
const fs = require('fs');


//setting credentials
fyers.setAppId(process.env.APP_ID);
fyers.setRedirectUrl(process.env.REDIRECT_URI);

//generating authcode URL
var URL = fyers.generateAuthCode();
//use url to generate auth code
console.log("login URL: ",URL);


//only run if auth code is available
async function run() {
  if (!process.env.AUTH_CODE || process.env.AUTH_CODE === "NULL") {
    console.log("=> AUTH_CODE not set. Login using the URL above and update .env.");
    return;
  }

  try {
    // Generate access token
    const tokenRes = await fyers.generate_access_token({
      client_id: process.env.APP_ID,
      secret_key: process.env.APP_SECRET,
      auth_code: process.env.AUTH_CODE,
    });

    if (tokenRes.s !== "ok") {
      console.error("=> Failed to get access token:", tokenRes);
      return;
    }

    const accessToken = tokenRes.access_token;
    console.log("=> Access token received.", accessToken);

    // Set the access token
    fyers.setAccessToken(accessToken);

    // Make API calls

    // Get profile
    const profile = await fyers.get_profile();
    fs.writeFileSync("profile.json", JSON.stringify(profile, null, 2));
    console.log("=> Saved profile.json");

    // Get live quotes
    const quotes = await fyers.getQuotes(["NSE:SBIN-EQ", "NSE:TCS-EQ"]);
    fs.writeFileSync("quotes.json", JSON.stringify(quotes, null, 2));
    console.log("=> Saved quotes.json");

    // Get market depth
    const depth = await fyers.getMarketDepth({
      symbol: ["NSE:SBIN-EQ", "NSE:TCS-EQ"],
      ohlcv_flag: 1,
    });
    fs.writeFileSync("marketDepth.json", JSON.stringify(depth, null, 2));
    console.log("=> Saved marketDepth.json");

  } catch (error) {
    console.error("=> Error occurred:", error);
  }
}

// Run the async function
run();