import { getGlobalAccessTokenOpenCde } from "@/helpers/DanglIdentity";
import { ProjectGet, ProjectPost, ProjectsApi } from "@/openCDE API";
import { ActionContext } from "vuex";
import { ProjectState, RootState } from "../types";

export default {
  namespaced: true,
  state: {
    projects: [] as ProjectGet[],
  },
  mutations: {
    SET_ALL_PROJECTS(state: ProjectState, projects: ProjectGet[]) {
      state.projects = projects;
    },
    PROJECT_TO_TABLE(state: ProjectState, project: ProjectGet) {
      state.projects.push(project);
    },
  },
  actions: {
    /**

    This action retrieves all projects from the server using the Projects API.
    If successful, it sets the retrieved projects to the state.
    If there is an error, it dispatches a notification to display an error message.
    @param {ActionContext<RootState, RootState>} context - the context object of the action
    */
    async getAllProjects({
      commit,
      dispatch,
    }: ActionContext<RootState, RootState>) {
      try {
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
        commit("SET_ALL_PROJECTS", projects.data.data);
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim Laden der Projekte ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
      }
    },

    /**

    Creates a new project with the provided project data and adds it to the project table.
    @param {ActionContext<RootState, RootState>} context - The Vuex action context object.
    @param {ProjectPost} projectPost - The project data to create the project with.
    @returns {Promise<void>} A promise that resolves when the project has been created and added to the table.
    @throws An error if there was a problem creating the project.
    */
    async createProject(
      { commit, dispatch }: ActionContext<RootState, RootState>,
      projectPost: ProjectPost
    ) {
      try {
        const projectGet = await ProjectsApi.prototype.projectsCreateProject(
          projectPost,
          {
            headers: {
              Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
            },
          }
        );
        commit("PROJECT_TO_TABLE", projectGet.data);
        const notification = {
          type: "success",
          message: "Projekt erfolgreich erstellt.",
        };
        dispatch("notification/add", notification, { root: true });
      } catch (error) {
        const notification = {
          type: "error",
          message: "Beim erstellen des Projekts ist ein Problem aufgetreten.",
        };
        dispatch("notification/add", notification, { root: true });
        return Promise.reject(error);
      }
    },
  },
  getters: {
    getFilteredProjects: (state: ProjectState) => {
      return state.projects;
    },
  },
};
