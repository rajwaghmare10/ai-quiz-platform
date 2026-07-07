// Converts a UTC ISO string (from the backend) into the local
// "YYYY-MM-DDTHH:mm" format required by <input type="datetime-local">.
export const toDatetimeLocalValue = (isoString) => {
  const date = new Date(isoString);

  const pad = (num) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
