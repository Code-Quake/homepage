export const handleTemp = (temp) => {
  return `${Math.round(temp)}`;
};

export const convertUnixToLocalDateTime = (unixTimestamp, showTime) => {
  const date = new Date(unixTimestamp * 1000);
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: showTime ? "2-digit" : undefined,
    minute: showTime ? "2-digit" : undefined,
  });

  return dateTimeFormat.format(date);
};

/* Given a large number, will add commas to make more readable */
export const putCommasInBigNum = (bigNum) => {
  const strNum = Number.isNaN(bigNum) ? bigNum : String(bigNum);
  const [integerPart, decimalPart] = strNum.split(".");
  return (
    integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (decimalPart ? `.${decimalPart}` : "")
  );
};

/* Given a large number, will convert 1000 into k for readability */
export const showNumAsThousand = (bigNum) => {
  if (bigNum < 1000) return bigNum;
  return `${Math.round(bigNum / 1000)}k`;
};

/* Given two timestamp, return the difference in text format, e.g. '10 minutes' */
export const getTimeDifference = (startTime, endTime) => {
  const msDifference =
    new Date(endTime).getTime() - new Date(startTime).getTime();
  const diff = Math.abs(Math.round(msDifference / 1000));
  const divide = (time, round) => Math.round(time / round);

  const periods = [
    { noun: "second", value: 1 },
    { noun: "minute", value: 60 },
    { noun: "hour", value: 3600 },
    { noun: "day", value: 86400 },
    { noun: "week", value: 604800 },
    { noun: "fortnight", value: 1209600 },
    { noun: "month", value: 2628000 },
    { noun: "year", value: 31557600 },
  ];

  for (let idx = 0; idx < periods.length; idx += 1) {
    if (diff < (periods[idx + 1]?.value ?? Infinity)) {
      const period = periods[idx];
      const value = divide(diff, period.value);
      const noun = value === 1 ? period.noun : `${period.noun}s`;
      return `${value} ${noun}`;
    }
  }

  return "unknown";
};

/* Given a timestamp, return how long ago it was, e.g. '10 minutes' */
export const getTimeAgo = (dateTime) => {
  const now = new Date().getTime();
  const isHistorical = new Date(dateTime).getTime() < now;
  const diffStr = getTimeDifference(dateTime, now);
  if (diffStr === "unknown") return diffStr;
  return isHistorical ? `${diffStr} ago` : `in ${diffStr}`;
};
