import { getDecodedToken } from "@/utils/auth";

export const checkRole = (allowedRoles: string[]) => {
  const decoded = getDecodedToken();

  if (!decoded) return false;

  return allowedRoles.includes(decoded.role);
};
