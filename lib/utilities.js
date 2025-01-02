export function formatDateString(dateString) {
  const date = new Date(dateString);

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Extract time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const isPM = hours >= 12;

  hours = hours % 12 || 12; // Convert to 24Hr Format
  const meridian = isPM ? "PM" : "AM"; // Comparing Time Meridian
  return `${day}-${month}-${year} ${hours}:${minutes} ${meridian}`; // The Desired Format of Time
}

export const calculateValidityDate = (date_exp, date_start) => {
  const differenceInMs = new Date(date_exp) - new Date(date_start);
  const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
  return differenceInDays;
};
