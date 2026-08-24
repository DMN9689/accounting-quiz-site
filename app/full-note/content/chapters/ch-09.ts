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

export const chapter09: Chapter = {
  id: "ch-09",
  order: 9,
  title: "결산수정분개와 선급비용",
  sourcePages: [31, 32, 33, 34, 35, 36, 37],
  theories: [
    {
      id: "ch-09-t01",
      chapterId: "ch-09",
      order: 1,
      title: "결산수정분개 원리와 4개 계정",
      sourcePages: [31],
      updatedAt,
      blocks: [
        paragraph(
          "비용과 수익은 발생주의 회계처리 원칙에 따라 결산 시 수정하며 그 잔액을 차기로 이월하지 않는다. 손익계산서는 일정기간에 발생한 수익과 비용만 담는다.",
        ),
        {
          type: "callout",
          tone: "process",
          content: rich(
            "수정분개 원리: 당기에 회계처리한 수익과 비용 중 차기분 또는 전기분이 포함되어 있다면 이를 수정한다.",
          ),
        },
        table(
          ["계정과목", "소속(B/S)", "함축적 의미"],
          [
            ["선급비용", "자산(채권)", "비용의 이연"],
            ["선수수익", "부채(채무)", "수익의 이연"],
            ["미수수익", "자산(채권)", "수익의 발생"],
            ["미지급비용", "부채(채무)", "비용의 발생"],
          ],
        ),
      ],
    },
    {
      id: "ch-09-t02",
      chapterId: "ch-09",
      order: 2,
      title: "소모품비와 소모품",
      sourcePages: [31],
      updatedAt,
      blocks: [],
    },
    {
      id: "ch-09-t03",
      chapterId: "ch-09",
      order: 3,
      title: "자산과 부채의 유동성대체",
      sourcePages: [31],
      updatedAt,
      blocks: [],
    },
    {
      id: "ch-09-t04",
      chapterId: "ch-09",
      order: 4,
      title: "외화자산·외화부채 기말환율평가",
      sourcePages: [31],
      updatedAt,
      blocks: [],
    },
    {
      id: "ch-09-t05",
      chapterId: "ch-09",
      order: 5,
      title: "선급비용의 이연과 결산조정",
      sourcePages: [32, 33],
      updatedAt,
      blocks: [
        paragraph(
          "선급비용은 비용의 이연을 나타내는 자산·채권이다. 당기에 비용처리한 금액 중 차기분은 회수 가능한 자산이므로 선급비용을 만들어 차기로 이월한다.",
        ),
        table(
          ["기간", "보험료 구분", "금액"],
          [
            ["2026년", "경과보험료(경과비용)", "400,000"],
            ["2027년", "미경과보험료(회수 가능한 자산: 선급비용)", "800,000"],
          ],
        ),
        {
          type: "formula",
          content: rich(
            "1,800,000 × 10개월(미경과) / 12 = 1,500,000, 1,800,000 × 2개월(경과) / 12 = 300,000",
          ),
        },
        {
          type: "callout",
          tone: "key",
          content: rich(
            "비용은 이월하지 않고 같은 차변에 위치한 자산을 만들어 이월한다.",
          ),
        },
      ],
      journal: {
        representative: {
          id: "ch-09-t05-j01",
          sourcePages: [32],
          transaction: rich(
            "본사건물 화재보험료 1,200,000원 중 차기분 보험료 800,000원을 선급비용으로 이연하다.",
          ),
          presentation: "entries",
          entries: [
            {
              date: "26/12/31",
              debit: [
                {
                  account: "선급비용",
                  counterparty: "보험사",
                  amount: 800000,
                },
              ],
              credit: [{ account: "보험료(판)", amount: 800000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-09-t05-j02",
            sourcePages: [32],
            transaction: rich(
              "본사건물 화재보험료 1,200,000원(1년분)을 현금으로 지급하고 전액 비용처리하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "26/09/01",
                debit: [{ account: "보험료(판)", amount: 1200000 }],
                credit: [{ account: "현금", amount: 1200000 }],
              },
            ],
          },
          {
            id: "ch-09-t05-j03",
            sourcePages: [32],
            transaction: rich(
              "보험계약이 만료되어 전기에 이월한 선급비용 800,000원을 당기 보험료로 처리하다.",
            ),
            presentation: "entries",
            entries: [
              {
                date: "27/08/31",
                debit: [{ account: "보험료(판)", amount: 800000 }],
                credit: [
                  {
                    account: "선급비용",
                    counterparty: "보험사",
                    amount: 800000,
                  },
                ],
              },
            ],
          },
          {
            id: "ch-09-t05-j04",
            sourcePages: [32],
            transaction: rich(
              "㈜그린은 공장 화물트럭 보험료 1,800,000원(1년분)을 현대해상에 현금으로 지급하다.",
            ),
            presentation: "variants",
            variants: [
              {
                label: "전액 비용처리",
                entries: [
                  {
                    date: "26/11/01",
                    debit: [{ account: "보험료(제)", amount: 1800000 }],
                    credit: [{ account: "현금", amount: 1800000 }],
                  },
                ],
              },
              {
                label: "전액 자산처리",
                entries: [
                  {
                    date: "26/11/01",
                    debit: [
                      {
                        account: "선급비용",
                        counterparty: "현대",
                        amount: 1800000,
                      },
                    ],
                    credit: [{ account: "현금", amount: 1800000 }],
                  },
                ],
              },
            ],
          },
          {
            id: "ch-09-t05-j05",
            sourcePages: [32],
            transaction: rich(
              "공장 화물트럭 보험료의 결산수정분개를 월할계산하다.",
            ),
            presentation: "variants",
            variants: [
              {
                label: "지급 시 전액 비용처리한 경우",
                entries: [
                  {
                    date: "26/12/31",
                    debit: [
                      {
                        account: "선급비용",
                        counterparty: "현대",
                        amount: 1500000,
                      },
                    ],
                    credit: [{ account: "보험료(제)", amount: 1500000 }],
                  },
                ],
              },
              {
                label: "지급 시 전액 자산처리한 경우",
                entries: [
                  {
                    date: "26/12/31",
                    debit: [{ account: "보험료(제)", amount: 300000 }],
                    credit: [
                      {
                        account: "선급비용",
                        counterparty: "현대",
                        amount: 300000,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        
      {
        id: "ch-09-t05-j06",
        sourcePages: [33],
        transaction: [
          {
            text: "본사 고객대기실용 패션잡지의 1년분 구독료 6,000,000원을 26/05/01에 지급하고 전액 비용처리하였다. 구독기간은 26/05/01~27/04/30이다.",
          },
        ],
        note: [
          { text: "당기분 4,000,000원, 차기분 2,000,000원" },
        ],
        presentation: "entries",
        entries: [
          {
            date: "26/05/01",
            label: "구독료 지급",
            debit: [{ account: "도서인쇄비(판)", amount: 6000000 }],
            credit: [{ account: "현금", amount: 6000000 }],
          },
          {
            date: "26/12/31",
            label: "결산수정",
            debit: [
              { account: "선급비용", counterparty: "미금", amount: 2000000 },
            ],
            credit: [{ account: "도서인쇄비(판)", amount: 2000000 }],
          },
        ],
      },
      {
        id: "ch-09-t05-j07",
        sourcePages: [33],
        transaction: [
          {
            text: "본사 전산실 통신장비의 유지보수료 9,000,000원을 26/09/01에 지급하고 전액 자산처리하였다. 계약기간은 26/09/01~27/02/28이다.",
          },
        ],
        note: [
          {
            text: "차기분: 9,000,000 × 2개월(미경과) / 6개월 = 3,000,000",
            marks: ["highlight"],
          },
        ],
        presentation: "entries",
        entries: [
          {
            date: "26/09/01",
            label: "유지보수료 지급",
            debit: [
              { account: "선급비용", counterparty: "죽전", amount: 9000000 },
            ],
            credit: [{ account: "현금", amount: 9000000 }],
          },
          {
            date: "26/12/31",
            label: "결산수정",
            debit: [{ account: "수선비(판)", amount: 6000000 }],
            credit: [
              { account: "선급비용", counterparty: "죽전", amount: 6000000 },
            ],
          },
        ],
      },
      {
        id: "ch-09-t05-j08",
        sourcePages: [33],
        transaction: [
          {
            text: "본사 사옥건물 화재보험의 결산일 현재 미경과보험료는 820,000원이다.",
          },
        ],
        note: [
          { text: "보험료 지급 시 원문 형식: 보험료(판) XXX / 현금 XXX" },
        ],
        presentation: "entries",
        entries: [
          {
            date: "26/12/31",
            label: "결산수정",
            debit: [
              { account: "선급비용", counterparty: "삼성", amount: 820000 },
            ],
            credit: [{ account: "보험료(판)", amount: 820000 }],
          },
        ],
      },
      {
        id: "ch-09-t05-j09",
        sourcePages: [33],
        transaction: [
          {
            text: "판촉용 우산 제작비 12,000,000원을 26/12/15에 지급하고 전액 비용처리하였다. 기말에 사용하지 않은 우산 3,600,000원이 남아 있다.",
          },
        ],
        presentation: "entries",
        entries: [
          {
            date: "26/12/15",
            label: "우산 제작비 지급",
            debit: [{ account: "광고선전비", amount: 12000000 }],
            credit: [{ account: "현금", amount: 12000000 }],
          },
          {
            date: "26/12/31",
            label: "결산수정",
            debit: [
              { account: "선급비용", counterparty: "판촉", amount: 3600000 },
            ],
            credit: [{ account: "광고선전비", amount: 3600000 }],
          },
        ],
      },
      {
        id: "ch-09-t05-j10",
        sourcePages: [33],
        transaction: [
          {
            text: "서현빌딩 사무실의 2년분 임차료 24,000,000원을 26/04/01에 지급하고 전액 비용처리하였다. 계약기간은 26/04/01~28/03/31이다.",
          },
        ],
        note: [
          { text: "26년 9,000,000원 / 27년 12,000,000원 / 28년 3,000,000원" },
        ],
        presentation: "entries",
        entries: [
          {
            date: "26/04/01",
            label: "2년분 임차료 지급",
            debit: [{ account: "임차료(판)", amount: 24000000 }],
            credit: [{ account: "현금", amount: 24000000 }],
          },
          {
            date: "26/12/31",
            label: "결산수정",
            debit: [
              { account: "선급비용", counterparty: "서현", amount: 15000000 },
            ],
            credit: [{ account: "임차료(판)", amount: 15000000 }],
          },
          {
            date: "27/12/31",
            label: "차기 비용처리",
            debit: [{ account: "임차료(판)", amount: 12000000 }],
            credit: [
              { account: "선급비용", counterparty: "서현", amount: 12000000 },
            ],
          },
          {
            date: "28/03/31",
            label: "계약 종료 시 비용처리",
            debit: [{ account: "임차료(판)", amount: 3000000 }],
            credit: [
              { account: "선급비용", counterparty: "서현", amount: 3000000 },
            ],
          },
        ],
      },
      {
        id: "ch-09-t05-j11",
        sourcePages: [33],
        transaction: [
          {
            text: "공장 창고건물의 1년분 화재보험료 12,000,000원을 26/03/01에 지급하고 전액 비용처리하였다. 보험기간은 26/03/01~27/02/28이다.",
          },
        ],
        note: [{ text: "당기분 10,000,000원, 차기분 2,000,000원" }],
        presentation: "entries",
        entries: [
          {
            date: "26/03/01",
            label: "보험료 지급",
            debit: [{ account: "보험료(제)", amount: 12000000 }],
            credit: [{ account: "현금", amount: 12000000 }],
          },
          {
            date: "26/12/31",
            label: "결산수정",
            debit: [{ account: "선급비용", amount: 2000000 }],
            credit: [{ account: "보험료(제)", amount: 2000000 }],
          },
        ],
      },
],
      },
    },
  
    {
      id: "ch-09-t06",
      chapterId: "ch-09",
      order: 6,
      title: "선수수익의 이연과 결산조정",
      sourcePages: [34, 35],
      updatedAt: "2026-08-24",
      blocks: [
        {
          type: "paragraph",
          content: [
            { text: "선수수익", marks: ["account", "bold"] },
            { text: "은 당기에 수익처리한 금액 중 다음 기간의 수익을 이월할 때 사용하는 " },
            { text: "부채계정", marks: ["highlight"] },
            { text: "이다." },
          ],
        },
        {
          type: "formula",
          content: [
            { text: "차기분 선수수익 = 임대료 수령금액 × 미경과기간 / 전체기간", marks: ["highlight"] },
          ],
        },
        {
          type: "paragraph",
          content: [
            { text: "선급비용", marks: ["account"] },
            { text: "은 비용의 이연, " },
            { text: "선수수익", marks: ["account"] },
            { text: "은 수익의 이연이다." },
          ],
        },
      ],
      journal: {
        representative: {
          id: "ch-09-t06-j01",
          sourcePages: [34],
          transaction: [
            {
              text: "본사 건물 1층을 편의점에 임대하고 26/10/01에 1년분 임대료 1,200,000원을 선불로 받았다.",
            },
          ],
          note: [
            { text: "당기수익 300,000원, 차기분 수익 900,000원" },
          ],
          presentation: "entries",
          entries: [
            {
              date: "26/10/01",
              label: "임대료 수령",
              debit: [{ account: "현금", amount: 1200000 }],
              credit: [{ account: "임대료", amount: 1200000 }],
            },
            {
              date: "26/12/31",
              label: "결산수정",
              debit: [{ account: "임대료", amount: 900000 }],
              credit: [
                { account: "선수수익", counterparty: "임차인", amount: 900000 },
              ],
            },
            {
              date: "27/09/30",
              label: "차기 수익처리",
              debit: [
                { account: "선수수익", counterparty: "임차인", amount: 900000 },
              ],
              credit: [{ account: "임대료", amount: 900000 }],
            },
          ],
        },
        extras: [
          {
            id: "ch-09-t06-j02",
            sourcePages: [34],
            transaction: [
              {
                text: "미금과 사무실 임대차계약을 체결하고 26/03/01에 1년분 임대료 6,000,000원을 전액 현금으로 받았다.",
              },
            ],
            presentation: "variants",
            variants: [
              {
                label: "전액 수익처리",
                entries: [
                  {
                    date: "26/03/01",
                    label: "임대료 수령",
                    debit: [{ account: "현금", amount: 6000000 }],
                    credit: [{ account: "임대료", amount: 6000000 }],
                  },
                  {
                    date: "26/12/31",
                    label: "결산수정",
                    debit: [{ account: "임대료", amount: 1000000 }],
                    credit: [
                      { account: "선수수익", counterparty: "미금", amount: 1000000 },
                    ],
                  },
                  {
                    date: "27/02/28",
                    label: "차기 수익처리",
                    debit: [
                      { account: "선수수익", counterparty: "미금", amount: 1000000 },
                    ],
                    credit: [{ account: "임대료", amount: 1000000 }],
                  },
                ],
              },
              {
                label: "전액 부채처리",
                entries: [
                  {
                    date: "26/03/01",
                    label: "임대료 수령",
                    debit: [{ account: "현금", amount: 6000000 }],
                    credit: [
                      { account: "선수수익", counterparty: "미금", amount: 6000000 },
                    ],
                  },
                  {
                    date: "26/12/31",
                    label: "결산수정",
                    debit: [
                      { account: "선수수익", counterparty: "미금", amount: 5000000 },
                    ],
                    credit: [{ account: "임대료", amount: 5000000 }],
                  },
                  {
                    date: "27/02/28",
                    label: "차기 수익처리",
                    debit: [
                      { account: "선수수익", counterparty: "미금", amount: 1000000 },
                    ],
                    credit: [{ account: "임대료", amount: 1000000 }],
                  },
                ],
              },
              {
                label: "실무 일할계산",
                entries: [
                  {
                    date: "26/03/01",
                    label: "임대료 수령",
                    debit: [{ account: "현금", amount: 6000000 }],
                    credit: [
                      { account: "임대료", amount: 5000000 },
                      { account: "선수수익", amount: 1000000 },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "ch-09-t06-j03",
            sourcePages: [35],
            transaction: [
              {
                text: "㈜서현에 100,000,000원을 26/05/01~27/04/30 동안 연 6%로 대여하고 1년분 이자 6,000,000원을 대여일에 선취해 전액 수익처리하였다.",
              },
            ],
            presentation: "entries",
            entries: [
              {
                date: "26/05/01",
                label: "선이자 수령",
                debit: [{ account: "현금", amount: 6000000 }],
                credit: [{ account: "이자수익", amount: 6000000 }],
              },
              {
                date: "26/12/31",
                label: "결산수정",
                debit: [{ account: "이자수익", amount: 2000000 }],
                credit: [
                  { account: "선수수익", counterparty: "서현", amount: 2000000 },
                ],
              },
            ],
          },
          {
            id: "ch-09-t06-j04",
            sourcePages: [35],
            transaction: [
              {
                text: "㈜죽전과 사무실 임대차계약을 체결하고 26/09/01에 1년분 임대료 24,000,000원을 전액 현금으로 미리 받아 부채처리하였다. 계약기간은 26/09/01~27/08/31이다.",
              },
            ],
            presentation: "entries",
            entries: [
              {
                date: "26/09/01",
                label: "임대료 수령",
                debit: [{ account: "현금", amount: 24000000 }],
                credit: [
                  { account: "선수수익", counterparty: "죽전", amount: 24000000 },
                ],
              },
              {
                date: "26/12/31",
                label: "결산수정",
                debit: [
                  { account: "선수수익", counterparty: "죽전", amount: 8000000 },
                ],
                credit: [{ account: "임대료", amount: 8000000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-09-t07",
      chapterId: "ch-09",
      order: 7,
      title: "미수수익의 발생과 결산조정",
      sourcePages: [36],
      updatedAt: "2026-08-24",
      blocks: [
        {
          type: "paragraph",
          content: [
            { text: "미수수익", marks: ["account", "bold"] },
            { text: "은 당기에 발생한 수익을 차기에 수령하는 경우 사용하는 " },
            { text: "자산·채권 계정", marks: ["highlight"] },
            { text: "이다." },
          ],
        },
        {
          type: "callout",
          tone: "key",
          content: [
            { text: "당기 발생 수익은 대변에 수익처리하고 차변에 미수수익을 기록한다." },
          ],
        },
        {
          type: "paragraph",
          content: [
            { text: "실무에서는 결산 체크리스트에 미수이자 내역을 작성한다." },
          ],
        },
      ],
      journal: {
        representative: {
          id: "ch-09-t07-j01",
          sourcePages: [36],
          transaction: [
            {
              text: "26/09/01에 국민은행 1년 만기 정기예금에 가입했고, 만기이자 1,200,000원 중 당기 발생이자는 400,000원이다.",
            },
          ],
          note: [
            { text: "당기 발생이자 400,000원, 27년 미경과이자 800,000원" },
          ],
          presentation: "entries",
          entries: [
            {
              date: "26/12/31",
              label: "결산수정",
              debit: [
                { account: "미수수익", counterparty: "국민", amount: 400000 },
              ],
              credit: [{ account: "이자수익", amount: 400000 }],
            },
            {
              date: "27/08/31",
              label: "이자 수령",
              debit: [{ account: "보통예금", amount: 1200000 }],
              credit: [
                { account: "이자수익", amount: 800000 },
                { account: "미수수익", counterparty: "국민", amount: 400000 },
              ],
            },
          ],
        },
        extras: [
          {
            id: "ch-09-t07-j02",
            sourcePages: [36],
            transaction: [
              {
                text: "㈜죽전과 사무실 임대차계약을 체결하고 12월분 임대료 3,000,000원을 다음 해 01/10에 받기로 약정하였다.",
              },
            ],
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                label: "결산수정",
                debit: [
                  { account: "미수수익", counterparty: "죽전", amount: 3000000 },
                ],
                credit: [{ account: "임대료", amount: 3000000 }],
              },
              {
                date: "27/01/10",
                label: "임대료 회수",
                debit: [{ account: "보통예금", amount: 3000000 }],
                credit: [
                  { account: "미수수익", counterparty: "죽전", amount: 3000000 },
                ],
              },
            ],
          },
          {
            id: "ch-09-t07-j03",
            sourcePages: [36],
            transaction: [
              {
                text: "신한은행 1년 만기 정기예금 200,000,000원의 연이자율은 6%이며, 예치기간은 26/05/01~27/04/30이다.",
              },
            ],
            note: [
              {
                text: "27/04/30 만기분개의 선납세금은 원문에 XXX로 제시되어 완성 분개에 포함하지 않는다.",
              },
            ],
            presentation: "entries",
            entries: [
              {
                date: "26/12/31",
                label: "결산수정",
                debit: [
                  { account: "미수수익", counterparty: "신한", amount: 8000000 },
                ],
                credit: [{ account: "이자수익", amount: 8000000 }],
              },
            ],
          },
        ],
      },
    },
    {
      id: "ch-09-t08",
      chapterId: "ch-09",
      order: 8,
      title: "미지급비용의 발생과 결산조정",
      sourcePages: [37],
      updatedAt: "2026-08-24",
      blocks: [
        {
          type: "paragraph",
          content: [
            { text: "미지급비용", marks: ["account", "bold"] },
            { text: "은 당기에 발생한 비용을 차기에 지급하는 경우 사용하는 " },
            { text: "부채·채무 계정", marks: ["highlight"] },
            { text: "이다." },
          ],
        },
        {
          type: "callout",
          tone: "key",
          content: [
            { text: "당기 발생 비용은 차변에 비용처리하고 대변에 미지급비용을 기록한다." },
          ],
        },
      ],
      journal: {
        representative: {
          id: "ch-09-t08-j01",
          sourcePages: [37],
          transaction: [
            {
              text: "12월분 본사 임직원 급여 580,000,000원이 발생했고 다음 해 01/10에 지급한다.",
            },
          ],
          presentation: "entries",
          entries: [
            {
              date: "26/12/31",
              label: "결산수정",
              debit: [{ account: "급여", amount: 580000000 }],
              credit: [{ account: "미지급비용", amount: 580000000 }],
            },
            {
              date: "27/01/10",
              label: "급여 지급",
              debit: [{ account: "미지급비용", amount: 580000000 }],
              credit: [{ account: "보통예금", amount: 580000000 }],
            },
          ],
        },
        extras: [],
      },
    },
],
};
