export const getInitials = (name?: string, surname?: string) => {
  if (!name && !surname) return "U";

  const firstInitial = name?.charAt(0).toUpperCase() || "";
  const lastInitial = surname?.charAt(0).toUpperCase() || "";

  return `${firstInitial}${lastInitial}`;
};

export const getFullName = (name?: string, surname?: string) => {
  if (!name && !surname) return "Usuario";

  return `${name || ""} ${surname || ""}`.trim();
};
