import type {
  Chapter,
  ContentBlock,
  MarkType,
  RichText,
  TableCell,
} from "../../types/content";

const updatedAt = "2026-08-24";

function rich(text: string, marks?: MarkType[]): RichText {
  return marks ? [{ text, marks }] : [{ text }];
}

function paragraph(text: string): ContentBlock {
  return { type: "paragraph", content: rich(text) };
}

function list(...items: string[]): ContentBlock {
  return { type: "list", items: items.map((item) => rich(item)) };
}

function cell(
  text: string,
  header = false,
  scope?: "row" | "col",
): TableCell {
  return {
    content: rich(text),
    ...(header ? { header: true } : {}),
    ...(scope ? { scope } : {}),
  };
}

function table(headers: string[], rows: string[][]): ContentBlock {
  return {
    type: "table",
    columnCount: headers.length,
    rows: [
      headers.map((header) => cell(header, true, "col")),
      ...rows.map((row) =>
        row.map((value, index) =>
          index === 0 ? cell(value, true, "row") : cell(value),
        ),
      ),
    ],
  };
}

export const chapter03: Chapter = {
  id: "ch-03",
  order: 3,
  title: "회계순환과 재무제표",
  sourcePages: [11, 12],
  theories: [
    {
      id: "ch-03-t01",
      chapterId: "ch-03",
      order: 1,
      title: "회계순환과 전기",
      sourcePages: [11],
      updatedAt,
      blocks: [
        paragraph(
          "회계상 거래 → 분개(분개장) → 전기(총계정원장, 원장) → 결산의 순서로 회계가 순환한다.",
        ),
        paragraph(
          "전기는 분개를 확인하여 장부(총계정원장, 원장)에 옮겨 적는 것이며, 전산프로그램은 100% 자동전기한다.",
        ),
        list(
          "전기된 장부(원장)를 보고 거래내용을 해석하는 능력: 역분개를 활용한다.",
          "결산절차를 이해한다.",
          "각 장부의 마감방법(마감분개)과 T계정을 이해한다.",
        ),
      ],
    },
    {
      id: "ch-03-t02",
      chapterId: "ch-03",
      order: 2,
      title: "결산 예비절차와 시산표",
      sourcePages: [11],
      updatedAt,
      correctionIds: ["correction-006"],
      blocks: [
        {
          type: "paragraph",
          content: [
            { text: "예비절차는 ", marks: ["bold"] },
            { text: "분개와 전기를 검증하여 오류를 발견하고 수정" },
            { text: "하는 절차이다.", marks: ["bold"] },
          ],
        },
        {
          type: "callout",
          tone: "process",
          content: rich(
            "수정전시산표(오류 발견) → 결산수정분개 → 수정후시산표",
          ),
        },
        table(
          ["구분", "내용"],
          [
            [
              "시산표의 자기검증기능",
              "복식부기에서 오류를 스스로 찾아내는 기능이다.",
            ],
            [
              "발견 가능한 오류",
              "차변금액과 대변금액의 차이가 발생하는 경우에만 찾을 수 있다.",
            ],
            [
              "발견할 수 없는 오류",
              "계정과목 오류, 차변과 대변금액의 동시 오기, 거래 누락처럼 차변금액과 대변금액의 차이가 없는 경우이다.",
            ],
          ],
        ),
      ],
    },
    {
      id: "ch-03-t03",
      chapterId: "ch-03",
      order: 3,
      title: "수익·비용계정과 집합손익계정 마감",
      sourcePages: [11],
      updatedAt,
      blocks: [
        paragraph(
          "본절차에서는 각 장부(원장)의 마감분개를 통해 장부를 마감하며, 전산은 100% 자동마감한다.",
        ),
        table(
          ["계정", "잔액 소멸", "(집합)손익계정으로 집계"],
          [
            [
              "비용계정(급여 등)",
              "차변에 쌓인 잔액을 대변으로 소멸하여 0으로 만든다.",
              "(집합)손익계정 차변에 모아 총비용으로 집계한다.",
            ],
            [
              "수익계정(상품매출 등)",
              "대변에 쌓인 잔액을 차변으로 소멸하여 0으로 만든다.",
              "(집합)손익계정 대변에 모아 총수익으로 집계한다.",
            ],
          ],
        ),
        table(
          ["비교", "결과", "자본계정 대체"],
          [
            [
              "총비용 < 총수익",
              "당기순이익",
              "미처분이익잉여금계정 대변으로 대체하여 기말 자본을 증가시킨다.",
            ],
            [
              "총비용 > 총수익",
              "당기순손실",
              "미처분이익잉여금계정 차변으로 대체하여 기말 자본을 감소시킨다.",
            ],
          ],
        ),
      ],
    },
    {
      id: "ch-03-t04",
      chapterId: "ch-03",
      order: 4,
      title: "자산·부채·자본계정 마감",
      sourcePages: [11],
      updatedAt,
      blocks: [
        paragraph(
          "자산·부채·자본계정(B/S)은 전기이월(기초)과 차기이월(기말)을 이용하여 잔액을 차기로 이월한다.",
        ),
        table(
          ["계정", "잔액 위치", "차기 이월"],
          [
            [
              "자산",
              "차변",
              "잔액을 차기 차변으로 이월한다. 전기 기말잔액은 당기 기초잔액이다.",
            ],
            [
              "부채·자본",
              "대변",
              "잔액을 차기 대변으로 이월한다. 전기 기말잔액은 당기 기초잔액이다.",
            ],
          ],
        ),
      ],
    },
    {
      id: "ch-03-t05",
      chapterId: "ch-03",
      order: 5,
      title: "재무제표 작성 순서",
      sourcePages: [11],
      updatedAt,
      blocks: [
        paragraph(
          "결산보고서인 재무제표를 작성하여 주주 등 정보이용자에게 전달한다. 재무제표에는 재무상태표, 손익계산서, 현금흐름표, 자본변동표, 주석이 있다.",
        ),
        table(
          ["업종", "작성 순서"],
          [
            [
              "도소매업(유통업)·서비스업",
              "손익계산서 → 이익잉여금처분계산서 → 재무상태표",
            ],
            [
              "제조업(암기: 제손이재)",
              "제조원가명세서 → 손익계산서 → 이익잉여금처분계산서 → 재무상태표",
            ],
          ],
        ),
      ],
    },
    {
      id: "ch-03-t06",
      chapterId: "ch-03",
      order: 6,
      title: "손익계산서 계산구조",
      sourcePages: [12],
      updatedAt,
      blocks: [
        {
          type: "callout",
          tone: "key",
          content: [
            { text: "손익계산서 계산구조(암기): ", marks: ["bold"] },
            {
              text: "구분계산의 원칙, 총액주의, 발생주의",
              marks: ["highlight"],
            },
          ],
        },
        table(
          ["기호", "항목", "원문 계산구조"],
          [
            [
              "",
              "(순)매출액",
              "제품매출, 상품매출, 서비스매출, 공사수입금액, 임대료수입 등",
            ],
            [
              "-",
              "매출원가",
              "판매된 상품·제품의 원가: 상품매출원가, 제품매출원가, 공사원가, 서비스원가 등",
            ],
            ["=", "매출총이익", "매출관련 순이익"],
            [
              "-",
              "판매와관리비",
              "영업과 관련 있는 비용: 급여, 광고선전비, 임차료, 복리후생비, 기업업무추진비 등",
            ],
            ["=", "영업이익", "영업관련 순이익"],
            [
              "+",
              "영업외수익",
              "영업과 관련 없는 수익: 이자수익, 수수료수익, 잡이익 등",
            ],
            [
              "-",
              "영업외비용",
              "영업과 관련 없는 비용: 이자비용, 수수료비용, 잡손실, 기부금 등",
            ],
            ["=", "법인세차감전순이익", "세전이익"],
            [
              "-",
              "법인세비용",
              "10%~25%의 세율을 과세표준에 적용하는 국세",
            ],
            ["=", "당기순이익", "세후이익"],
            ["", "주당순이익", "당기순이익 / 주식수"],
          ],
        ),
      ],
    },
    {
      id: "ch-03-t07",
      chapterId: "ch-03",
      order: 7,
      title: "재무상태표 구조와 유동·비유동 구분",
      sourcePages: [12],
      updatedAt,
      blocks: [
        table(
          ["자산", "부채와 자본"],
          [
            [
              "유동자산: 당좌자산, 재고자산",
              "부채: 유동부채, 비유동부채",
            ],
            [
              "비유동자산: 투자자산, 유형자산, 무형자산, 기타비유동자산",
              "자본: 자본금, 자본잉여금, 자본조정, 기타포괄손익누계액, 이익잉여금",
            ],
          ],
        ),
        paragraph(
          "유동(단기)과 비유동(장기)의 구분은 단기와 장기의 구분과 같다. 주주에게 보고하는 날인 결산일을 기준으로 구분한다.",
        ),
        table(
          ["유동자산·유동부채", "구분방법", "비유동자산·비유동부채"],
          [
            [
              "단기대여금",
              "결산일로부터 1년 이내: 단기",
              "장기대여금",
            ],
            [
              "단기차입금",
              "결산일로부터 1년 이후: 장기",
              "장기차입금",
            ],
          ],
        ),
      ],
    },
    {
      id: "ch-03-t08",
      chapterId: "ch-03",
      order: 8,
      title: "실무결산 일정과 제출서류",
      sourcePages: [12],
      updatedAt,
      correctionIds: ["correction-007"],
      blocks: [
        list(
          "결산기준일은 일반적으로 12월 31일이며 기업마다 다를 수 있다. 상장기업은 분기결산으로 보고하고 회계기간은 1년을 초과할 수 없다.",
          "차기 1월 1일부터 2월 초까지 결산업무를 완료한다.",
          "2월 초부터 3월 초까지 주주총회를 개최하고 주주결의에 따른 이익잉여금처분계산서를 작성한다.",
          "3월부터 각 사업연도 종료일이 속한 말일로부터 3개월 이내인 3월 31일까지 법인세 확정신고서를 제출한다.",
        ),
        table(
          ["번호", "법인세 신고 시 필수 제출서류"],
          [
            ["1", "표준재무상태표"],
            ["2", "표준손익계산서"],
            ["3", "이익잉여금처분계산서 / 결손금처리계산서"],
            ["4", "소득금액조정합계표"],
            ["5", "자본금과적립금조정명세"],
            ["6", "법인세과세표준및세액조정계산서"],
            ["7", "현금흐름표(외감법인)"],
          ],
        ),
      ],
    },
  ],
};
