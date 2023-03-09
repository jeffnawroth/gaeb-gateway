import axios from "axios";
import {
  AvaConversionClient,
  DestinationGaebExchangePhase,
  DestinationGaebType,
  FileParameter,
  GaebConversionClient,
  ProjectDto,
} from "./AVACloudClient/api";

const clientId = "13737747-8c15-4e1d-bec8-690e9b61d632";
const clientSecret = "DBxJi2XLr7fUdRg";
const identityTokenUrl = "https://identity.dangl-it.com/connect/token";
const avacloudBaseUrl = "https://avacloud-api.dangl-it.com";

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

export async function getAvaProject(file: any) {
  const apiClient = new GaebConversionClient();

  const fileParam: FileParameter = {
    data: file,
    fileName: "",
  };

  const avaProject = await apiClient.convertToAva(
    fileParam,
    undefined,
    undefined,
    undefined,
    globalAccessToken
  );

  return avaProject;
}

export async function convertAva2Ava(avaProject: ProjectDto) {
  const client = new AvaConversionClient();

  const avaProjectNew = await client.convertToAva(
    avaProject,
    true,
    undefined,
    undefined,
    globalAccessToken
  );

  return avaProjectNew;
}

export async function convertGaeb2Gaeb(
  file: any,
  destinationType: DestinationGaebType,
  targetPhase: DestinationGaebExchangePhase
) {
  const apiClient = new GaebConversionClient();

  const fileParam: FileParameter = {
    data: file,
    fileName: "gaebFile",
  };

  const fileName = getFileName(file, destinationType, targetPhase)

  const gaebFile = await apiClient.convertToGaeb(
    fileParam,
    undefined,
    destinationType,
    targetPhase,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    globalAccessToken
  );

  return {gaebFile, fileName};
}

export function getFileName(
  file: File,
  destinationType: DestinationGaebType,
  targetPhase: DestinationGaebExchangePhase
) {
  const extensionMap = {
    GaebXml_V3_3: {
      OfferRequest: ".X83",
      Offer: ".X84"
    },
    GaebXml_V3_3_Commerce: {
      OfferRequest: ".X93",
      Offer: ".X94"
    }
  } as any;

  const extension = extensionMap[destinationType][targetPhase];
  const fileNameWithoutExtension = file.name.split(".")[0];

  return `${fileNameWithoutExtension}${extension}`;
}

export async function convertAva2Gaeb(avaProject: ProjectDto) {
  const apiClient = new AvaConversionClient();
  const destinationGaebType = DestinationGaebType.GaebXml_V3_3;
  const targetExchangePhaseTransform = DestinationGaebExchangePhase.Offer;

  const gaebFile = await apiClient.convertToGaeb(
    avaProject,
    undefined,
    destinationGaebType,
    targetExchangePhaseTransform,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    globalAccessToken
  );

  return gaebFile;
}
