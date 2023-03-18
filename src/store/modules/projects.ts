import { getGlobalAccessTokenOpenCde } from "@/helpers/DanglIdentity";
import { ProjectGet, ProjectPost, ProjectsApi } from "@/openCDE API";

interface State {
  projects: ProjectGet[];
}

export default {
  namespaced: true,
  state: {
    projects: [] as ProjectGet[],
  },
  mutations: {
    SET_ALL_PROJECTS(state: State, projects: ProjectGet[]) {
      state.projects = projects;
    },
    PROJECT_TO_TABLE(state: State, project: ProjectGet) {
      state.projects.push(project);
    },
  },
  actions: {
    async getAllProjects({ commit, dispatch }: any) {
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
        //return Promise.reject(error);
      }
    },
    async createProject({ commit, dispatch }: any, projectPost: ProjectPost) {
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
    getFilteredProjects: (state: State) => {
      return state.projects.filter((project) => {
        return project.id.endsWith("-28187834537b");
      });
    },
  },
};
