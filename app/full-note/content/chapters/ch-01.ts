import type { Chapter, JournalExample, RichText } from "../../types/content";

type SimpleJournalInput = {
  id: string;
  page: 3 | 4;
  transaction: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  note: RichText;
};

function createSimpleJournal({
  id,
  page,
  transaction,
  debitAccount,
  creditAccount,
  amount,
  note,
}: SimpleJournalInput): JournalExample {
  return {
    id,
    sourcePages: [page],
    transaction: [{ text: transaction }],
    note,
    presentation: "entries",
    entries: [
      {
        date: "26/08/05",
        debit: [{ account: debitAccount, amount }],
        credit: [{ account: creditAccount, amount }],
      },
    ],
  };
}

const assetIncreaseAndDecrease: RichText = [
  { text: "자산증", marks: ["account"] },
  { text: " / " },
  { text: "자산감", marks: ["account"] },
];

const expenseAndAssetDecrease: RichText = [
  { text: "비용발", marks: ["account"] },
  { text: " / " },
  { text: "자산감", marks: ["account"] },
];

export const chapter01: Chapter = {
  id: "ch-01",
  order: 1,
  title: "회계 기초와 분개 원리",
  sourcePages: [2, 3, 4],
  theories: [
    {
      id: "ch-01-t01",
      chapterId: "ch-01",
      order: 1,
      title: "회계·정보이용자와 재무제표",
      sourcePages: [2],
      updatedAt: "2026.08.23",
      blocks: [
        {
          type: "paragraph",
          content: [
            { text: "회계: " },
            {
              text: "경제적 의사결정에 유용한 정보를 정보이용자에게 전달하는 과정",
              marks: ["bold"],
            },
          ],
        },
        {
          type: "paragraph",
          content: [{ text: "기업(목적: 돈벌려고) -> 궁금?(정보이용자, 이해관계자)" }],
        },
        {
          type: "list",
          items: [
            [
              { text: "외부정보이용자(외부이해관계자)", marks: ["account"] },
              { text: ": 주주(투자자), 채권자(은행), 정부(국세청, 지자체)" },
            ],
            [
              { text: "재무회계", marks: ["account"] },
              {
                text: ": 외부보고목적, 일정한 기준이 있다(일반기업회계기준), 객관적, 일정한 형식을 갖춘 보고서(재무제표), 법적인 구속력이 있다. 과거지향적",
              },
            ],
            [
              { text: "내부정보이용자(내부이해관계자)", marks: ["account"] },
              { text: ": 사장님(경영자), 종업원(임직원), 노조" },
            ],
            [
              { text: "관리회계(의사결정회계)", marks: ["account"] },
              {
                text: ": 내부보고목적, 일정한 기준이 없다, 주관적, 목적에 맞는 특수보고서, 법적인 구속력이 없다(디지게 혼난다). 미래지향적",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          content: [
            { text: "재무제표", marks: ["account"] },
            {
              text: ": 정보이용자에게 회계정보를 전달할 때 사용하는 보고서",
              marks: ["bold"],
            },
          ],
        },
        {
          type: "list",
          items: [
            [
              { text: "재무상태표", marks: ["account"] },
              { text: ", " },
              { text: "손익계산서", marks: ["account"] },
              { text: ", " },
              { text: "현금흐름표", marks: ["account"] },
              { text: ", " },
              { text: "자본변동표", marks: ["account"] },
              { text: ", " },
              { text: "주석", marks: ["account"] },
            ],
          ],
        },
      ],
    },
    {
      id: "ch-01-t02",
      chapterId: "ch-01",
      order: 2,
      title: "회계순환과 재무상태표·손익계산서 기초",
      sourcePages: [2],
      updatedAt: "2026.08.23",
      blocks: [
        {
          type: "formula",
          content: [
            {
              text: "회계상 거래 -> 분개(분개장) -> 전기(총계정원장, 원장) -> 결산",
              marks: ["highlight"],
            },
          ],
        },
        {
          type: "table",
          caption: [{ text: "재무상태표(B/S)" }],
          columnCount: 2,
          rows: [
            [
              { content: [{ text: "차변" }], header: true, scope: "col" },
              { content: [{ text: "대변" }], header: true, scope: "col" },
            ],
            [
              {
                content: [
                  { text: "자산(내꺼) 60,000", marks: ["account"] },
                  { text: ", 받을권리" },
                ],
              },
              {
                content: [
                  { text: "부채(남의꺼) 50,000", marks: ["account"] },
                  { text: ", " },
                  { text: "자본(진짜내꺼) 10,000", marks: ["account"] },
                ],
              },
            ],
          ],
        },
        {
          type: "list",
          items: [
            [
              { text: "재무상태표", marks: ["account"] },
              { text: ": 일정시점의 재무상태(재산상태), 결산일(12/31)" },
            ],
            [
              { text: "재무상태표 등식: " },
              { text: "자산 = 부채 + 자본", marks: ["highlight"] },
            ],
            [{ text: "자산과 부채는 영원하지 않다." }],
            [{ text: "자본은 종속변수(자산과 부채에 종속되어 있다)." }],
            [
              {
                text: "자산, 부채, 자본의 기말잔액(12/31)은 차기로 이월된다(전기기말잔액 = 당기기초잔액).",
                marks: ["bold"],
              },
            ],
          ],
        },
        {
          type: "table",
          caption: [{ text: "손익계산서(I/S)" }],
          columnCount: 2,
          rows: [
            [
              { content: [{ text: "차변" }], header: true, scope: "col" },
              { content: [{ text: "대변" }], header: true, scope: "col" },
            ],
            [
              {
                content: [
                  { text: "총비용", marks: ["account"] },
                  { text: ": 돈을 쓴 거 & 회수할 수 없다 -> 1년간의 누적비용" },
                ],
              },
              {
                content: [
                  { text: "총수익", marks: ["account"] },
                  { text: ": 돈을 번 거 & 돌려주지 않는다 -> 1년간의 누적수익" },
                ],
              },
            ],
          ],
        },
        {
          type: "list",
          items: [
            [
              { text: "손익계산서", marks: ["account"] },
              { text: ": 일정기간의 경영성과, 01/01 ~ 12/31" },
            ],
            [
              {
                text: "수익과 비용은 기말에 잔액을 0을 만들어서 차기로 이월하지 않는다.",
                marks: ["highlight"],
              },
              { text: " 각 사업연도별 경영성과를 분석하여 주주에게 보고한다." },
            ],
          ],
        },
      ],
    },
    {
      id: "ch-01-t03",
      chapterId: "ch-01",
      order: 3,
      title: "회계상 거래 판단기준과 비거래 사례",
      sourcePages: [2, 3],
      updatedAt: "2026.08.23",
      correctionIds: ["correction-001"],
      blocks: [
        {
          type: "paragraph",
          content: [
            { text: "다음의 " },
            { text: "2가지 조건을 모두 만족", marks: ["highlight"] },
            { text: "하는 경우 회계상 거래로 본다." },
          ],
        },
        {
          type: "list",
          items: [
            [
              { text: "자산, 부채, 자본", marks: ["account"] },
              { text: "의 증감변화가 있을 것." },
            ],
            [{ text: "화폐액으로 측정가능할 것." }],
          ],
        },
        {
          type: "paragraph",
          content: [{ text: "회계상 거래가 아닌 사례", marks: ["bold"] }],
        },
        {
          type: "list",
          items: [
            [{ text: "상품을 주문하다." }],
            [{ text: "부동산을 계약하다." }],
            [{ text: "직원을 채용하다." }],
            [{ text: "구두로 약정하다." }],
          ],
        },
        {
          type: "callout",
          tone: "warning",
          content: [
            { text: "26/08/05 영업부 직원 이순신을 월급 3,500,000원에 채용하다. " },
            { text: "회계상 거래 X", marks: ["warning"] },
            { text: " -> 자산, 부채, 자본의 증감변화 X" },
          ],
        },
      ],
    },
    {
      id: "ch-01-t04",
      chapterId: "ch-01",
      order: 4,
      title: "분개원리·거래의 8요소·기초 분개방법",
      sourcePages: [3, 4],
      updatedAt: "2026.08.23",
      blocks: [
        {
          type: "paragraph",
          content: [
            { text: "분개", marks: ["account"] },
            { text: ": 차변요소와 대변요소로 나누어 기록하는 것." },
          ],
        },
        {
          type: "list",
          items: [
            [
              { text: "복식회계(복식부기)", marks: ["account"] },
              { text: ": 장부에 두 번 기록하여 차변합계와 대변합계가 일치. " },
              { text: "자기검증기능", marks: ["bold"] },
              { text: "(스스로 오류를 찾아내는 기능)." },
            ],
            [
              { text: "단식회계", marks: ["account"] },
              {
                text: ": 가계부, 차계부 등 -> 자기검증기능이 없다(비영리단체, 정부회계 등에서 사용).",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          content: [
            { text: "거래의 8요소", marks: ["bold"] },
            { text: ": 재무상태표와 손익계산서의 차변과 대변에 기초하여 작성(교재 45페이지)." },
          ],
        },
        {
          type: "table",
          caption: [{ text: "거래의 8요소" }],
          columnCount: 3,
          rows: [
            [
              { content: [{ text: "차변요소" }], header: true, scope: "col" },
              { content: [{ text: "특징" }], header: true, scope: "col" },
              { content: [{ text: "대변요소" }], header: true, scope: "col" },
            ],
            [
              {
                content: [{ text: "자산증가", marks: ["account"] }],
                header: true,
                scope: "row",
              },
              { content: [{ text: "1) 차변발생(잔액, 0) --> 2) 대변소멸" }] },
              { content: [{ text: "자산감소", marks: ["account"] }] },
            ],
            [
              {
                content: [{ text: "부채감소", marks: ["account"] }],
                header: true,
                scope: "row",
              },
              { content: [{ text: "2) 차변소멸 <-- 1) 대변발생(잔액, 0)" }] },
              { content: [{ text: "부채증가", marks: ["account"] }] },
            ],
            [
              {
                content: [{ text: "자본감소", marks: ["account"] }],
                header: true,
                scope: "row",
              },
              { content: [{ text: "자본거래 X, 사업의 개시와 결산시 자본거래 발생" }] },
              { content: [{ text: "자본증가", marks: ["account"] }] },
            ],
            [
              {
                content: [{ text: "비용발생", marks: ["account"] }],
                header: true,
                scope: "row",
              },
              { content: [{ text: "" }] },
              { content: [{ text: "수익발생", marks: ["account"] }] },
            ],
          ],
        },
        {
          type: "paragraph",
          content: [{ text: "분개방법", marks: ["bold"] }],
        },
        {
          type: "list",
          items: [
            [
              {
                text: "(1) 거래를 파악(지면을 읽고)하여 나(기업)를 기준으로 들어오고 나간 것을 찾아라!",
              },
            ],
            [
              {
                text: "(2) 들어오고 나간 것이 무엇인지 파악: 자산(내꺼), 부채(남의꺼), 수익(돌려주지 X), 비용(회수 X). ",
              },
              {
                text: "기초분개에서 자본의 증감거래는 없다.",
                marks: ["warning"],
              },
            ],
            [
              {
                text: "(3) 거래의 8요소를 검토하여 차변요소와 대변요소를 결정 -> 계정과목(사전을 이용)을 기입 -> 금액을 기입 -> 차변요소 또는 대변요소를 결정.",
              },
            ],
            [
              { text: "(4) 반대쪽 요소를 결정: " },
              { text: "반드시 부채를 먼저 검토", marks: ["highlight"] },
              { text: "." },
            ],
          ],
        },
        {
          type: "formula",
          content: [{ text: "분개연습1 -> 요소에 집중하여 분개를 연습" }],
        },
        {
          type: "callout",
          tone: "key",
          content: [
            { text: "거래의 이중성", marks: ["bold"] },
            { text: ": 회계상 거래는 차변요소와 대변요소가 동시에 발생한다." },
          ],
        },
        {
          type: "formula",
          content: [
            { text: "대차평균의 원리: " },
            { text: "차변금액과 대변금액은 항상 일치", marks: ["highlight"] },
          ],
        },
        {
          type: "formula",
          content: [
            {
              text: "분개연습2 -> 들/나 -> 자산, 부채, 수익, 비용 파악 -> 요소결정(계정과목) 금액 -> 반대요소결정(부채검토)",
            },
          ],
        },
      ],
      journal: {
        representative: createSimpleJournal({
          id: "ch-01-t04-j01",
          page: 3,
          transaction: "택시비 20,000원을 현금(나)으로 지급하다.",
          debitAccount: "여비교통비",
          creditAccount: "현금",
          amount: 20000,
          note: expenseAndAssetDecrease,
        }),
        extras: [
          createSimpleJournal({
            id: "ch-01-t04-e01",
            page: 3,
            transaction:
              "사무실에서 사용할 책상과 의자(들)를 현금(나) 150,000원을 지급하여 구입하다.",
            debitAccount: "비품",
            creditAccount: "현금",
            amount: 150000,
            note: assetIncreaseAndDecrease,
          }),
          createSimpleJournal({
            id: "ch-01-t04-e02",
            page: 3,
            transaction:
              "지난달 거래처에서 빌려온 돈에 대한 이자 50,000원을 현금(나)으로 지급하다.",
            debitAccount: "이자비용",
            creditAccount: "현금",
            amount: 50000,
            note: expenseAndAssetDecrease,
          }),
          createSimpleJournal({
            id: "ch-01-t04-e03",
            page: 3,
            transaction:
              "신한은행에서 1년 후 상환조건으로 현금(들) 10,000,000원을 빌려오다.",
            debitAccount: "현금",
            creditAccount: "차입금",
            amount: 10000000,
            note: [
              { text: "자산증", marks: ["account"] },
              { text: " / " },
              { text: "부채증", marks: ["account"] },
            ],
          }),
          createSimpleJournal({
            id: "ch-01-t04-e04",
            page: 4,
            transaction:
              "운반용 화물트럭(들)을 80,000,000원에 구입하고 대금은 보통예금(나)에서 이체하여 지급하다.",
            debitAccount: "차량운반구",
            creditAccount: "보통예금",
            amount: 80000000,
            note: assetIncreaseAndDecrease,
          }),
          createSimpleJournal({
            id: "ch-01-t04-e05",
            page: 4,
            transaction:
              "회계팀 직원 강감찬에게 7월분 급여 4,000,000원을 현금(나)으로 지급하다.",
            debitAccount: "급여",
            creditAccount: "현금",
            amount: 4000000,
            note: expenseAndAssetDecrease,
          }),
          createSimpleJournal({
            id: "ch-01-t04-e06",
            page: 4,
            transaction:
              "거래처 영업부장과 미금식당에서 식사를 하고 식사비 100,000원을 현금(나)으로 지급하다.",
            debitAccount: "기업업무추진비",
            creditAccount: "현금",
            amount: 100000,
            note: [
              { text: "비용발", marks: ["account"] },
              { text: " -> 거래처 / " },
              { text: "자산감", marks: ["account"] },
            ],
          }),
          createSimpleJournal({
            id: "ch-01-t04-e07",
            page: 4,
            transaction:
              "영업부 직원들 간식(버터떡, 커피 등)을 구입하고 현금(나) 90,000원을 지급하다.",
            debitAccount: "복리후생비",
            creditAccount: "현금",
            amount: 90000,
            note: [
              { text: "비용발", marks: ["account"] },
              { text: " -> 내부임직원 / " },
              { text: "자산감", marks: ["account"] },
            ],
          }),
          createSimpleJournal({
            id: "ch-01-t04-e08",
            page: 4,
            transaction: "본사 영업부 사무실 전화요금 160,000원을 현금(나)으로 지급하다.",
            debitAccount: "통신비",
            creditAccount: "현금",
            amount: 160000,
            note: expenseAndAssetDecrease,
          }),
        ],
      },
    },
    {
      id: "ch-01-t05",
      chapterId: "ch-01",
      order: 5,
      title: "업태별 매입·매출 계정과목",
      sourcePages: [4],
      updatedAt: "2026.08.23",
      correctionIds: ["correction-002"],
      blocks: [
        {
          type: "list",
          items: [
            [
              { text: "제조업", marks: ["account"] },
              { text: ": 만들어 판다. -> 삼양식품, 농심, 크라운제과 등" },
            ],
            [
              { text: "도소매업(유통업)", marks: ["account"] },
              { text: ": 사다 판다. -> 이마트, 편의점, 슈퍼마켓 등" },
            ],
            [
              { text: "서비스업", marks: ["account"] },
              {
                text: ": 서비스(용역)를 판다. -> 교육서비스, 음식서비스, 음료서비스, 금융서비스, 법률서비스 등",
              },
            ],
          ],
        },
        {
          type: "table",
          caption: [{ text: "기업의 업태별 구분" }],
          columnCount: 4,
          rows: [
            [
              {
                content: [{ text: "제조업: 삼양식품 / 매입" }],
                header: true,
                scope: "col",
              },
              {
                content: [{ text: "제조업: 삼양식품 / 매출" }],
                header: true,
                scope: "col",
              },
              {
                content: [{ text: "도소매업: 이마트 / 매입" }],
                header: true,
                scope: "col",
              },
              {
                content: [{ text: "도소매업: 이마트 / 매출" }],
                header: true,
                scope: "col",
              },
            ],
            [
              {
                content: [
                  { text: "밀가루(" },
                  { text: "원재료", marks: ["account"] },
                  { text: ")" },
                ],
              },
              {
                content: [
                  { text: "라면(" },
                  { text: "제품매출", marks: ["account"] },
                  { text: ")" },
                ],
              },
              {
                content: [
                  { text: "라면(" },
                  { text: "상품", marks: ["account"] },
                  { text: ")" },
                ],
              },
              {
                content: [
                  { text: "라면(" },
                  { text: "상품매출", marks: ["account"] },
                  { text: ")" },
                ],
              },
            ],
            [
              { content: [{ text: "500원(원가)" }] },
              {
                content: [
                  { text: "700원(판매가, 시가)" },
                  { text: "+이익", marks: ["highlight"] },
                ],
              },
              { content: [{ text: "700원(원가)" }] },
              {
                content: [
                  { text: "800원(판매가, 시가)" },
                  { text: "+이익", marks: ["highlight"] },
                ],
              },
            ],
            [
              {
                content: [
                  { text: "차변: " },
                  { text: "자산증(원재료)", marks: ["account"] },
                  { text: " /" },
                ],
              },
              {
                content: [
                  { text: "/ 대변: " },
                  { text: "수익발(제품매출)", marks: ["account"] },
                ],
              },
              {
                content: [
                  { text: "차변: " },
                  { text: "자산증(상품)", marks: ["account"] },
                  { text: " /" },
                ],
              },
              {
                content: [
                  { text: "/ 대변: " },
                  { text: "수익발(상품매출)", marks: ["account"] },
                ],
              },
            ],
          ],
        },
      ],
      journal: {
        representative: {
          id: "ch-01-t05-j01",
          sourcePages: [4],
          transaction: [
            {
              text: "CGV 영화관(영상서비스)에서 스파이더맨 영화티켓 2매를 현금(들) 24,000원을 받고 판매하였다.(매출)",
            },
          ],
          note: [
            { text: "자산증", marks: ["account"] },
            { text: " / " },
            { text: "수익발", marks: ["account"] },
          ],
          presentation: "variants",
          variants: [
            {
              label: "서비스매출",
              entries: [
                {
                  date: "26/08/05",
                  debit: [{ account: "현금", amount: 24000 }],
                  credit: [{ account: "서비스매출", amount: 24000 }],
                },
              ],
            },
            {
              label: "용역매출",
              entries: [
                {
                  date: "26/08/05",
                  debit: [{ account: "현금", amount: 24000 }],
                  credit: [{ account: "용역매출", amount: 24000 }],
                },
              ],
            },
          ],
        },
        extras: [],
      },
    },
    {
      id: "ch-01-t06",
      chapterId: "ch-01",
      order: 6,
      title: "예금 관련 계정과목",
      sourcePages: [4],
      updatedAt: "2026.08.23",
      blocks: [
        {
          type: "table",
          caption: [{ text: "예금관련 계정과목" }],
          columnCount: 2,
          rows: [
            [
              { content: [{ text: "계정과목" }], header: true, scope: "col" },
              { content: [{ text: "특징" }], header: true, scope: "col" },
            ],
            [
              {
                content: [{ text: "당좌예금", marks: ["account"] }],
                header: true,
                scope: "row",
              },
              {
                content: [
                  { text: "당좌수표와 연결", marks: ["highlight"] },
                  { text: "된 예금" },
                ],
              },
            ],
            [
              {
                content: [{ text: "보통예금", marks: ["account"] }],
                header: true,
                scope: "row",
              },
              { content: [{ text: "자유입출금예금" }] },
            ],
            [
              {
                content: [{ text: "정기예금", marks: ["account"] }],
                header: true,
                scope: "row",
              },
              {
                content: [
                  { text: "목돈을 일정기간 금융기관에 예탁하고 만기시 원금과 이자를 수령" },
                ],
              },
            ],
            [
              {
                content: [{ text: "정기적금", marks: ["account"] }],
                header: true,
                scope: "row",
              },
              {
                content: [
                  { text: "매월 일정액을 금융기관에 예탁하고 만기시 원금과 이자를 수령" },
                ],
              },
            ],
          ],
        },
      ],
    },
  ],
};
