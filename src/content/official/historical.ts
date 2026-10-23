export interface HistoricalPaper {
  id: string;
  year: number;
  label: string;
  season: "春期" | "秋期";
  pageUrl: string;
  morning: { booklet: string; answers: string };
  afternoon: { booklet: string; answers: string };
  note: string;
}

const BASE = "https://www.ipa.go.jp";

export const HISTORICAL_PAPERS: HistoricalPaper[] = [
  {
    id: "2019-autumn",
    year: 2019,
    label: "令和元年度 秋期",
    season: "秋期",
    pageUrl: `${BASE}/shiken/mondai-kaiotu/2019h31.html`,
    morning: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000dict-att/2019r01a_sg_am_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000dict-att/2019r01a_sg_am_ans.pdf`,
    },
    afternoon: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000dict-att/2019r01a_sg_pm_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000dict-att/2019r01a_sg_pm_ans.pdf`,
    },
    note: "午前50問・午後3問の完全な筆記試験。PDFは画像ベースでテキスト層がないため、アプリ内には出題せず原本をリンクしています。",
  },
  {
    id: "2019-spring",
    year: 2019,
    label: "平成31年度 春期",
    season: "春期",
    pageUrl: `${BASE}/shiken/mondai-kaiotu/2019h31.html`,
    morning: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000ddiw-att/2019h31h_sg_am_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000ddiw-att/2019h31h_sg_am_ans.pdf`,
    },
    afternoon: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000ddiw-att/2019h31h_sg_pm_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000ddiw-att/2019h31h_sg_pm_ans.pdf`,
    },
    note: "午前50問・午後3問の完全な筆記試験。PDFは画像ベースのため、アプリ内出題はしていません。",
  },
  {
    id: "2018-autumn",
    year: 2018,
    label: "平成30年度 秋期",
    season: "秋期",
    pageUrl: `${BASE}/shiken/mondai-kaiotu/2018h30.html`,
    morning: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000f01f-att/2018h30a_sg_am_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000f01f-att/2018h30a_sg_am_ans.pdf`,
    },
    afternoon: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000f01f-att/2018h30a_sg_pm_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000f01f-att/2018h30a_sg_pm_ans.pdf`,
    },
    note: "午前50問・午後3問の完全な筆記試験。PDFは画像ベースのため、アプリ内出題はしていません。",
  },
  {
    id: "2018-spring",
    year: 2018,
    label: "平成30年度 春期",
    season: "春期",
    pageUrl: `${BASE}/shiken/mondai-kaiotu/2018h30.html`,
    morning: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fabr-att/2018h30h_sg_am_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fabr-att/2018h30h_sg_am_ans.pdf`,
    },
    afternoon: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fabr-att/2018h30h_sg_pm_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fabr-att/2018h30h_sg_pm_ans.pdf`,
    },
    note: "午前50問・午後3問の完全な筆記試験。PDFは画像ベースのため、アプリ内出題はしていません。",
  },
  {
    id: "2017-autumn",
    year: 2017,
    label: "平成29年度 秋期",
    season: "秋期",
    pageUrl: `${BASE}/shiken/mondai-kaiotu/2017h29.html`,
    morning: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fqpm-att/2017h29a_sg_am_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fqpm-att/2017h29a_sg_am_ans.pdf`,
    },
    afternoon: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fqpm-att/2017h29a_sg_pm_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fqpm-att/2017h29a_sg_pm_ans.pdf`,
    },
    note: "午前50問・午後3問の完全な筆記試験。PDFは画像ベースのため、アプリ内出題はしていません。",
  },
  {
    id: "2017-spring",
    year: 2017,
    label: "平成29年度 春期",
    season: "春期",
    pageUrl: `${BASE}/shiken/mondai-kaiotu/2017h29.html`,
    morning: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fzx1-att/2017h29h_sg_am_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fzx1-att/2017h29h_sg_am_ans.pdf`,
    },
    afternoon: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fzx1-att/2017h29h_sg_pm_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000fzx1-att/2017h29h_sg_pm_ans.pdf`,
    },
    note: "午前50問・午後3問の完全な筆記試験。PDFは画像ベースのため、アプリ内出題はしていません。",
  },
  {
    id: "2016-autumn",
    year: 2016,
    label: "平成28年度 秋期",
    season: "秋期",
    pageUrl: `${BASE}/shiken/mondai-kaiotu/2016h28.html`,
    morning: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000g6fw-att/2016h28a_sg_am_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000g6fw-att/2016h28a_sg_am_ans.pdf`,
    },
    afternoon: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000g6fw-att/2016h28a_sg_pm_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000g6fw-att/2016h28a_sg_pm_ans.pdf`,
    },
    note: "午前50問・午後3問の完全な筆記試験。PDFは画像ベースのため、アプリ内出題はしていません。",
  },
  {
    id: "2016-spring",
    year: 2016,
    label: "平成28年度 春期",
    season: "春期",
    pageUrl: `${BASE}/shiken/mondai-kaiotu/2016h28.html`,
    morning: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000gn5o-att/2016h28h_sg_am_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000gn5o-att/2016h28h_sg_am_ans.pdf`,
    },
    afternoon: {
      booklet: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000gn5o-att/2016h28h_sg_pm_qs.pdf`,
      answers: `${BASE}/shiken/mondai-kaiotu/gmcbt8000000gn5o-att/2016h28h_sg_pm_ans.pdf`,
    },
    note: "午前50問・午後3問の完全な筆記試験。PDFは画像ベースのため、アプリ内出題はしていません。",
  },
];
