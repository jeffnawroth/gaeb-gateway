import {
  AvaConversionClient,
  DestinationGaebExchangePhase,
  DestinationGaebType,
  FileParameter,
  GaebConversionClient,
  ProjectDto,
} from "../AVACloudClient/api";
import { getGlobalAccessToken } from "./DanglIdentity";
import { fileDownload } from "./HelperMethods";

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
    getGlobalAccessToken()
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
    getGlobalAccessToken()
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
    getGlobalAccessToken()
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
