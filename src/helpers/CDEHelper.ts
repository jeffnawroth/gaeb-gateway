import {
  DocumentPost,
  DocumentsApi,
  ProjectPost,
  ProjectsApi,
} from "@/openCDE API";
import { getGlobalAccessTokenOpenCde } from "./DanglIdentity";
import { fileDownload } from "./HelperMethods";

/* export async function getAllProjects() {
  const projects = await ProjectsApi.prototype.projectsGetAllProjects(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
      },
    }
  );
  return projects.data.data;
} */

/* export async function createProjectApi(projectPost: ProjectPost) {
  const projectGet = await ProjectsApi.prototype.projectsCreateProject(
    projectPost,
    {
      headers: {
        Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
      },
    }
  );
  return projectGet.data;
} */

export async function getAllDocumentsForProject(projectId: string) {
  const documents =
    await DocumentsApi.prototype.documentsGetAllDocumentsForProject(
      projectId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
        },
      }
    );

  return documents.data.data;
}

export async function uploadDocument(
  projectId: string,
  documentPost: DocumentPost,
  document: File
) {
  const documentGet =
    await DocumentsApi.prototype.documentsUploadDocumentMetadataForProject(
      projectId,
      documentPost,
      {
        headers: {
          Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
        },
      }
    );

  const documentGetNew = await uploadDocumentContent(
    projectId,
    documentGet.data.id,
    document
  );

  return documentGetNew.data;
}

export async function uploadDocumentContent(
  projectId: string,
  documentId: string,
  document: File
) {
  const documentGet =
    await DocumentsApi.prototype.documentsUploadDocumentContent(
      projectId,
      documentId,
      document,
      {
        headers: {
          Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
        },
      }
    );

  return documentGet;
}

export async function deleteDocument(projectId: string, documentId: string) {
  await DocumentsApi.prototype.documentsDeleteDocument(projectId, documentId, {
    headers: {
      Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
    },
  });
}

export async function downloadDocument(
  projectId: string,
  documentId: string,
  fileName: string
) {
  const file = await DocumentsApi.prototype.documentsDownloadDocument(
    projectId,
    documentId,
    {
      headers: {
        Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
      },
    }
  );
  const blob = new Blob([file.data]);
  fileDownload(blob, fileName);
}
