export const getOrSetSessionId = (): string => {
  const SESSION_KEY = "user_session_id";

  const existingId = localStorage.getItem(SESSION_KEY);
  if (existingId) return existingId;
  const newId = self.crypto.randomUUID();

  localStorage.setItem(SESSION_KEY, newId);  
  return newId;
};

export const clearSessionId = (): void => {
  localStorage.removeItem("user_session_id");
};
