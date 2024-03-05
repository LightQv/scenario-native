import { DARK, LIGHT } from "../constants/theme";
import i18n from "./i18n";

export default function formatDate(date: string) {
  const options = {
    year: "numeric",
  };
  return new Date(date).toLocaleDateString(i18n.locale, options as object);
}

export function formatFullDate(date: string) {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString(i18n.locale, options as object);
}

export function getDirectorName(crew: Array<Crew>) {
  for (let i = 0; i < crew.length; i++) {
    if (crew[i].job === "Director") return crew[i].name;
  }
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export function durationConvert(time: number) {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${padTo2Digits(hours)}h${padTo2Digits(minutes)}`;
}

export const getTotalRuntime = (data: any) => {
  let total = 0;
  data.forEach((el: any) => (total += el.runtime));
  return total;
};

export const setScoreColor = (score: number, darkTheme: boolean) => {
  if (score <= 3.99) return darkTheme ? DARK.grade.bad : LIGHT.grade.bad;
  if (score >= 4 && score <= 6.99)
    return darkTheme ? DARK.grade.average : LIGHT.grade.average;
  if (score >= 7 && score <= 8.49)
    return darkTheme ? DARK.grade.good : LIGHT.grade.good;
  if (score >= 8.4)
    return darkTheme ? DARK.grade.excellent : LIGHT.grade.excellent;
};

export function runtimeConvert(time: any) {
  const minutesToMs = time * 60000;

  let seconds = Math.floor(minutesToMs / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let weeks = Math.floor(days / 7);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;
  days = days % 7;
  weeks = weeks % 52;

  if (weeks >= 1 && days >= 1) {
    return `${padTo2Digits(weeks)} ${
      Number(padTo2Digits(weeks)) > 1
        ? i18n.t("stats.durationWeeks")
        : i18n.t("stats.durationWeek")
    } ${padTo2Digits(days)} ${
      Number(padTo2Digits(days)) > 1
        ? i18n.t("stats.durationDays")
        : i18n.t("stats.durationDay")
    } ${padTo2Digits(hours) + "h"}${padTo2Digits(minutes)}`;
  }
  if (weeks >= 1) {
    return `${padTo2Digits(weeks)} ${
      Number(padTo2Digits(weeks)) > 1
        ? i18n.t("stats.durationWeeks")
        : i18n.t("stats.durationWeek")
    } ${padTo2Digits(hours) + "h"}${padTo2Digits(minutes)}`;
  }
  if (days >= 1) {
    return `${padTo2Digits(days)} ${
      Number(padTo2Digits(days)) > 1
        ? i18n.t("stats.durationDays")
        : i18n.t("stats.durationDay")
    } ${padTo2Digits(hours) + "h"}${padTo2Digits(minutes)}`;
  }
  if (hours >= 1) {
    return `${padTo2Digits(hours) + "h"}${padTo2Digits(minutes)}`;
  }
  return `${minutes} min`;
}
