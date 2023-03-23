import { ApplicationUser } from "@/api";
import { ProjectDto } from "@/AVACloud API";
import { CustomNotification, User } from "@/helpers/Interfaces";
import { DocumentGet, ProjectGet } from "@/openCDE API";

export interface RootState {
  loadingGlobal: boolean;
  authUser: AuthUserState;
  user: UserState;
  project: ProjectState;
  notification: NotificationState;
  element: IfcState;
  document: DocumentState;
  avaCloud: AvaCloudState;
  global: GlobalState;
}

export interface GlobalState {
  loadingGlobal: boolean;
}
export interface UserState {
  users: ApplicationUser[];
  user: ApplicationUser;
  creationMode: boolean;
}

export interface AuthUserState {
  user: User | null;
  darkMode: boolean;
}

export interface ProjectState {
  projects: ProjectGet[];
}

export interface NotificationState {
  notifications: CustomNotification[];
}

export interface IfcState {
  elements: any[];
}

export interface DocumentState {
  documents: DocumentGet[];
}

export interface AvaCloudState {
  avaProject: ProjectDto;
}
