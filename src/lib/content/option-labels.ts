import type { OptionId } from "./types";

export const OPTION_LABEL: Record<OptionId, string> = {
  a: "ア",
  i: "イ",
  u: "ウ",
  e: "エ",
  o: "オ",
  ka: "カ",
  ki: "キ",
  ku: "ク",
  ke: "ケ",
  ko: "コ",
};

export const OPTION_IDS: OptionId[] = ["a", "i", "u", "e", "o", "ka", "ki", "ku", "ke", "ko"];

export function optionLabel(id: OptionId): string {
  return OPTION_LABEL[id];
}
