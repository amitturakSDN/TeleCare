export const getUser = state => {
  return Object.keys(state.user).length > 0 && state.user?.user
    ? state.user
    : null;
};
