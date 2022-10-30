export type User = { name: string; id: string; };
const users: User[] = [];

export const findUser = async (id: string) => {
  for (const user of users) {
    if (user.id === id) return user;
  }
  return undefined;
};

export const addUser = async (user: User) => {
  users.push(user);
  return undefined;
};

export const getUsers = async () => [...users];
