import axios from "axios";
import {
  AvaConversionClient,
  DestinationGaebExchangePhase,
  DestinationGaebType,
  FileParameter,
  GaebConversionClient,
  ProjectDto,
} from "./AVACloudClient/api";
import { fileDownload } from "./HelperMethods";

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
    undefined,
    undefined,
    undefined,
    globalAccessToken
  );

  return avaProjectNew;
}

/* export async function convertGaeb2Gaeb(
  file: any,
  destinationType: DestinationGaebType,
  targetPhase: DestinationGaebExchangePhase
) {
  const apiClient = new GaebConversionClient();

  const fileParam: FileParameter = {
    data: file,
    fileName: "gaebFile",
  };

  const fileName = getFileName(file, destinationType, targetPhase);

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

  return { gaebFile, fileName };
} */

export async function convertAva2Gaeb(
  avaProject: ProjectDto,
  destinationType: DestinationGaebType,
  targetPhase: DestinationGaebExchangePhase,
  phaseId: number,
  fileName?: string
) {
  const apiClient = new AvaConversionClient();

  const newfileName = getFileName(phaseId, fileName);

  const gaebFile = await apiClient.convertToGaeb(
    avaProject,
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

  fileDownload(gaebFile.data, newfileName);
}

export function getFileName(phaseId: number, fileName?: string | undefined) {
  const extensionMap = {
    83: ".X83",
    84: ".X84",
    93: ".X93",
    94: ".X94",
  } as any;

  const defaultExtension = ".X00";
  const extension = extensionMap[phaseId] || defaultExtension;

  const fileNameWithoutExtension = fileName?.split(".")[0] ?? "gaebFile";
  return `${fileNameWithoutExtension}${extension}`;
}
