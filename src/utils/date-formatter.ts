export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);

  const diffInSeconds = Math.max(
    0,
    Math.floor((now.getTime() - past.getTime()) / 1000),
  );

  const minute = 60;
  const hour = 3600;
  const day = 86400;
  const month = 2592000;
  const year = 31536000;

  if (diffInSeconds < minute) return "just now";

  if (diffInSeconds < hour) {
    const mins = Math.floor(diffInSeconds / minute);
    return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`;
  }

  if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (diffInSeconds < month) {
    const days = Math.floor(diffInSeconds / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  if (diffInSeconds < year) {
    const months = Math.floor(diffInSeconds / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(diffInSeconds / year);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
};
