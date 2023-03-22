import { ApplicationUser } from "@/api";
import { ProjectDto } from "@/AVACloud API";
import { DocumentGet, ProjectGet } from "@/openCDE API";

export interface RootState {
  loadingGlobal: boolean;
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

export interface ProjectState {
  projects: ProjectGet[];
}

export interface NotificationState {
  notifications: Notification[];
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
