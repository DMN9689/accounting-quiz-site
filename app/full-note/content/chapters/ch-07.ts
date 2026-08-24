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

export const chapter07: Chapter = {
  id: "ch-07",
  order: 7,
  title: "대손회계",
  sourcePages: [22, 23, 24, 25, 26],
  theories: [
    {
      id: "ch-07-t01",
      chapterId: "ch-07",
      order: 1,
      title: "대손의 의미와 수익비용대응 원리",
      sourcePages: [22],
      updatedAt,
      correctionIds: ["correction-011"],
      blocks: [
        list(
          "대손은 채권이 회수불능된 경우 발생하는 손실이고, 대손금은 회수불능된 채권가액이다.",
          "대손사유에는 거래처 파산, 채무자 사망·실종, 사업폐지, 부도 등이 있다.",
          "매기 결산 때 채권잔액 중 회수불능으로 추정되는 대손추산액을 대손상각비로 비용처리하고 채권별 대손충당금을 설정한다.",
          "채권이 회수불능되면 대변에 쌓아둔 대손충당금을 차변으로 대체하여 사용한다.",
        ),
        {
          type: "callout",
          tone: "key",
          content: rich(
            "수익비용대응의 원칙: 비용은 항상 그 수익에 대응되게 표시한다. 2026년 수익창출을 위해 희생된 비용이면 2026년도 비용으로 처리한다.",
          ),
        },
        table(
          ["부분재무상태표 B/S 2026/12/31", "금액", "장부가액"],
          [
            ["외상매출금", "500,000,000", "495,000,000"],
            ["대손충당금(차감)", "5,000,000", ""],
          ],
        ),
      ],
      journal: {
        representative: {
          id: "ch-07-t01-j01",
          sourcePages: [22],
          transaction: rich(
            "결산일 외상매출금 잔액 500,000,000원에 1%의 대손을 설정하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/12/31",
              debit: [{ account: "대손상각비(판)", amount: 5000000 }],
              credit: [{ account: "대손충당금(외)", amount: 5000000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-07-t01-j02",
            sourcePages: [22],
            transaction: rich(
              "상품 3,000,000원을 외상매출하고 3개월 후 회수하기로 하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/11/26",
                debit: [{ account: "외상매출금", amount: 3000000 }],
                credit: [{ account: "상품매출", amount: 3000000 }],
              },
            ],
          },
          {
            id: "ch-07-t01-j03",
            sourcePages: [22],
            transaction: rich(
              "외상매출금 3,000,000원의 회수일에 거래처 파산으로 채권이 회수불능되다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "27/02/26",
                debit: [{ account: "대손충당금(외)", amount: 3000000 }],
                credit: [{ account: "외상매출금", amount: 3000000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-07-t02",
      chapterId: "ch-07",
      order: 2,
      title: "기말 대손충당금 설정과 환입",
      sourcePages: [23, 24],
      updatedAt,
      correctionIds: ["correction-012", "correction-013", "correction-019"],
      blocks: [
        {
          type: "formula",
          content: rich(
            "대손추산액 = 기말 채권잔액 × 대손설정률 = 설정 후 대손충당금잔액",
          ),
        },
        table(
          ["대손추산액", "설정 전 잔액", "차이", "처리"],
          [
            [
              "10,000",
              "7,000",
              "3,000(양수)",
              "대손상각비 3,000 / 대손충당금 3,000: 설정",
            ],
            [
              "10,000",
              "12,000",
              "△2,000(음수)",
              "대손충당금 2,000 / 대손충당금환입 2,000: 환입",
            ],
          ],
        ),
        {
          type: "callout",
          tone: "key",
          content: rich(
            "보충법에서는 대손추산액에서 설정 전 대손충당금잔액을 차감한 결과가 양수이면 설정하고 음수이면 환입한다. 200 < 250이면 50을 환입한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-07-t02-j01",
          sourcePages: [23],
          transaction: rich(
            "대손추산액 10,000원, 설정 전 대손충당금잔액 7,000원이다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "12/31",
              debit: [{ account: "대손상각비", amount: 3000 }],
              credit: [{ account: "대손충당금", amount: 3000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-07-t02-j02",
            sourcePages: [23],
            transaction: rich(
              "대손추산액 10,000원, 설정 전 대손충당금잔액 12,000원이다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "12/31",
                debit: [{ account: "대손충당금", amount: 2000 }],
                credit: [{ account: "대손충당금환입", amount: 2000 }],
              },
            ],
          },
          {
            id: "ch-07-t02-j03",
            sourcePages: [23],
            transaction: rich(
              "외상매출금 500,000,000원과 받을어음 300,000,000원에 각각 1%의 대손을 설정한다. 설정 전 대손충당금은 (외) 2,000,000원, (받) 2,500,000원이다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [{ account: "대손상각비(판)", amount: 3500000 }],
                credit: [
                  { account: "대손충당금(외)", amount: 3000000 },
                  { account: "대손충당금(받)", amount: 500000 },
                ],
              },
            ],
          },
          {
            id: "ch-07-t02-j04",
            sourcePages: [24],
            transaction: rich(
              "외상매출금 400,000,000원과 받을어음 700,000,000원에 각각 1%의 대손을 설정한다. 설정 전 대손충당금은 (외) 6,000,000원, (받) 3,000,000원이다.",
            ),
            presentation: "entries",
            entries: [
              {
                label: "환입",
                date: "27/12/31",
                debit: [{ account: "대손충당금(외)", amount: 2000000 }],
                credit: [{ account: "대손충당금환입(판)", amount: 2000000 }],
              },
              {
                label: "설정",
                date: "27/12/31",
                debit: [{ account: "대손상각비(판)", amount: 4000000 }],
                credit: [{ account: "대손충당금(받)", amount: 4000000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-07-t03",
      chapterId: "ch-07",
      order: 3,
      title: "대손충당금이 충분한 대손발생",
      sourcePages: [23],
      updatedAt,
      blocks: [
        paragraph(
          "대손발생일에 채권별 대손충당금 대변잔액을 조회하고, 잔액이 충분하면 대손충당금과 채권을 상계한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-07-t03-j01",
          sourcePages: [23],
          transaction: rich(
            "㈜미금의 파산으로 외상매출금 4,000,000원이 회수불능되었고 대손충당금(외) 잔액은 5,000,000원이다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "27/05/05",
              debit: [{ account: "대손충당금(외)", amount: 4000000 }],
              credit: [
                {
                  account: "외상매출금",
                  counterparty: "미금",
                  amount: 4000000,
                },
              ],
            },
          ],
        },
        extras: [],
      },
    },
    {
      id: "ch-07-t04",
      chapterId: "ch-07",
      order: 4,
      title: "대손충당금이 부족하거나 없는 대손발생",
      sourcePages: [23],
      updatedAt,
      blocks: [
        paragraph(
          "대손충당금을 차변에서 우선 상계하고 부족분만 대손상각비로 처리한다. 대손충당금이 0이면 전액을 대손상각비로 처리한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-07-t04-j01",
          sourcePages: [23],
          transaction: rich(
            "㈜서현의 파산으로 외상매출금 5,000,000원이 회수불능되었고 대손충당금(외) 잔액은 1,000,000원이다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "27/08/15",
              debit: [
                { account: "대손충당금(외)", amount: 1000000 },
                { account: "대손상각비(판)", amount: 4000000 },
              ],
              credit: [
                {
                  account: "외상매출금",
                  counterparty: "서현",
                  amount: 5000000,
                },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-07-t04-j02",
            sourcePages: [23],
            transaction: rich(
              "㈜죽전의 파산으로 외상매출금 2,000,000원이 회수불능되었고 대손충당금(외) 잔액은 0이다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "27/12/24",
                debit: [{ account: "대손상각비(판)", amount: 2000000 }],
                credit: [
                  {
                    account: "외상매출금",
                    counterparty: "죽전",
                    amount: 2000000,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-07-t05",
      chapterId: "ch-07",
      order: 5,
      title: "대손금 회수",
      sourcePages: [24],
      updatedAt,
      blocks: [
        paragraph(
          "이미 대손처리한 대손금을 회수하면 거래를 취소하는 방식으로 보통예금을 차변에 기록하고 대변은 조건과 관계없이 채권별 대손충당금으로 처리한다.",
        ),
        table(
          ["구분", "처리"],
          [
            ["당기 대손발생 → 당기 회수", "보통예금 / 대손충당금"],
            ["전기 대손발생 → 당기 회수", "보통예금 / 대손충당금"],
          ],
        ),
      ],
      journal: {
        representative: {
          id: "ch-07-t05-j01",
          sourcePages: [24],
          transaction: rich(
            "지난 05/05에 대손처리한 ㈜미금 외상매출금 4,000,000원을 회수하여 보통예금으로 받다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "27/12/26",
              debit: [{ account: "보통예금", amount: 4000000 }],
              credit: [{ account: "대손충당금(외)", amount: 4000000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-07-t05-j02",
            sourcePages: [24],
            transaction: rich(
              "지난 12/24에 대손처리한 ㈜죽전 외상매출금 2,000,000원을 회수하여 보통예금으로 받다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "27/12/27",
                debit: [{ account: "보통예금", amount: 2000000 }],
                credit: [{ account: "대손충당금(외)", amount: 2000000 }],
              },
            ],
          },
          {
            id: "ch-07-t05-j03",
            sourcePages: [24],
            transaction: rich(
              "전기 08/15에 대손처리한 ㈜서현 외상매출금 5,000,000원을 회수하여 보통예금으로 받다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "28/08/19",
                debit: [{ account: "보통예금", amount: 5000000 }],
                credit: [{ account: "대손충당금(외)", amount: 5000000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-07-t06",
      chapterId: "ch-07",
      order: 6,
      title: "대손충당금 T계정과 기말잔액 계산",
      sourcePages: [25],
      updatedAt,
      blocks: [
        table(
          ["차변", "대변"],
          [
            ["대손발생(확정)", "기초(전기이월)"],
            ["기말 설정 후 잔액 = 대손추산액", "대손금 회수"],
            ["", "설정(양수) 또는 환입(음수)"],
          ],
        ),
        {
          type: "formula",
          content: rich(
            "설정 전 대손충당금잔액 = 기초 대손충당금잔액 - 대손발생액 + 대손금회수액",
          ),
        },
        list(
          "대손추산액: 29,250,000 × 1% = 292,500",
          "설정 전 대손충당금잔액: 680,000 - 250,000 + 60,000 = 490,000",
          "설정액 또는 환입액: 292,500 - 490,000 = △197,500, 환입(음수)",
        ),
      ],
    },
    {
      id: "ch-07-t07",
      chapterId: "ch-07",
      order: 7,
      title: "기타채권 대손충당금 설정과 환입",
      sourcePages: [25],
      updatedAt,
      blocks: [
        paragraph(
          "기타채권은 상거래 이외의 거래에서 발생하는 미수금, 장·단기대여금, 선급금 등의 채권이다.",
        ),
        {
          type: "callout",
          tone: "key",
          content: rich(
            "기타채권의 대손 설정과 환입은 900번대 코드인 영업외비용·영업외수익으로 처리한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-07-t07-j01",
          sourcePages: [25],
          transaction: rich(
            "미수금 기말잔액 100,000,000원에 0.5%의 대손을 설정한다. 설정 전 대손충당금(미수금) 잔액은 150,000원이다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/12/31",
              debit: [{ account: "기타의대손상각비(영외비)", amount: 350000 }],
              credit: [{ account: "대손충당금(미수)", amount: 350000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-07-t07-j02",
            sourcePages: [25],
            transaction: rich(
              "미수금 기말잔액 100,000,000원에 0.5%의 대손을 설정한다. 설정 전 대손충당금(미수금) 잔액은 550,000원이다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [{ account: "대손충당금(미수)", amount: 50000 }],
                credit: [
                  { account: "대손충당금환입(영외수)", amount: 50000 },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-07-t08",
      chapterId: "ch-07",
      order: 8,
      title: "기타채권 충당금이 충분한 대손발생",
      sourcePages: [26],
      updatedAt,
      blocks: [
        paragraph(
          "미수금, 장·단기대여금, 선급금 등이 회수불능되고 해당 기타채권의 대손충당금이 충분하면 대손충당금과 채권을 상계한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-07-t08-j01",
          sourcePages: [26],
          transaction: rich(
            "㈜서현이 ㈜미금에 대여한 단기대여금 1,500,000원이 회수불능되었고 대손충당금(단기대여금) 잔액은 2,000,000원이다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/20",
              debit: [{ account: "대손충당금(단기)", amount: 1500000 }],
              credit: [
                {
                  account: "단기대여금",
                  counterparty: "미금",
                  amount: 1500000,
                },
              ],
            },
          ],
        },
        extras: [],
      },
    },
    {
      id: "ch-07-t09",
      chapterId: "ch-07",
      order: 9,
      title: "기타채권 충당금이 부족한 대손발생",
      sourcePages: [26],
      updatedAt,
      blocks: [
        paragraph(
          "기타채권의 대손충당금을 우선 상계하고 부족분은 기타의대손상각비(영외비)로 처리한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-07-t09-j01",
          sourcePages: [26],
          transaction: rich(
            "㈜서현이 ㈜미금에 대여한 단기대여금 1,500,000원이 회수불능되었고 대손충당금(단기대여금) 잔액은 1,200,000원이다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/20",
              debit: [
                { account: "대손충당금(단기)", amount: 1200000 },
                { account: "기타의대손상각비(영외비)", amount: 300000 },
              ],
              credit: [
                {
                  account: "단기대여금",
                  counterparty: "미금",
                  amount: 1500000,
                },
              ],
            },
          ],
        },
        extras: [],
      },
    },
    {
      id: "ch-07-t10",
      chapterId: "ch-07",
      order: 10,
      title: "기타채권 대손금 회수와 매출채권 비교",
      sourcePages: [26],
      updatedAt,
      blocks: [
        paragraph(
          "이미 대손처리한 기타채권을 회수하면 보통예금 XXX / 대손충당금(미수, 단기대여, 장기대여, 선급금 등) XXX 형식으로 처리한다. 원문 금액이 XXX이므로 완성 분개 사례로 세지 않는다.",
        ),
        table(
          ["구분", "대손설정", "대손환입"],
          [
            [
              "매출채권: 외상매출금·받을어음, 800번대",
              "대손상각비(판) / 대손충당금",
              "대손충당금 / 대손충당금환입(판)",
            ],
            [
              "기타채권: 미수금·대여금 등, 900번대",
              "기타의대손상각비(영) / 대손충당금",
              "대손충당금 / 대손충당금환입(영)",
            ],
          ],
        ),
      ],
    },
    {
      id: "ch-07-t11",
      chapterId: "ch-07",
      order: 11,
      title: "연령분석법",
      sourcePages: [26],
      updatedAt,
      blocks: [
        paragraph(
          "연령분석법은 채권의 회수기간이 경과할수록 회수가능성이 떨어지는 점을 반영하여 채권을 연령별로 구분하고 대손설정률을 다르게 적용하는 방법이다.",
        ),
        table(
          ["회수기간", "기간별 기말채권잔액", "대손설정률", "기간별 대손추산액"],
          [
            ["3개월 이하", "300,000,000", "0.1%", "300,000"],
            ["3개월 초과~6개월 이하", "100,000,000", "1%", "1,000,000"],
            ["6개월 초과", "20,000,000", "10%", "2,000,000"],
            ["계", "420,000,000", "", "3,300,000"],
          ],
        ),
      ],
    },
  ],
};
