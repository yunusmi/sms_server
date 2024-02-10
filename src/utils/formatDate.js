export function getFormattedDate() {
  const currentDate = new Date();

  const formattedDate = `${currentDate
    .getDate()
    .toString()
    .padStart(2, '0')}_${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}_${currentDate.getFullYear()}`;

  return formattedDate;
}
