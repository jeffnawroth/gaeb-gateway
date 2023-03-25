import axios from "axios";

const clientId = "13737747-8c15-4e1d-bec8-690e9b61d632";
const clientSecret = "DBxJi2XLr7fUdRg";
const identityTokenUrl = "https://identity.dangl-it.com/connect/token";
//const avacloudBaseUrl = "https://avacloud-api.dangl-it.com";

let globalAccessTokenAvaCloud: string;
let globalAccessTokenOpenCde: string;

/**

    This function retrieves an access token for the AvaCloud API.
    It internally calls the getAccessToken function with "avacloud" as the scope parameter.
    */
export async function getAccessTokenAvaCloud() {
  globalAccessTokenAvaCloud = await getAccessToken("avacloud");
}

/**

    This function retrieves an access token for the OpenCDE API.
    It internally calls the getAccessToken function with "dangl_opencde" as the scope parameter.
    */
export async function getAccessTokenOpenCDE() {
  globalAccessTokenOpenCde = await getAccessToken("dangl_opencde");
}

/**

    This function returns the globally stored access token for the AvaCloud API.
    @returns {string} - the access token string
    */
export function getGlobalAccessTokenAvaCloud() {
  return globalAccessTokenAvaCloud;
}

/**

    This function returns the globally stored access token for the OpenCDE API.
    @returns {string} - the access token string
    */
export function getGlobalAccessTokenOpenCde() {
  return globalAccessTokenOpenCde;
}

/**

    This function retrieves an access token from the identity provider using the client credentials flow.
    It takes in a scope parameter to specify the desired scope for the token.
    @param {string} scope - the desired scope for the access token
    @returns {Promise<string>} - a promise that resolves with the access token string on success, or throws an error on failure
    */
async function getAccessToken(scope: string) {
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
      scope: scope,
    });

    const response = await axios.post(
      identityTokenUrl,
      requestBody,
      requestConfig
    );

    return response.data.access_token;
  } catch (error) {
    console.error(error);
    alert(
      "Failed to obtain an access token. Have you read the documentation and set up your OAuth2 client?"
    );
  }
}
