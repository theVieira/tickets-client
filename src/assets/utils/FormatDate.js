import dayjs from "dayjs";

export function FormatDate(date) {
  return dayjs(date).format("MM/DD/YYYY HH:mm");
}
