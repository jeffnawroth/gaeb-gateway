import axios from "axios";

const clientId = "13737747-8c15-4e1d-bec8-690e9b61d632";
const clientSecret = "DBxJi2XLr7fUdRg";
const identityTokenUrl = "https://identity.dangl-it.com/connect/token";
//const avacloudBaseUrl = "https://avacloud-api.dangl-it.com";

let globalAccessToken: string;

export async function getAccessToken() {
  try {
    const authHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
    const requestConfig = {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const requestBody = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "avacloud",
    });

    const response = await axios.post(
      identityTokenUrl,
      requestBody,
      requestConfig
    );

    globalAccessToken = response.data.access_token;
  } catch (error) {
    console.error(error);
    alert(
      "Failed to obtain an access token. Have you read the documentation and set up your OAuth2 client?"
    );
  }
}

export function getGlobalAccessToken() {
  return globalAccessToken;
}
