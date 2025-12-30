export type User = {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
  password_confirm?: string;
  old_password?: string;
};
