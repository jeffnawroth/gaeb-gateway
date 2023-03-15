import { AuthenticationApi, ProjectsApi, StatusApi } from "@/openCDE API";
import { getGlobalAccessTokenOpenCde } from "./DanglIdentity";

export async function getAllProjects() {
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
  return projects;
}
