export const generateComplaintId = (userId) => {
  const timestamp = Date.now(); // or use UUID if preferred
  return `${userId}_cmp_${timestamp}`;
};
