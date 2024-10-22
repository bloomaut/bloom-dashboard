export const formatTime = (date: string) => {
  const dateObj = new Date(date);
  const time = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return time;
};
