require('dotenv').config();
const { fyersModel } = require("fyers-api-v3");

var fyers = new fyersModel({ path: "logs/", enableLogging: true });

//setting credentials
fyers.setAppId(process.env.APP_ID);
fyers.setRedirectUrl(process.env.REDIRECT_URI);

//generating authcode URL
const loginUrl = fyers.generateAuthCode();
//use url to generate auth code
console.log("login URL: ",loginUrl);


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

    // Set the access token
    fyers.setAccessToken(tokenRes.access_token);
    console.log("=> Access token set");

    // Call API categories
    await require("./modules/account")(fyers);
    await require("./modules/market")(fyers);
  
  } catch (error) {
    console.error("=> Error occurred:", error);
  }
}

// Run the async function
run();

