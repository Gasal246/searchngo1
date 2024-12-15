export const getAuthToken = () => {
  return "Bearer " + (global?.token ? global?.token : token);
};

export const setIpAddress = async (ipAddress) => {
  global.ipAddress = ipAddress;
};

export const getIpAddress = () => {
  return global.ipAddress;
};
