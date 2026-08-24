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

export const chapter05: Chapter = {
  id: "ch-05",
  order: 5,
  title: "단기투자자산과 단기매매증권",
  sourcePages: [16, 17, 18, 19],
  theories: [
    {
      id: "ch-05-t01",
      chapterId: "ch-05",
      order: 1,
      title: "단기투자자산의 구성",
      sourcePages: [16],
      updatedAt,
      blocks: [
        paragraph(
          "단기투자자산은 전산 제출용 탭의 통합계정이며 단기금융상품, 단기대여금, 유가증권으로 구성된다.",
        ),
        list(
          "단기금융상품: 결산일로부터 만기 1년 이내에 도래하는 정기예금·정기적금. 장기금융상품은 비유동자산의 투자자산이다.",
          "단기대여금: 결산일로부터 만기 1년 이내에 회수하는 조건으로 대여한 자금. 장기대여금은 비유동자산의 투자자산이다.",
          "유가증권: 주식, 공채, 국채, 사채 등 재산적 가치가 있는 증권이다.",
        ),
      ],
    },
    {
      id: "ch-05-t02",
      chapterId: "ch-05",
      order: 2,
      title: "지분증권·채무증권과 투자수익",
      sourcePages: [16],
      updatedAt,
      blocks: [
        table(
          ["구분", "취득 관계", "특징", "투자수익"],
          [
            [
              "지분증권",
              "여유자금으로 주식을 구입",
              "주주(투자자), 지분율에 따른 경영참여 가능, 만기 없음",
              "배당금",
            ],
            [
              "채무증권",
              "여유자금으로 사채를 구입",
              "채권자, 경영참여 불가능, 만기 있음",
              "이자",
            ],
          ],
        ),
        paragraph(
          "지분증권의 배당금은 배당금수익, 채무증권의 이자는 이자수익으로 처리한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-05-t02-j01",
          sourcePages: [16],
          transaction: rich("지분증권에서 배당금 100을 보통예금으로 수령하다."),
          presentation: "entries",
          entries: [
            {
              debit: [{ account: "보통예금", amount: 100 }],
              credit: [{ account: "배당금수익(영외수)", amount: 100 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-05-t02-j02",
            sourcePages: [16],
            transaction: rich("채무증권에서 이자 100을 보통예금으로 수령하다."),
            presentation: "entries",
            entries: [
              {
                debit: [{ account: "보통예금", amount: 100 }],
                credit: [{ account: "이자수익(영외수)", amount: 100 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-05-t03",
      chapterId: "ch-05",
      order: 3,
      title: "보유목적·능력별 유가증권 분류와 평가방법",
      sourcePages: [16],
      updatedAt,
      blocks: [
        table(
          ["계정과목", "보유목적과 능력", "증권종류", "기말평가방법"],
          [
            [
              "단기매매증권\n당좌자산 107",
              "단기간의 시세차익, 시장성 있음",
              "지분증권·채무증권",
              "시가법(공정가액법)",
            ],
            [
              "매도가능증권\n당좌자산 123\n투자자산 178",
              "단기매매증권 또는 만기보유증권으로 분류할 수 없는 증권",
              "지분증권·채무증권",
              "원칙은 시가법. 시장성이 없는 경우 원가법",
            ],
            [
              "만기보유증권\n당좌자산 124\n투자자산 181",
              "만기까지 보유할 적극적 의도와 능력",
              "채무증권\n1년 만기 사채\n10년 만기 사채",
              "기말평가하지 않고 만기까지 보유",
            ],
            [
              "지분법적용투자주식\n투자자산 182",
              "피투자회사를 지배할 목적으로 취득하여 중대한 영향력 행사",
              "지분증권",
              "지분법 평가",
            ],
          ],
        ),
        {
          type: "callout",
          tone: "key",
          content: rich(
            "시장성이 있는 유가증권은 시가법(공정가액법), 시장성이 없는 유가증권은 원가법으로 평가한다.",
          ),
        },
      ],
    },
    {
      id: "ch-05-t04",
      chapterId: "ch-05",
      order: 4,
      title: "단기매매증권 취득",
      sourcePages: [16],
      updatedAt,
      blocks: [
        paragraph(
          "모든 자산은 취득 시 발생하는 부대비용을 자산의 취득원가에 포함한다.",
        ),
        {
          type: "callout",
          tone: "warning",
          content: [
            { text: "단, 단기매매증권은 제외한다. ", marks: ["bold"] },
            {
              text: "취득 수수료는 수수료비용(영외비)으로 처리한다.",
              marks: ["highlight"],
            },
          ],
        },
        paragraph(
          "매수와 매도가 빈번한 특성상 수수료를 취득원가에 포함하면 단가계산이 어려워 취득 시 즉시 비용처리한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-05-t04-j01",
          sourcePages: [16],
          transaction: rich(
            "㈜그린은 단기간의 시세차익을 목적으로 시장성 있는 ㈜미금 주식 1,000주를 주당 12,000원에 취득하고 수수료 150,000원을 현금으로 지급하며 구입대금은 보통예금에서 이체하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/14",
              debit: [
                { account: "단기매매증권", amount: 12000000 },
                { account: "수수료비용(영외비)", amount: 150000 },
              ],
              credit: [
                { account: "현금", amount: 150000 },
                { account: "보통예금", amount: 12000000 },
              ],
            },
          ],
        },
        extras: [],
      },
    },
    {
      id: "ch-05-t05",
      chapterId: "ch-05",
      order: 5,
      title: "단기매매증권 처분",
      sourcePages: [17],
      updatedAt,
      blocks: [
        paragraph(
          "단기매매증권은 처분 시 대변에서 장부가액을 소멸하고 처분수수료는 처분가액에서 차감한다.",
        ),
        list(
          "장부가액 < 처분가액이면 처분수수료를 처분이익에서 차감한다.",
          "장부가액 > 처분가액이면 처분수수료를 처분손실에 가산한다.",
          "처분수수료는 수수료비용 계정을 사용하지 않고 분개 후 대차차액으로 처분손익을 맞춘다.",
          "차변차액은 처분손실, 대변차액은 처분이익이다.",
        ),
        {
          type: "callout",
          tone: "process",
          content: rich("처분손익은 손익계산서의 실현손익이다."),
        },
      ],
      journal: {
        representative: {
          id: "ch-05-t05-j01",
          sourcePages: [17],
          transaction: rich(
            "㈜그린은 장부가액 주당 12,000원인 ㈜미금 단기매매증권 100주를 주당 15,000원에 처분하고 수수료 80,000원을 차감한 잔액을 보통예금으로 받다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/09/14",
              debit: [{ account: "보통예금", amount: 1420000 }],
              credit: [
                { account: "단기매매증권", amount: 1200000 },
                { account: "단기매매증권처분이익(영외수)", amount: 220000 },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-05-t05-j02",
            sourcePages: [17],
            transaction: rich(
              "㈜그린은 장부가액 주당 12,000원인 단기매매증권 100주를 주당 11,000원에 처분하고 수수료 50,000원을 현금 지급하며 처분대금은 보통예금으로 받다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/10/14",
                debit: [
                  { account: "보통예금", amount: 1100000 },
                  { account: "단기매매증권처분손실(영외비)", amount: 150000 },
                ],
                credit: [
                  { account: "단기매매증권", amount: 1200000 },
                  { account: "현금", amount: 50000 },
                ],
              },
            ],
          },
          {
            id: "ch-05-t05-j03",
            sourcePages: [17],
            transaction: rich(
              "㈜그린은 장부가액 주당 12,000원인 단기매매증권 200주를 주당 12,300원에 처분하고 수수료 100,000원을 차감한 잔액을 보통예금으로 받다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/11/14",
                debit: [
                  { account: "보통예금", amount: 2360000 },
                  { account: "단기매매증권처분손실", amount: 40000 },
                ],
                credit: [{ account: "단기매매증권", amount: 2400000 }],
              },
            ],
          },
          {
            id: "ch-05-t05-j04",
            sourcePages: [17],
            transaction: rich(
              "㈜그린은 장부가액 주당 12,000원인 단기매매증권 150주를 주당 14,000원에 처분하고 수수료 70,000원을 현금 지급하며 처분대금은 보통예금으로 받다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/14",
                debit: [{ account: "보통예금", amount: 2100000 }],
                credit: [
                  { account: "단기매매증권", amount: 1800000 },
                  { account: "현금", amount: 70000 },
                  { account: "단기매매증권처분이익", amount: 230000 },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-05-t06",
      chapterId: "ch-05",
      order: 6,
      title: "단기매매증권 기말평가",
      sourcePages: [17, 18],
      updatedAt,
      blocks: [
        paragraph(
          "기말평가는 주주에게 결산일의 올바른 자산가치를 보고하기 위해 장부가액을 기말 공정가액(시가)으로 변경하는 것이다.",
        ),
        table(
          ["비교", "자산 조정", "평가손익"],
          [
            [
              "장부가액 < 기말 공정가액",
              "단기매매증권 증가",
              "단기매매증권평가이익(영외수)",
            ],
            [
              "장부가액 > 기말 공정가액",
              "단기매매증권 감소",
              "단기매매증권평가손실(영외비)",
            ],
          ],
        ),
        {
          type: "callout",
          tone: "key",
          content: rich(
            "평가 후 단기매매증권 장부가액은 기말 공정가액(시가)과 일치하며, 전기말 공정가액은 당기 장부가액이다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-05-t06-j01",
          sourcePages: [17],
          transaction: rich(
            "단기매매증권 100주의 장부가액 1,000,000원을 기말 공정가액 1,200,000원으로 평가하다.",
          ),
          presentation: "entries",
          entries: [
            {
              debit: [{ account: "단기매매증권", amount: 200000 }],
              credit: [
                { account: "단기매매증권평가이익(영외수)", amount: 200000 },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-05-t06-j02",
            sourcePages: [17],
            transaction: rich(
              "단기매매증권 100주의 장부가액 1,000,000원을 기말 공정가액 950,000원으로 평가하다.",
            ),
            presentation: "entries",
            entries: [
              {
                debit: [
                  { account: "단기매매증권평가손실(영외비)", amount: 50000 },
                ],
                credit: [{ account: "단기매매증권", amount: 50000 }],
              },
            ],
          },
          {
            id: "ch-05-t06-j03",
            sourcePages: [18],
            transaction: rich(
              "㈜미금 단기매매증권 450주의 장부가액 5,400,000원을 기말 공정가액 6,300,000원으로 평가하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [{ account: "단기매매증권", amount: 900000 }],
                credit: [
                  { account: "단기매매증권평가이익(영외수)", amount: 900000 },
                ],
              },
            ],
          },
          {
            id: "ch-05-t06-j04",
            sourcePages: [18],
            transaction: rich(
              "㈜미금 단기매매증권 450주의 장부가액 5,400,000원을 기말 공정가액 4,815,000원으로 평가하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [
                  { account: "단기매매증권평가손실(영외비)", amount: 585000 },
                ],
                credit: [{ account: "단기매매증권", amount: 585000 }],
              },
            ],
          },
          {
            id: "ch-05-t06-j05",
            sourcePages: [18],
            transaction: rich(
              "㈜제니의 평가이익은 70,000,000원이고 ㈜카리나의 평가손실은 20,000,000원이다. 개별평가와 통합평가를 각각 적용하다.",
            ),
            presentation: "variants",
            variants: [
              {
                label: "개별평가",
                entries: [
                  {
                    date: "26/12/31",
                    debit: [
                      { account: "단기매매증권", amount: 50000000 },
                      {
                        account: "단기매매증권평가손실",
                        amount: 20000000,
                      },
                    ],
                    credit: [
                      {
                        account: "단기매매증권평가이익",
                        amount: 70000000,
                      },
                    ],
                  },
                ],
              },
              {
                label: "통합평가",
                entries: [
                  {
                    date: "26/12/31",
                    debit: [{ account: "단기매매증권", amount: 50000000 }],
                    credit: [
                      {
                        account: "단기매매증권평가이익",
                        amount: 50000000,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "ch-05-t06-j06",
            sourcePages: [18],
            transaction: rich(
              "㈜박보검 단기매매증권 1,000주의 전기말 공정가액은 주당 13,000원이고 당기말 공정가액은 주당 10,500원이다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [
                  {
                    account: "단기매매증권평가손실",
                    amount: 2500000,
                  },
                ],
                credit: [{ account: "단기매매증권", amount: 2500000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-05-t07",
      chapterId: "ch-05",
      order: 7,
      title: "평가 후 처분",
      sourcePages: [19],
      updatedAt,
      blocks: [
        paragraph(
          "전기에 취득하고 전기 기말에 평가한 단기매매증권을 처분할 때는 전기 기말공정가액을 당기 장부가액으로 사용한다.",
        ),
        table(
          ["보유주식수", "전기 취득원가", "전기 기말공정가액"],
          [["1,000주", "주당 12,500원", "주당 13,000원(장부가액)"]],
        ),
      ],
      journal: {
        representative: {
          id: "ch-05-t07-j01",
          sourcePages: [19],
          transaction: rich(
            "㈜그린은 ㈜죽전 단기매매증권 300주를 주당 15,200원에 처분하고 수수료 60,000원을 차감한 잔액을 보통예금으로 받다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/18",
              debit: [{ account: "보통예금", amount: 4500000 }],
              credit: [
                { account: "단기매매증권", amount: 3900000 },
                { account: "단기매매증권처분이익", amount: 600000 },
              ],
            },
          ],
        },
        extras: [],
      },
    },
    {
      id: "ch-05-t08",
      chapterId: "ch-05",
      order: 8,
      title: "유가증권 단가결정방법",
      sourcePages: [19],
      updatedAt,
      blocks: [
        paragraph(
          "기업회계기준에서 인정하는 유가증권 단가결정방법은 이동평균법과 총평균법이며, 비교적 이동평균법이 합리적이다.",
        ),
      ],
    },
    {
      id: "ch-05-t09",
      chapterId: "ch-05",
      order: 9,
      title: "유가증권 재분류",
      sourcePages: [19],
      updatedAt,
      blocks: [
        paragraph(
          "유가증권의 재분류는 기업이 보유한 유가증권의 보유목적과 능력이 변할 때 검토한다.",
        ),
        table(
          ["취득 시 계정과목", "재분류 여부", "변경 후 계정과목", "특징"],
          [
            [
              "단기매매증권",
              "가능(제한적)",
              "매도가능증권",
              "단기매매증권이 시장성을 상실한 경우",
            ],
            [
              "단기매매증권",
              "가능",
              "만기보유증권",
              "채무증권에 한하여 보유목적과 능력 변화가 있는 경우",
            ],
            [
              "매도가능증권·만기보유증권",
              "불가능",
              "단기매매증권",
              "시장성을 회복해도 재분류할 수 없는 일방통행",
            ],
            [
              "매도가능증권",
              "가능",
              "만기보유증권",
              "상호 재분류 가능",
            ],
          ],
        ),
      ],
    },
  ],
};
