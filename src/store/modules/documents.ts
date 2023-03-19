import { getGlobalAccessTokenOpenCde } from "@/helpers/DanglIdentity";
import { fileDownload } from "@/helpers/HelperMethods";
import { DocumentGet, DocumentsApi } from "@/openCDE API";

interface State {
  documents: DocumentGet[];
}

export default {
  namespaced: true,
  state: {
    documents: [] as DocumentGet[],
  },
  mutations: {
    SET_DOCUMENTS(state: State, documents: DocumentGet[]) {
      state.documents = documents;
    },
    DOCUMENT_TO_TABLE(state: State, document: DocumentGet) {
      state.documents.push(document);
    },
    REMOVE_DOCUMENT(state: State, documentId: string) {
      state.documents = state.documents.filter(
        (document) => document.id !== documentId
      );
    },
  },
  actions: {
    async getAllDocumentsForProject(
      { commit, dispatch }: any,
      projectId: string
    ) {
      try {
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
        commit("SET_DOCUMENTS", documents.data.data);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Laden der Dokumente ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
    async uploadDocumentMetadata(
      { commit }: any,
      { projectId, documentPost }: any
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

      return documentGet.data;
    },
    async uploadDocumentContent(
      { commit }: any,
      { projectId, documentId, file }: any
    ) {
      const documentGet =
        await DocumentsApi.prototype.documentsUploadDocumentContent(
          projectId,
          documentId,
          file,
          {
            headers: {
              Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
            },
          }
        );

      return documentGet.data;
    },
    async uploadDocument(
      { commit, dispatch }: any,
      { projectId, documentPost, file }: any
    ) {
      try {
        const documentGetMeta = await dispatch("uploadDocumentMetadata", {
          projectId,
          documentPost,
        });

        const documentGetContent = await dispatch("uploadDocumentContent", {
          projectId,
          documentId: documentGetMeta.id,
          file,
        });
        commit("DOCUMENT_TO_TABLE", documentGetContent);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Erstellen des Dokuments ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
        //return Promise.reject(error);
      }
    },
    async deleteDocument(
      { commit, dispatch }: any,
      { projectId, documentId }: any
    ) {
      try {
        await DocumentsApi.prototype.documentsDeleteDocument(
          projectId,
          documentId,
          {
            headers: {
              Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
            },
          }
        );
        commit("REMOVE_DOCUMENT", documentId);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Löschen des Dokuments ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
    async downloadDocument(
      { commit, dispatch }: any,
      { projectId, documentId, fileName }: any
    ) {
      try {
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
      } catch (error) {
        const notification = {
          type: "error",
          message:
            "Beim Herunterladen des Dokuments ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
  },
  getters: {},
};
