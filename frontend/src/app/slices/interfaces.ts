interface UserState {
  isLoggedIn: boolean;
  userName?: string;
  email?: string;
  accessToken?: string;
}

export type { UserState };
