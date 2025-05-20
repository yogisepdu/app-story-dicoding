export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getUser = () => {
  return {
    token: localStorage.getItem("token"),
    name: localStorage.getItem("name"),
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
};
