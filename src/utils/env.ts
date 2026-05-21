export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  defaultRegisterRoleId: Number(import.meta.env.VITE_DEFAULT_REGISTER_ROLE_ID ?? 3)
};
