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

const paragraph = (text: string): ContentBlock => ({
  type: "paragraph",
  content: rich(text),
});

const list = (...items: string[]): ContentBlock => ({
  type: "list",
  items: items.map((item) => rich(item)),
});

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

export const chapter08: Chapter = {
  id: "ch-08",
  order: 8,
  title: "기타 당좌자산과 원천징수",
  sourcePages: [27, 28, 29, 30],
  theories: [
    {
      id: "ch-08-t01",
      chapterId: "ch-08",
      order: 1,
      title: "선급금",
      sourcePages: [27],
      updatedAt,
      correctionIds: ["correction-014"],
      blocks: [
        paragraph(
          "선급금은 계약금, 예매, 충전식 광고(키워드 광고)처럼 미리 지급한 금전을 처리하는 채권이다.",
        ),
        {
          type: "callout",
          tone: "process",
          content: rich(
            "검색광고비를 충전할 때 선급금으로 기록하고 광고가 집행되면 광고선전비로 대체한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-08-t01-j01",
          sourcePages: [27],
          transaction: rich(
            "네이버 검색광고비 1,000,000원을 보통예금에서 이체하여 충전하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "08/01",
              debit: [
                {
                  account: "선급금",
                  counterparty: "네이버",
                  amount: 1000000,
                },
              ],
              credit: [{ account: "보통예금", amount: 1000000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-08-t01-j02",
            sourcePages: [27],
            transaction: rich("8월분 네이버 검색광고비 960,000원이 집행되었다."),
            presentation: "entries",
            entries: [
              {
                date: "08/31",
                debit: [{ account: "광고선전비", amount: 960000 }],
                credit: [
                  {
                    account: "선급금",
                    counterparty: "네이버",
                    amount: 960000,
                  },
                ],
              },
            ],
          },
          {
            id: "ch-08-t01-j03",
            sourcePages: [27],
            transaction: rich(
              "네이버 검색광고비 1,200,000원을 보통예금에서 이체하여 충전하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "09/01",
                debit: [
                  {
                    account: "선급금",
                    counterparty: "네이버",
                    amount: 1200000,
                  },
                ],
                credit: [{ account: "보통예금", amount: 1200000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-08-t02",
      chapterId: "ch-08",
      order: 2,
      title: "선수금",
      sourcePages: [27],
      updatedAt,
      blocks: [
        paragraph(
          "선수금은 계약금, 예약판매, 모바일·문화상품권처럼 미리 수령한 금전을 처리하는 채무이다.",
        ),
        table(
          ["상품권 단계", "처리 흐름"],
          [
            ["발행·판매", "현금 수령 / 선수금 발생"],
            ["재화와 교환", "선수금 소멸 / 상품매출 발생"],
            ["잔액 현금 반환", "선수금 소멸 / 상품매출과 현금 지급"],
            ["잔액 새 상품권 발행", "교환된 금액만큼 선수금 소멸"],
            ["소멸시효 완성", "선수금 소멸 / 잡이익"],
            ["모바일 상품권 소멸시효", "90% 환불, 나머지는 잡이익"],
          ],
        ),
      ],
      journal: {
        representative: {
          id: "ch-08-t02-j01",
          sourcePages: [27],
          transaction: rich("상품권 100,000원을 발행하여 판매하고 현금으로 받다."),
          presentation: "entries",
          entries: [
            {
              debit: [{ account: "현금", amount: 100000 }],
              credit: [{ account: "선수금", amount: 100000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-08-t02-j02",
            sourcePages: [27],
            transaction: rich(
              "상품 180,000원을 매출하고 상품권 100,000원과 나머지 현금을 받다.",
            ),
            presentation: "entries",
            entries: [
              {
                debit: [
                  { account: "선수금", amount: 100000 },
                  { account: "현금", amount: 80000 },
                ],
                credit: [{ account: "상품매출", amount: 180000 }],
              },
            ],
          },
          {
            id: "ch-08-t02-j03",
            sourcePages: [27],
            transaction: rich(
              "상품 90,000원을 매출하고 상품권 100,000원을 받아 나머지 잔액을 현금으로 지급하다.",
            ),
            presentation: "entries",
            entries: [
              {
                debit: [{ account: "선수금", amount: 100000 }],
                credit: [
                  { account: "상품매출", amount: 90000 },
                  { account: "현금", amount: 10000 },
                ],
              },
            ],
          },
          {
            id: "ch-08-t02-j04",
            sourcePages: [27],
            transaction: rich(
              "상품 30,000원을 매출하고 상품권 100,000원을 받아 나머지는 새로운 상품권으로 지급하다.",
            ),
            presentation: "entries",
            entries: [
              {
                debit: [{ account: "선수금", amount: 30000 }],
                credit: [{ account: "상품매출", amount: 30000 }],
              },
            ],
          },
          {
            id: "ch-08-t02-j05",
            sourcePages: [27],
            transaction: rich("상품권 100,000원의 소멸시효가 완성되다."),
            presentation: "entries",
            entries: [
              {
                debit: [{ account: "선수금", amount: 100000 }],
                credit: [{ account: "잡이익(영외수)", amount: 100000 }],
              },
            ],
          },
          {
            id: "ch-08-t02-j06",
            sourcePages: [27],
            transaction: rich(
              "모바일 상품권 100,000원의 소멸시효가 완성되어 90%를 환불하다.",
            ),
            presentation: "entries",
            entries: [
              {
                debit: [{ account: "선수금", amount: 100000 }],
                credit: [
                  { account: "잡이익(영외수)", amount: 10000 },
                  { account: "보통예금", amount: 90000 },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-08-t03",
      chapterId: "ch-08",
      order: 3,
      title: "원천징수의무자와 원천징수대상자의 처리",
      sourcePages: [27],
      updatedAt,
      blocks: [
        paragraph(
          "원천징수제도는 원천징수의무자(소득지급자)가 원천징수대상자(소득자)에게 소득을 지급할 때 세금·공과금을 미리 징수하여 국가 또는 지자체에 신고·납부하는 제도이다.",
        ),
        table(
          ["관점", "이자", "원천징수 계정"],
          [
            ["기업(원천징수대상자)", "이자 수령", "선납세금"],
            ["은행(원천징수의무자)", "이자 지급", "예수금"],
          ],
        ),
        list(
          "이자·배당소득의 원천징수세율은 국세 14%와 국세의 10%인 지방소득세를 합한 금액이다.",
          "소득자는 임직원, 거래처, 프리랜서 등이다.",
          "원천징수의무자는 국세와 지방세를 다음 달 10일까지 신고·납부한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-08-t03-j01",
          sourcePages: [27],
          transaction: rich(
            "㈜그린은 은행으로부터 이자 100,000원 중 원천징수세액 15,400원을 차감한 잔액을 보통예금으로 받다.",
          ),
          presentation: "entries",
          entries: [
            {
              debit: [
                { account: "보통예금", amount: 84600 },
                { account: "선납세금", amount: 15400 },
              ],
              credit: [{ account: "이자수익", amount: 100000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-08-t03-j02",
            sourcePages: [27],
            transaction: rich(
              "은행은 이자 100,000원을 지급하며 원천징수세액 15,400원을 차감한 잔액을 보통예금에서 지급하다.",
            ),
            presentation: "entries",
            entries: [
              {
                debit: [{ account: "이자비용", amount: 100000 }],
                credit: [
                  { account: "보통예금", amount: 84600 },
                  { account: "예수금", amount: 15400 },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-08-t04",
      chapterId: "ch-08",
      order: 4,
      title: "선납세금",
      sourcePages: [27, 28, 30],
      updatedAt,
      blocks: [
        paragraph(
          "선납세금은 원천징수대상자가 미리 납부한 법인세로, 법인세를 중간예납하거나 기중에 원천징수된 법인세를 처리할 때 사용하는 당좌자산이다.",
        ),
        {
          type: "callout",
          tone: "process",
          content: rich(
            "선납세금은 차변에서 발생하고 결산 시 대변에서 소멸하여 잔액을 0으로 만든다.",
          ),
        },
        {
          type: "formula",
          content: rich(
            "법인세등 15,000,000 - 선납세금 8,308,000 = 미지급세금 6,692,000",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-08-t04-j01",
          sourcePages: [28],
          transaction: rich(
            "㈜그린은 당기 법인세 중간예납세액 8,000,000원을 보통예금에서 이체하여 납부하고 자산처리하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/31",
              debit: [{ account: "선납세금", amount: 8000000 }],
              credit: [{ account: "보통예금", amount: 8000000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-08-t04-j02",
            sourcePages: [27],
            transaction: rich(
              "결산 시 원천징수된 법인세 15,400원을 법인세등으로 대체하다.",
            ),
            presentation: "entries",
            entries: [
              {
                label: "결산",
                debit: [{ account: "법인세등", amount: 15400 }],
                credit: [{ account: "선납세금", amount: 15400 }],
              },
            ],
          },
          {
            id: "ch-08-t04-j03",
            sourcePages: [28],
            transaction: rich(
              "㈜그린은 정기예금 이자 2,000,000원 중 원천징수세액 308,000원을 차감한 잔액을 보통예금으로 받고 자산처리하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/10/20",
                debit: [
                  { account: "보통예금", amount: 1692000 },
                  { account: "선납세금", amount: 308000 },
                ],
                credit: [{ account: "이자수익", amount: 2000000 }],
              },
            ],
          },
          {
            id: "ch-08-t04-j04",
            sourcePages: [28],
            transaction: rich(
              "당기 법인세추산액 15,000,000원과 선납세금 잔액 8,308,000원을 조회하여 결산수정하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [{ account: "법인세등", amount: 15000000 }],
                credit: [
                  { account: "선납세금", amount: 8308000 },
                  {
                    account: "미지급세금",
                    counterparty: "관할세무서",
                    amount: 6692000,
                  },
                ],
              },
            ],
          },
          {
            id: "ch-08-t04-j05",
            sourcePages: [30],
            transaction: rich(
              "㈜그린은 정기예금 이자 5,000,000원 중 원천징수 법인세 600,000원을 차감한 잔액을 보통예금으로 받고 자산처리하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/08/21",
                debit: [
                  { account: "보통예금", amount: 4400000 },
                  { account: "선납세금", amount: 600000 },
                ],
                credit: [{ account: "이자수익", amount: 5000000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-08-t05",
      chapterId: "ch-08",
      order: 5,
      title: "예수금 - 사업·이자소득 원천징수",
      sourcePages: [28],
      updatedAt,
      correctionIds: ["correction-015"],
      blocks: [
        paragraph(
          "예수금은 원천징수의무자가 개인 또는 법인에게 소득을 지급할 때 미리 징수한 소득세·법인세·공과금을 일시적으로 보관하는 유동부채이다.",
        ),
        {
          type: "callout",
          tone: "process",
          content: rich(
            "예수금은 대변에서 발생하고 신고·납부 시 차변에서 소멸한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-08-t05-j01",
          sourcePages: [28],
          transaction: rich(
            "㈜그린은 외부강사 교육의 강사료 2,000,000원 중 사업소득세 3.3%를 원천징수하고 잔액을 보통예금에서 지급하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/31",
              debit: [{ account: "교육훈련비(제)", amount: 2000000 }],
              credit: [
                { account: "보통예금", amount: 1934000 },
                { account: "예수금(사업소득세)", amount: 66000 },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-08-t05-j02",
            sourcePages: [28],
            transaction: rich(
              "㈜그린은 ㈜서현 차입금의 이자 1,000,000원 중 원천징수세액 275,000원을 차감한 잔액을 보통예금에서 지급하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/10/20",
                debit: [{ account: "이자비용", amount: 1000000 }],
                credit: [
                  { account: "보통예금", amount: 725000 },
                  { account: "예수금(이자소득세)", amount: 275000 },
                ],
              },
            ],
          },
          {
            id: "ch-08-t05-j03",
            sourcePages: [28],
            transaction: rich(
              "㈜그린은 중국 동시통역사 프리랜서 안수현에게 통역을 의뢰하고 수수료 4,000,000원 중 원천징수세액 320,000원을 차감한 잔액을 보통예금에서 지급하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [{ account: "수수료비용(판)", amount: 4000000 }],
                credit: [
                  { account: "보통예금", amount: 3680000 },
                  { account: "예수금(사업소득세)", amount: 320000 },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-08-t06",
      chapterId: "ch-08",
      order: 6,
      title: "급여 원천징수와 신고납부",
      sourcePages: [27, 29, 30],
      updatedAt,
      correctionIds: ["correction-016"],
      blocks: [
        paragraph(
          "법인이 근로자에게 급여, 임금, 잡급 등 인건비를 지급할 때 근로소득세와 사회보험 근로자부담금을 원천징수한다.",
        ),
        table(
          ["급여 지급·공제내역", "생산부", "영업부"],
          [
            ["총급여액", "5,500,000", "7,000,000"],
            ["근로소득세", "200,000", "250,000"],
            ["국민연금 근로자부담금", "200,000", "300,000"],
            ["건강·장기요양보험 근로자부담금", "120,000", "180,000"],
            ["고용보험 근로자부담금", "40,000", "60,000"],
            ["공제총액", "560,000", "790,000"],
            ["실지급액", "4,940,000", "6,210,000"],
          ],
        ),
        table(
          ["사업주부담금", "생산부", "영업부", "계정"],
          [
            ["국민연금", "200,000", "300,000", "세금과공과"],
            ["건강·장기요양보험", "120,000", "180,000", "복리후생비"],
            ["고용보험", "50,000", "70,000", "보험료 또는 복리후생비"],
            ["산재보험", "20,000", "30,000", "보험료 또는 복리후생비"],
          ],
        ),
        list(
          "국세는 원천징수이행상황신고서를 작성하여 다음 달 10일까지 홈택스에 전자신고·납부한다.",
          "지방세는 지방소득세특별징수분신고서를 작성하여 다음 달 10일까지 위택스에 전자신고·납부한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-08-t06-j01",
          sourcePages: [27],
          transaction: rich(
            "본사 영업부 직원 급여 3,000,000원을 지급하며 원천징수세액 100,000원을 차감한 잔액을 보통예금에서 지급하다.",
          ),
          presentation: "entries",
          entries: [
            {
              debit: [{ account: "급여", amount: 3000000 }],
              credit: [
                { account: "보통예금", amount: 2900000 },
                { account: "예수금", amount: 100000 },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-08-t06-j02",
            sourcePages: [27],
            transaction: rich(
              "원천징수한 세액 100,000원을 신고·납부하다.",
            ),
            presentation: "entries",
            entries: [
              {
                label: "신고납부",
                debit: [{ account: "예수금", amount: 100000 }],
                credit: [{ account: "보통예금", amount: 100000 }],
              },
            ],
          },
          {
            id: "ch-08-t06-j03",
            sourcePages: [29],
            transaction: rich(
              "㈜그린은 생산부 총급여 5,500,000원과 영업부 총급여 7,000,000원에서 공제총액 1,350,000원을 차감하고 보통예금에서 지급하다.",
            ),
            presentation: "variants",
            variants: [
              {
                label: "시험",
                entries: [
                  {
                    date: "26/08/31",
                    debit: [
                      { account: "임금", amount: 5500000 },
                      { account: "급여", amount: 7000000 },
                    ],
                    credit: [
                      { account: "예수금", amount: 1350000 },
                      { account: "보통예금", amount: 11150000 },
                    ],
                  },
                ],
              },
              {
                label: "실무",
                entries: [
                  {
                    date: "26/08/31",
                    debit: [
                      { account: "임금", amount: 5500000 },
                      { account: "급여", amount: 7000000 },
                    ],
                    credit: [
                      { account: "예수금(근로소득세)", amount: 450000 },
                      { account: "예수금(국민연금)", amount: 500000 },
                      { account: "예수금(건강/장기요양)", amount: 300000 },
                      { account: "예수금(고용보험)", amount: 100000 },
                      { account: "보통예금", amount: 11150000 },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "ch-08-t06-j04",
            sourcePages: [29],
            transaction: rich(
              "근로소득세 450,000원과 국민연금 근로자부담금 500,000원을 사업주부담금 500,000원과 함께 보통예금에서 납부하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/09/09",
                debit: [
                  { account: "예수금", amount: 950000 },
                  { account: "세금과공과(제)", amount: 200000 },
                  { account: "세금과공과(판)", amount: 300000 },
                ],
                credit: [{ account: "보통예금", amount: 1450000 }],
              },
            ],
          },
          {
            id: "ch-08-t06-j05",
            sourcePages: [29],
            transaction: rich(
              "건강·장기요양보험과 고용보험 근로자부담금 400,000원을 사업주부담금과 함께 보통예금에서 납부하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/09/10",
                debit: [
                  { account: "예수금", amount: 400000 },
                  { account: "복리후생비(제)", amount: 120000 },
                  { account: "복리후생비(판)", amount: 180000 },
                  { account: "보험료(제)", amount: 70000 },
                  { account: "보험료(판)", amount: 100000 },
                ],
                credit: [{ account: "보통예금", amount: 870000 }],
              },
            ],
          },
          {
            id: "ch-08-t06-j06",
            sourcePages: [30],
            transaction: rich(
              "국민연금 근로자부담금 250,000원과 생산부 사업주부담금 150,000원, 영업부 사업주부담금 100,000원을 보통예금에서 납부하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/09/10",
                debit: [
                  { account: "예수금", amount: 250000 },
                  { account: "세금과공과(제)", amount: 150000 },
                  { account: "세금과공과(판)", amount: 100000 },
                ],
                credit: [{ account: "보통예금", amount: 500000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-08-t07",
      chapterId: "ch-08",
      order: 7,
      title: "가지급금 발생",
      sourcePages: [30],
      updatedAt,
      blocks: [
        paragraph(
          "가지급금(전도금)은 자금 유출이 있었으나 계정과목과 금액을 확정할 수 없을 때 사용하는 임시자산계정이다.",
        ),
        list(
          "차변에서 발생하고 정산 시 대변에서 소멸한다.",
          "임시계정 불표시 원칙에 따라 기말잔액을 0으로 만든다.",
          "임직원 출장비(개산여비), 대표이사 등 임원의 가지급금, 임직원 가불금 등에 사용한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-08-t07-j01",
          sourcePages: [30],
          transaction: rich(
            "㈜그린은 회계팀장 김윤정에게 부산 출장비 1,000,000원을 현금으로 지급하고 복귀 후 정산하기로 하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/21",
              debit: [
                {
                  account: "가지급금",
                  counterparty: "김윤정",
                  amount: 1000000,
                },
              ],
              credit: [{ account: "현금", amount: 1000000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-08-t07-j02",
            sourcePages: [30],
            transaction: rich(
              "㈜그린은 대표이사 김윤정에게 현금 10,000,000원을 지급했으나 사용내역을 알 수 없다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/15",
                debit: [
                  {
                    account: "가지급금",
                    counterparty: "대표이사",
                    amount: 10000000,
                  },
                ],
                credit: [{ account: "현금", amount: 10000000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-08-t08",
      chapterId: "ch-08",
      order: 8,
      title: "가지급금 정산",
      sourcePages: [30],
      updatedAt,
      correctionIds: ["correction-020"],
      blocks: [
        paragraph(
          "출장에서 복귀하면 영수증과 지출결의서로 가지급금을 정산하고, 초과사용액은 지급하며 미사용액은 반납받는다.",
        ),
        table(
          ["사용내역", "금액", "계정 구분"],
          [
            ["KTX 왕복요금", "120,000", "여비교통비"],
            ["호텔 숙박비", "500,000", "여비교통비"],
            ["부산시내 교통비", "80,000", "여비교통비"],
            ["출장 시 개인식대", "750,000", "여비교통비"],
            ["개인 간식구입비", "100,000", "여비교통비"],
            [
              "매출거래처 영업부장과 식사",
              "200,000",
              "기업업무추진비(판)",
            ],
            [
              "매출거래처 사장님 선물 구입",
              "50,000",
              "기업업무추진비(판)",
            ],
            [
              "매입거래처 방문 시 음료구입비",
              "50,000",
              "기업업무추진비(제)",
            ],
          ],
        ),
      ],
      journal: {
        representative: {
          id: "ch-08-t08-j01",
          sourcePages: [30],
          transaction: rich(
            "김윤정 팀장의 출장비 사용액 1,850,000원을 가지급금 1,000,000원과 정산하고 초과액 850,000원을 현금으로 지급하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/25",
              debit: [
                { account: "여비교통비(판)", amount: 1550000 },
                { account: "기업업무추진비(판)", amount: 250000 },
                { account: "기업업무추진비(제)", amount: 50000 },
              ],
              credit: [
                {
                  account: "가지급금",
                  counterparty: "김윤정",
                  amount: 1000000,
                },
                { account: "현금", amount: 850000 },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-08-t08-j02",
            sourcePages: [30],
            transaction: rich(
              "안수현 팀장의 출장비 사용액 650,000원을 가지급금 1,000,000원과 정산하고 미사용액 350,000원을 현금으로 반납받다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/08/25",
                debit: [
                  { account: "여비교통비(판)", amount: 650000 },
                  { account: "현금", amount: 350000 },
                ],
                credit: [
                  {
                    account: "가지급금",
                    counterparty: "안수현",
                    amount: 1000000,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-08-t09",
      chapterId: "ch-08",
      order: 9,
      title: "가수금 발생과 원인 확정",
      sourcePages: [30],
      updatedAt,
      blocks: [
        paragraph(
          "가수금은 자금 유입이 있었으나 계정과목과 금액을 확정할 수 없을 때 사용하는 임시부채계정이다.",
        ),
        {
          type: "callout",
          tone: "process",
          content: rich(
            "가수금은 대변에서 발생하고 유입된 자금의 출처가 확인되면 차변에서 소멸한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-08-t09-j01",
          sourcePages: [30],
          transaction: rich(
            "부산 출장 중인 김윤정으로부터 출처를 알 수 없는 송금액 45,000,000원이 보통예금으로 입금되다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/23",
              debit: [{ account: "보통예금", amount: 45000000 }],
              credit: [
                {
                  account: "가수금",
                  counterparty: "김윤정",
                  amount: 45000000,
                },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-08-t09-j02",
            sourcePages: [30],
            transaction: rich(
              "가수금 45,000,000원의 출처가 ㈜미금 외상매출금 30,000,000원과 ㈜서현 제품매출 계약금 15,000,000원으로 확인되다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/08/24",
                debit: [
                  {
                    account: "가수금",
                    counterparty: "김윤정",
                    amount: 45000000,
                  },
                ],
                credit: [
                  {
                    account: "외상매출금",
                    counterparty: "미금",
                    amount: 30000000,
                  },
                  {
                    account: "선수금",
                    counterparty: "서현",
                    amount: 15000000,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};
