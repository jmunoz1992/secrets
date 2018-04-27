export const sortById = (objA, objB) => {
  if (objA.id < objB.id) return -1;
  else return 1;
};
