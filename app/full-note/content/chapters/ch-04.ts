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

export const chapter04: Chapter = {
  id: "ch-04",
  order: 4,
  title: "현금·당좌예금·현금과부족",
  sourcePages: [13, 14, 15],
  theories: [
    {
      id: "ch-04-t01",
      chapterId: "ch-04",
      order: 1,
      title: "현금및현금성자산",
      sourcePages: [13],
      updatedAt,
      blocks: [
        paragraph(
          "당좌자산은 판매과정을 거치지 않고 1년 이내 현금화될 것으로 예상되는 자산이다. 현금및현금성자산은 주주보고용 통합계정이다.",
        ),
        table(
          ["구분", "포함", "포함하지 않음"],
          [
            ["통화", "주화, 지폐", ""],
            [
              "통화대용증권",
              "타인발행수표, 자기앞수표, 가계수표, 송금수표, 우편환, 배당금통지표, 공사채만기이자표",
              "선일자수표, 우표, 차용증, 인지, 증지",
            ],
          ],
        ),
        list(
          "요구불예금(자유입출금예금): 당좌예금, 보통예금",
          "현금성자산은 큰 거래비용 없이 현금 전환이 용이해야 한다.",
          "이자율변동에 따른 가치변동 위험이 없거나 적어야 한다.",
          "취득 당시 만기 3개월 이내에 도래하는 정기예금, 정기적금, 양도성예금증서 등이다.",
        ),
        {
          type: "callout",
          tone: "warning",
          content: rich(
            "선일자수표는 형식은 수표이지만 실질은 어음이므로 발행일을 확인한다.",
          ),
        },
      ],
    },
    {
      id: "ch-04-t02",
      chapterId: "ch-04",
      order: 2,
      title: "당좌거래 개설과 기본 입출금",
      sourcePages: [13],
      updatedAt,
      blocks: [
        list(
          "은행과 당좌거래를 개설하고 계약을 체결하며 당좌거래개설보증금을 지급한다.",
          "당좌수표를 수령하고 보관한다.",
          "당좌예금에 입금한다.",
          "당좌예금 차변잔액을 한도로 당좌수표를 발행하므로 잔액을 확인한다.",
        ),
        {
          type: "callout",
          tone: "key",
          content: rich(
            "당좌차월은 당좌예금 차변잔액을 초과하여 수표발행을 허용하는 마이너스 통장이다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-04-t02-j01",
          sourcePages: [13],
          transaction: rich(
            "㈜그린은 신한은행 당좌예금에 현금 6,000,000원을 입금하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/09/13",
              debit: [{ account: "당좌예금", amount: 6000000 }],
              credit: [{ account: "현금", amount: 6000000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-04-t02-j02",
            sourcePages: [13],
            transaction: rich(
              "㈜그린은 신한은행과 당좌거래를 개설하고 당좌거래개설보증금 3,000,000원을 현금으로 지급하고 당좌차월 한도액을 5,000,000원으로 설정하였다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/08/13",
                debit: [{ account: "특정현금과예금", amount: 3000000 }],
                credit: [{ account: "현금", amount: 3000000 }],
              },
            ],
          },
          {
            id: "ch-04-t02-j03",
            sourcePages: [13],
            transaction: rich(
              "㈜그린은 ㈜미금으로부터 상품 4,000,000원을 매입하고 수표를 발행하여 지급하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/09/20",
                debit: [{ account: "상품", amount: 4000000 }],
                credit: [{ account: "당좌예금", amount: 4000000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-04-t03",
      chapterId: "ch-04",
      order: 3,
      title: "당좌차월의 기중 처리와 결산수정",
      sourcePages: [13, 14],
      updatedAt,
      blocks: [
        paragraph(
          "당좌예금 차변잔액을 초과한 수표발행은 당좌예금으로 일괄 처리하거나 당좌예금 잔액과 단기차입금을 구분하여 처리할 수 있다.",
        ),
        table(
          ["시점", "처리 원리"],
          [
            [
              "기중",
              "당좌예금 대변잔액 방식 또는 당좌예금 잔액과 단기차입금 구분 방식을 적용한다.",
            ],
            [
              "결산",
              "자산인 당좌예금의 대변잔액을 0으로 만들고 은행으로부터 1년간 차입한 단기차입금으로 보고한다.",
            ],
          ],
        ),
        {
          type: "callout",
          tone: "process",
          content: rich(
            "전산프로그램은 자산의 대변잔액을 차변의 음수로 표시하므로 결산 시 수정한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-04-t03-j01",
          sourcePages: [13],
          transaction: rich(
            "㈜그린은 ㈜서현으로부터 상품 5,000,000원을 매입하고 수표를 발행하여 지급하다.",
          ),
          presentation: "variants",
          variants: [
            {
              label: "(1) 당좌예금 일괄 처리",
              entries: [
                {
                  date: "26/10/20",
                  debit: [{ account: "상품", amount: 5000000 }],
                  credit: [{ account: "당좌예금", amount: 5000000 }],
                },
              ],
            },
            {
              label: "(2) 당좌예금·단기차입금 구분",
              entries: [
                {
                  date: "26/10/20",
                  debit: [{ account: "상품", amount: 5000000 }],
                  credit: [
                    { account: "당좌예금", amount: 2000000 },
                    {
                      account: "단기차입금",
                      counterparty: "신한",
                      amount: 3000000,
                    },
                  ],
                },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-04-t03-j02",
            sourcePages: [13],
            transaction: rich(
              "㈜그린은 ㈜야탑에 상품 1,000,000원을 매출하고 대금은 당좌예금으로 입금받다.",
            ),
            presentation: "variants",
            variants: [
              {
                label: "(1) 당좌예금 일괄 처리",
                entries: [
                  {
                    date: "26/11/20",
                    debit: [{ account: "당좌예금", amount: 1000000 }],
                    credit: [{ account: "상품매출", amount: 1000000 }],
                  },
                ],
              },
              {
                label: "(2) 단기차입금 감소 처리",
                entries: [
                  {
                    date: "26/11/20",
                    debit: [
                      {
                        account: "단기차입금",
                        counterparty: "신한",
                        amount: 1000000,
                      },
                    ],
                    credit: [{ account: "상품매출", amount: 1000000 }],
                  },
                ],
              },
            ],
          },
          {
            id: "ch-04-t03-j03",
            sourcePages: [13],
            transaction: rich(
              "㈜그린의 신한은행 당좌예금 잔액은 마이너스 2,000,000원이다. 기말 수정분개하시오.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [{ account: "당좌예금", amount: 2000000 }],
                credit: [
                  {
                    account: "단기차입금",
                    counterparty: "신한",
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
      id: "ch-04-t04",
      chapterId: "ch-04",
      order: 4,
      title: "현금 부족의 발생·원인판명·결산",
      sourcePages: [14, 15],
      updatedAt,
      blocks: [
        paragraph(
          "현금과부족은 장부상 현금과 실제 현금이 불일치하는 경우 사용하는 임시자산계정이며, 현금을 먼저 분개한다.",
        ),
        table(
          ["장부상현금", "실제현금", "현금상태", "최초 분개"],
          [
            [
              "100,000",
              "70,000",
              "현금 부족",
              "현금과부족 30,000 / 현금 30,000",
            ],
            [
              "100,000",
              "150,000",
              "현금 과다",
              "현금 50,000 / 현금과부족 50,000",
            ],
          ],
        ),
        list(
          "장부상현금을 실제현금에 맞추어 현금계정의 위치를 결정한다.",
          "반대쪽에 현금과부족 계정을 사용한다.",
          "원인이 밝혀지면 현금과부족 잔액을 소멸시키고 해당 원인계정으로 대체한다.",
          "결산일까지 원인이 밝혀지지 않으면 임시계정 불표시 원칙에 따라 잔액을 0으로 만든다.",
          "기중에 현금이 부족하면 현금과부족 차변잔액을 결산일에 잡손실로 처리한다.",
        ),
        {
          type: "callout",
          tone: "warning",
          content: rich(
            "실무에서는 장부상현금과 실제현금이 불일치해도 현금과부족 계정을 사용해서는 안 되며, 시험에서만 사용한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-04-t04-j01",
          sourcePages: [14],
          transaction: rich(
            "장부상현금 100,000원, 실제현금 70,000원으로 현금이 부족하다.",
          ),
          presentation: "entries",
          entries: [
            {
              debit: [{ account: "현금과부족", amount: 30000 }],
              credit: [{ account: "현금", amount: 30000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-04-t04-j02",
            sourcePages: [15],
            transaction: rich(
              "㈜그린의 장부상현금은 500,000원이고 실제현금은 240,000원이며 원인을 찾을 수 없다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/24",
                debit: [{ account: "현금과부족", amount: 260000 }],
                credit: [{ account: "현금", amount: 260000 }],
              },
            ],
          },
          {
            id: "ch-04-t04-j03",
            sourcePages: [15],
            transaction: rich(
              "지난 24일 현금과부족의 원인은 영업부 사무실 인터넷요금 240,000원을 현금 납부하고 회계처리를 누락한 것으로 확인되었다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/26",
                debit: [{ account: "통신비(판)", amount: 240000 }],
                credit: [{ account: "현금과부족", amount: 240000 }],
              },
            ],
          },
          {
            id: "ch-04-t04-j04",
            sourcePages: [15],
            transaction: rich(
              "결산일까지 현금과부족 차변잔액 20,000원의 원인을 알 수 없다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [{ account: "잡손실(영외비)", amount: 20000 }],
                credit: [{ account: "현금과부족", amount: 20000 }],
              },
            ],
          },
          {
            id: "ch-04-t04-j05",
            sourcePages: [15],
            transaction: rich(
              "㈜미금의 결산일 장부상현금은 130,000원, 실제현금은 118,000원이며 원인을 알 수 없다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                label: "현금 부족 발생",
                debit: [{ account: "현금과부족", amount: 12000 }],
                credit: [{ account: "현금", amount: 12000 }],
              },
              {
                date: "26/12/31",
                label: "결산 처리",
                debit: [{ account: "잡손실", amount: 12000 }],
                credit: [{ account: "현금과부족", amount: 12000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-04-t05",
      chapterId: "ch-04",
      order: 5,
      title: "현금 과다의 발생·원인판명·결산",
      sourcePages: [14, 15],
      updatedAt,
      correctionIds: ["correction-018"],
      blocks: [
        {
          type: "paragraph",
          content: [
            { text: "현금 과다", marks: ["bold", "highlight"] },
            {
              text: "는 장부상현금보다 실제현금이 많은 상태이다. 장부상 현금을 실제현금에 맞추기 위해 현금을 차변에 증가시키고 현금과부족을 대변에 기록한다.",
            },
          ],
        },
        list(
          "원인이 밝혀지면 현금과부족 대변잔액을 차변에서 소멸시키고 해당 원인계정으로 대체한다.",
          "결산일까지 원인이 밝혀지지 않으면 현금과부족 대변잔액을 잡이익으로 처리한다.",
        ),
        {
          type: "callout",
          tone: "warning",
          content: rich(
            "전산에서는 현금과부족 계정의 대변잔액을 차변의 음수잔액으로 표시한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-04-t05-j01",
          sourcePages: [14],
          transaction: rich(
            "장부상현금 100,000원, 실제현금 150,000원으로 현금이 과다하다.",
          ),
          presentation: "entries",
          entries: [
            {
              debit: [{ account: "현금", amount: 50000 }],
              credit: [{ account: "현금과부족", amount: 50000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-04-t05-j02",
            sourcePages: [15],
            transaction: rich(
              "㈜그린의 장부상현금은 500,000원이고 실제현금은 960,000원이며 원인을 알 수 없다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/24",
                debit: [{ account: "현금", amount: 460000 }],
                credit: [{ account: "현금과부족", amount: 460000 }],
              },
            ],
          },
          {
            id: "ch-04-t05-j03",
            sourcePages: [15],
            transaction: rich(
              "지난 24일 현금과부족의 원인은 매출거래처 ㈜서현으로부터 받은 계약금 450,000원의 회계처리가 누락된 것으로 확인되었다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/26",
                debit: [{ account: "현금과부족", amount: 450000 }],
                credit: [
                  {
                    account: "선수금",
                    counterparty: "서현",
                    amount: 450000,
                  },
                ],
              },
            ],
          },
          {
            id: "ch-04-t05-j04",
            sourcePages: [15],
            transaction: rich(
              "결산일까지 현금과부족 대변잔액 10,000원의 원인을 알 수 없다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                debit: [{ account: "현금과부족", amount: 10000 }],
                credit: [{ account: "잡이익(영외수)", amount: 10000 }],
              },
            ],
          },
          {
            id: "ch-04-t05-j05",
            sourcePages: [15],
            transaction: rich(
              "㈜미금의 결산일 장부상현금은 152,000원, 실제현금은 155,000원이며 원인을 알 수 없다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                label: "현금 과다 발생",
                debit: [{ account: "현금", amount: 3000 }],
                credit: [{ account: "현금과부족", amount: 3000 }],
              },
              {
                date: "26/12/31",
                label: "결산 처리",
                debit: [{ account: "현금과부족", amount: 3000 }],
                credit: [{ account: "잡이익", amount: 3000 }],
              },
            ],
          },
        ],
      },
    },
  ],
};
