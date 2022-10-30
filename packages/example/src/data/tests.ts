export type Test = { name: string; id: string; };
const tests: Test[] = [];

export const findTest = async (id: string) => {
  for (const user of tests) {
    if (user.id === id) return user;
  }
  return undefined;
};

export const addTest = async (user: Test) => {
  tests.push(user);
  return undefined;
};

export const getTests = async () => [...tests];
