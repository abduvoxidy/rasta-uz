export default function formatPhoneNumber(number) {
  if (number && number.length > 12) {
    const res = `+${number.substr(1, 3)} ${number.substr(4, 2)} ${number.substr(
      6,
      3
    )} ${number.substr(9, 2)} ${number.substr(11, 2)}`;
    return res;
  } else {
    return null;
  }
}
