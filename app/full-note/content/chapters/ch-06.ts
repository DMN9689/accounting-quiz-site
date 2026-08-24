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

export const chapter06: Chapter = {
  id: "ch-06",
  order: 6,
  title: "채권·채무와 어음",
  sourcePages: [20, 21],
  theories: [
    {
      id: "ch-06-t01",
      chapterId: "ch-06",
      order: 1,
      title: "채권·채무 계정과목 구조",
      sourcePages: [20],
      updatedAt,
      blocks: [
        paragraph(
          "채권은 받을 권리, 채무는 갚을 의무이며, 원문에 열거된 채권·채무 계정과목에는 반드시 거래처를 기입한다.",
        ),
        table(
          ["채권(자산)", "특징", "채무(부채)"],
          [
            [
              "외상매출금·받을어음(매출채권)",
              "상거래에서 사용: 상품매출·제품매출, 상품·원재료 매입",
              "외상매입금·지급어음(매입채무)",
            ],
            [
              "미수금",
              "상거래가 아닌 거래에서 사용: 복리후생비·비품 등의 처분·매각 또는 취득·구입",
              "미지급금",
            ],
            ["선급금", "미리 지급·수령", "선수금"],
            ["단기대여금·장기대여금", "자금 대여·차입", "단기차입금·장기차입금"],
            ["임차보증금", "보증금", "임대보증금"],
            ["가지급금", "임시계정", "가수금"],
            ["선급비용·미수수익", "결산 관련 채권·채무", "선수수익·미지급비용"],
          ],
        ),
      ],
    },
    {
      id: "ch-06-t02",
      chapterId: "ch-06",
      order: 2,
      title: "어음 프로세스와 계정 선택 주의점",
      sourcePages: [20],
      updatedAt,
      correctionIds: ["correction-008"],
      blocks: [
        paragraph(
          "어음은 만기일에 지급하겠다고 약속한 증서이며, 종이어음인 약속어음과 B2B 전자어음의 회계처리는 같다.",
        ),
        list(
          "지급어음 프로세스: 주거래은행에서 어음 수령 → 전산에 어음번호 등 등록 → 등록된 어음 발행 및 만기일 등 추가정보 입력 → 만기일에 결제",
          "받을어음 프로세스: 거래처에서 어음 수령 → 자수어음·타수어음을 구분해 전산 입력 → 만기일에 할인·배서·추심·부도·부분할인 등의 어음정보를 불러와 추심",
          "받을어음의 거래처는 발행처이다.",
          "상거래 어음은 받을어음·지급어음, 상거래가 아닌 어음은 미수금·미지급금으로 처리한다.",
        ),
      ],
    },
    {
      id: "ch-06-t03",
      chapterId: "ch-06",
      order: 3,
      title: "어음의 배서양도",
      sourcePages: [20],
      updatedAt,
      correctionIds: ["correction-009", "correction-010"],
      blocks: [
        paragraph(
          "배서양도는 보유 중인 받을어음을 만기일 전에 어음상의 권리와 함께 타인에게 양도하는 것이다.",
        ),
        {
          type: "callout",
          tone: "process",
          content: rich(
            "배서는 어음 뒷면에 회사정보를 기입하고 날인한다. 전자어음만 배서가 20회로 제한된다.",
          ),
        },
        paragraph(
          "자수어음은 배서인이 없는 어음이고 타수어음은 배서인이 있는 어음이다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-06-t03-j01",
          sourcePages: [20],
          transaction: rich(
            "㈜그린은 ㈜미금으로부터 상품 50,000,000원을 매입하고 지난달 상품매출시 받은 ㈜서현 발행 약속어음을 배서양도하여 지급하다.",
          ),
          note: rich(
            "지난달 처리: 받을어음(서현) 50,000,000 / 상품매출 50,000,000",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/18",
              debit: [{ account: "상품", amount: 50000000 }],
              credit: [
                {
                  account: "받을어음",
                  counterparty: "서현",
                  amount: 50000000,
                },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-06-t03-j02",
            sourcePages: [20],
            transaction: rich(
              "㈜그린은 ㈜야탑에 상품 30,000,000원을 매출하고 ㈜야탑이 보관 중인 ㈜정자 발행 약속어음을 배서양도받다.",
            ),
            note: rich(
              "시험상 받을어음 거래처는 발행처 정자이며, 실무 거래처는 배서인 야탑으로 등록한다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/08/18",
                debit: [
                  {
                    account: "받을어음",
                    counterparty: "정자",
                    amount: 30000000,
                  },
                ],
                credit: [{ account: "상품매출", amount: 30000000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-06-t04",
      chapterId: "ch-06",
      order: 4,
      title: "비상거래 어음의 미수금·미지급금 처리",
      sourcePages: [20, 21],
      updatedAt,
      blocks: [
        paragraph(
          "상거래가 아닌 토지 취득·처분에서 발행하거나 받은 약속어음은 미지급금·미수금으로 처리한다.",
        ),
        {
          type: "callout",
          tone: "warning",
          content: rich(
            "실무에서는 상거래 어음과 비상거래 어음을 구분하지 않고 받을어음·지급어음을 사용한 뒤 결산 시 수정분개한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-06-t04-j01",
          sourcePages: [20],
          transaction: rich(
            "㈜그린은 공장부지용 토지를 ㈜서현으로부터 800,000,000원에 취득하고 취득세·등록세 40,000,000원과 중개수수료 5,000,000원을 보통예금으로 지급하며 토지대금은 3개월 만기 약속어음으로 지급하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/18",
              debit: [{ account: "토지", amount: 845000000 }],
              credit: [
                { account: "보통예금", amount: 45000000 },
                {
                  account: "미지급금",
                  counterparty: "서현",
                  amount: 800000000,
                },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-06-t04-j02",
            sourcePages: [21],
            transaction: rich(
              "㈜그린은 장부가액 500,000,000원인 영업용 토지를 ㈜미금에 570,000,000원에 처분하고 ㈜미금 발행 약속어음으로 받다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/08/18",
                debit: [
                  {
                    account: "미수금",
                    counterparty: "미금",
                    amount: 570000000,
                  },
                ],
                credit: [
                  { account: "토지", amount: 500000000 },
                  { account: "유형자산처분이익(영외수)", amount: 70000000 },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-06-t05",
      chapterId: "ch-06",
      order: 5,
      title: "어음 할인",
      sourcePages: [21],
      updatedAt,
      blocks: [
        paragraph(
          "어음 할인은 보유 중인 받을어음을 만기일 전에 금융기관에 매각하여 자금을 확보하는 어음의 매각거래이다.",
        ),
        {
          type: "callout",
          tone: "key",
          content: rich(
            "기업이 부담하는 할인료(이자)와 수수료는 매출채권처분손실(영외비)로 처리한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-06-t05-j01",
          sourcePages: [21],
          transaction: rich(
            "㈜그린은 ㈜서현 발행 약속어음 100,000,000원을 신한은행에 매각하고 할인료 800,000원과 수수료 500,000원을 차감한 잔액을 보통예금으로 받다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/18",
              debit: [
                { account: "보통예금", amount: 98700000 },
                { account: "매출채권처분손실(영외비)", amount: 1300000 },
              ],
              credit: [
                {
                  account: "받을어음",
                  counterparty: "서현",
                  amount: 100000000,
                },
              ],
            },
          ],
        },
        extras: [],
      },
    },
    {
      id: "ch-06-t06",
      chapterId: "ch-06",
      order: 6,
      title: "어음 만기추심",
      sourcePages: [21],
      updatedAt,
      blocks: [
        paragraph(
          "어음 만기추심은 받을어음이 만기되어 주거래은행에 어음상의 금액을 회수해 달라고 의뢰하는 것이다.",
        ),
        {
          type: "callout",
          tone: "key",
          content: rich(
            "금융기관이 추심을 대행하고 받는 수수료는 수수료비용(판매와관리비)으로 처리한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-06-t06-j01",
          sourcePages: [21],
          transaction: rich(
            "㈜그린은 만기된 ㈜서현 발행 약속어음 100,000,000원을 신한은행에 추심의뢰하고 수수료 300,000원을 차감한 잔액을 보통예금으로 받다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/18",
              debit: [
                { account: "보통예금", amount: 99700000 },
                { account: "수수료비용(판)", amount: 300000 },
              ],
              credit: [
                {
                  account: "받을어음",
                  counterparty: "서현",
                  amount: 100000000,
                },
              ],
            },
          ],
        },
        extras: [],
      },
    },
    {
      id: "ch-06-t07",
      chapterId: "ch-06",
      order: 7,
      title: "어음 부도",
      sourcePages: [21],
      updatedAt,
      blocks: [
        paragraph(
          "어음의 부도는 받을어음을 추심의뢰했으나 어음발행처의 잔고 부족으로 지급거절된 경우이다.",
        ),
        list(
          "지급거절작성비에는 법무사수수료, 법원 수수료, 인지세, 공증비용 등이 있다.",
          "부도어음과수표에는 법정이자 등 청구비용을 포함한다.",
        ),
      ],
      journal: {
        representative: {
          id: "ch-06-t07-j01",
          sourcePages: [21],
          transaction: rich(
            "㈜그린은 ㈜서현 발행 약속어음 100,000,000원의 부도 통지를 받고 지급거절작성비 1,000,000원을 현금으로 지급하여 부도처리하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/20",
              debit: [
                {
                  account: "부도어음과수표",
                  counterparty: "서현",
                  amount: 101000000,
                },
              ],
              credit: [
                {
                  account: "받을어음",
                  counterparty: "서현",
                  amount: 100000000,
                },
                { account: "현금", amount: 1000000 },
              ],
            },
          ],
        },
        extras: [],
      },
    },
    {
      id: "ch-06-t08",
      chapterId: "ch-06",
      order: 8,
      title: "어음 차입거래",
      sourcePages: [21],
      updatedAt,
      blocks: [
        paragraph(
          "어음 차입거래는 어음을 발행하여 담보로 제공하고 자금을 차입하거나 대여하는 거래이다.",
        ),
        table(
          ["관점", "원금", "실제 자금", "선이자"],
          [
            ["채권자 ㈜미금", "단기대여금 500,000", "보통예금 490,000", "이자수익 10,000"],
            ["채무자 ㈜그린", "단기차입금 500,000", "보통예금 490,000", "이자비용 10,000"],
          ],
        ),
      ],
      journal: {
        representative: {
          id: "ch-06-t08-j01",
          sourcePages: [21],
          transaction: rich(
            "㈜그린은 ㈜미금에 약속어음 500,000원을 담보로 제공하고 선이자 10,000원을 차감한 잔액을 보통예금으로 받다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/08/19",
              debit: [
                { account: "보통예금", amount: 490000 },
                { account: "이자비용", amount: 10000 },
              ],
              credit: [
                {
                  account: "단기차입금",
                  counterparty: "미금",
                  amount: 500000,
                },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-06-t08-j02",
            sourcePages: [21],
            transaction: rich(
              "㈜미금은 ㈜그린의 약속어음 500,000원을 담보로 받고 선이자 10,000원을 차감한 잔액을 보통예금으로 대여하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/08/19",
                debit: [
                  {
                    account: "단기대여금",
                    counterparty: "그린",
                    amount: 500000,
                  },
                ],
                credit: [
                  { account: "보통예금", amount: 490000 },
                  { account: "이자수익", amount: 10000 },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};
