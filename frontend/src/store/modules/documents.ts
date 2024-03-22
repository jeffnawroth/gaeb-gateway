import { getGlobalAccessTokenOpenCde } from "@/helpers/DanglIdentity";
import { fileDownload } from "@/helpers/HelperMethods";
import { DocumentGet, DocumentPost, DocumentsApi } from "@/openCDE API";
import { ActionContext } from "vuex";
import { DocumentState, RootState } from "../types";

export default {
  namespaced: true,
  state: {
    documents: [] as DocumentGet[],
  },
  mutations: {
    SET_DOCUMENTS(state: DocumentState, documents: DocumentGet[]) {
      state.documents = documents;
    },
    DOCUMENT_TO_TABLE(state: DocumentState, document: DocumentGet) {
      state.documents.push(document);
    },
    REMOVE_DOCUMENT(state: DocumentState, documentId: string) {
      state.documents = state.documents.filter(
        (document) => document.id !== documentId
      );
    },
  },
  actions: {
    /**

    Retrieves all documents for a project with the specified project ID by making a request to the Documents API.
    If the request is successful, it commits the retrieved documents to the store. If the request fails,
    it dispatches a notification to display an error message.
    @param {ActionContext<RootState, RootState>} context - the context object of the store
    @param {string} projectId - the ID of the project for which to retrieve documents
    @returns {Promise<void>}
    */
    async getAllDocumentsForProject(
      { commit, dispatch }: ActionContext<RootState, RootState>,
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

    /**

    Uploads document metadata to the Documents API for the specified project ID.
    If the upload is successful, it returns the uploaded document data.
    @param {ActionContext<RootState, RootState>} context - the context object of the store
    @param {string} projectId - the ID of the project to which to upload the document metadata
    @param {DocumentPost} documentPost - the document metadata to upload
    @returns {Promise<DocumentGet>} - the uploaded document data
    */
    async uploadDocumentMetadata(
      // eslint-disable-next-line no-empty-pattern
      {}: ActionContext<RootState, RootState>,
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

    /**

    Uploads document content to the Documents API for the specified project ID and document ID.
    If the upload is successful, it returns the uploaded document data.
    @param {ActionContext<RootState, RootState>} context - the context object of the store
    @param {string} projectId - the ID of the project to which to upload the document content
    @param {string} documentId - the ID of the document to which to upload the content
    @param {File} file - the file containing the document content to upload
    @returns {Promise<DocumentGet>} - the uploaded document data
    */
    async uploadDocumentContent(
      // eslint-disable-next-line no-empty-pattern
      {}: ActionContext<RootState, RootState>,
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

    /**

    Uploads a document to the Documents API for the specified project ID.
    If the upload is successful, it creates a new row in the document table in the store and dispatches a success notification.
    If the upload fails, it dispatches an error notification.
    @param {ActionContext<RootState, RootState>} context - the context object of the store
    @param {string} projectId - the ID of the project to which to upload the document
    @param {DocumentPost} documentPost - the document metadata to upload
    @param {File} file - the file containing the document content to upload
    @returns {Promise<void>}
    */
    async uploadDocument(
      { commit, dispatch }: ActionContext<RootState, RootState>,
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
        const notification = {
          type: "success",
          message: "Dokument erfolgreich erstellt.",
        };
        dispatch("notification/add", notification, { root: true });
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
      { commit, dispatch }: ActionContext<RootState, RootState>,
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
        const notification = {
          type: "success",
          message: "Dokument erfolgreich gelöscht.",
        };
        dispatch("notification/add", notification, { root: true });
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Löschen des Dokuments ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },

    /**

    Deletes a document from the Documents API for the specified project and document IDs.
    If the deletion is successful, it removes the corresponding row from the document table in the store and dispatches a success notification.
    If the deletion fails, it dispatches an error notification.
    @param {ActionContext<RootState, RootState>} context - the context object of the store
    @param {string} projectId - the ID of the project containing the document to delete
    @param {string} documentId - the ID of the document to delete
    @returns {Promise<void>}
    */
    async downloadDocument(
      { dispatch }: ActionContext<RootState, RootState>,
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
        const notification = {
          type: "success",
          message: "Dokument erfolgreich heruntergeladen.",
        };
        dispatch("notification/add", notification, { root: true });
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
