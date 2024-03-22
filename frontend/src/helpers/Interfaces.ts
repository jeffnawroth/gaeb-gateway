export interface ExtensionMap {
  [key: number]: string;
}

export interface CustomNotification {
  id: number;
  type: string;
  message: string;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  refreshToken: string;
  role: string;
  token: string;
}
