import {
  AvaConversionApi,
  GaebConversionApi,
  ProjectDto,
} from "@/AVACloud API";
import { getGlobalAccessTokenAvaCloud } from "@/helpers/DanglIdentity";
import { fileDownload, getFileName } from "@/helpers/HelperMethods";
import { v4 as uuidv4 } from "uuid";

interface State {
  avaProject: ProjectDto;
}

export default {
  namespaced: true,
  state: {
    avaProject: {} as ProjectDto,
    positions: [],
  },
  mutations: {
    SET_AVA_PROJECT(state: State, avaProject: ProjectDto) {
      state.avaProject = avaProject;
    },
  },
  actions: {
    async convertGaebToAva({ dispatch, commit }: any, file: File) {
      try {
        const avaProject =
          await GaebConversionApi.prototype.gaebConversionConvertToAva(
            undefined,
            undefined,
            undefined,
            file,
            {
              headers: {
                Authorization: `Bearer ${getGlobalAccessTokenAvaCloud()}`,
              },
            }
          );
        commit("SET_AVA_PROJECT", avaProject.data);
      } catch (error) {
        commit("SET_AVA_PROJECT", {});
        const notification = {
          type: "error",
          message: "Beim Laden des Dokuments ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
    async convertAvaToAva({ dispatch, commit }: any, avaProject: ProjectDto) {
      try {
        const avaProjectNew =
          await AvaConversionApi.prototype.avaConversionConvertToAva(
            avaProject,
            undefined,
            undefined,
            undefined,
            {
              headers: {
                Authorization: `Bearer ${getGlobalAccessTokenAvaCloud()}`,
              },
            }
          );
        commit("SET_AVA_PROJECT", avaProjectNew.data);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Kalkulieren der Preise ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
        return Promise.reject(error);
      }
    },
    async convertAvaToGaeb(
      { dispatch }: any,
      { avaProject, destinationType, targetPhase, phaseId, fileName }: any
    ) {
      try {
        const newfileName = getFileName(phaseId, fileName);

        const gaebFile =
          await AvaConversionApi.prototype.avaConversionConvertToGaeb(
            avaProject,
            undefined,
            destinationType,
            targetPhase,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            {
              headers: {
                Authorization: `Bearer ${getGlobalAccessTokenAvaCloud()}`,
              },
            }
          );

        const blob = new Blob([gaebFile.data]);
        fileDownload(blob, newfileName);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Exportieren der GAEB ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },
  },
  getters: {
    getFlattenedPositions: (state: any, getters: any) => (items: any) => {
      const result = [];
      for (const item of items) {
        result.push(item);
        if (item.elements) {
          const flattenedElements = getters.getFlattenedPositions(
            item.elements
          );
          result.push(...flattenedElements);
        }
        if (item.blocks) {
          for (const block of item.blocks) {
            block.elementType = "NoteTextBlock";
          }
          const flattenedBlocks = getters.getFlattenedPositions(item.blocks);
          result.push(...flattenedBlocks);
        }
        if (item.elementType == "ServiceSpecificationGroupDto") {
          result.push({
            id: uuidv4(),
            elementType: "GroupSum",
            totalPrice: item.totalPrice,
            totalPriceGrossDeducted: item.totalPriceGrossDeducted,
            itemNumber: {
              stringRepresentation: item.itemNumber.stringRepresentation,
            },
          });
        }
      }
      return result;
    },
  },
};
