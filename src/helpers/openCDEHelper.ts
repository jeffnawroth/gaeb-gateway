import { AuthenticationApi, ProjectsApi, StatusApi } from "@/openCDE API";
import { getGlobalAccessTokenOpenCde } from "./DanglIdentity";

export async function check() {
  const authentication =
    await AuthenticationApi.prototype.authenticationGetAuthenticationMetadata({
      headers: {
        Authorization: `Bearer ${getGlobalAccessTokenOpenCde()}`,
      },
    });
  const status = await ProjectsApi.prototype.projectsGetAllProjects(
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
  console.log(status);
}
