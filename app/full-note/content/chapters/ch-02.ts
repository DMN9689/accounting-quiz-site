import type {
  Chapter,
  ContentBlock,
  JournalEntry,
  JournalExample,
  JournalLine,
  JournalVariant,
  MarkType,
  RichText,
  RichTextSegment,
  TableCell,
  TheoryItem,
} from "../../types/content";

const UPDATED_AT = "2026.08.23";

function s(text: string, ...marks: MarkType[]): RichTextSegment {
  return marks.length > 0 ? { text, marks } : { text };
}

function r(...segments: RichTextSegment[]): RichText {
  return segments;
}

function p(...segments: RichTextSegment[]): ContentBlock {
  return { type: "paragraph", content: r(...segments) };
}

function l(...items: RichText[]): ContentBlock {
  return { type: "list", items };
}

function f(...segments: RichTextSegment[]): ContentBlock {
  return { type: "formula", content: r(...segments) };
}

function callout(
  tone: "key" | "warning" | "process",
  ...segments: RichTextSegment[]
): ContentBlock {
  return { type: "callout", tone, content: r(...segments) };
}

function c(
  content: string | RichText,
  header?: boolean,
  scope?: "row" | "col",
): TableCell {
  return {
    content: typeof content === "string" ? r(s(content)) : content,
    ...(header === undefined ? {} : { header }),
    ...(scope === undefined ? {} : { scope }),
  };
}

function t(
  caption: string,
  columnCount: number,
  rows: TableCell[][],
): ContentBlock {
  return {
    type: "table",
    caption: r(s(caption)),
    columnCount,
    rows,
  };
}

function line(account: string, amount: number, counterparty?: string): JournalLine {
  return {
    account,
    amount,
    ...(counterparty === undefined ? {} : { counterparty }),
  };
}

function entry(
  debit: JournalLine[],
  credit: JournalLine[],
  date?: string,
  label?: string,
): JournalEntry {
  return {
    ...(date === undefined ? {} : { date }),
    ...(label === undefined ? {} : { label }),
    debit,
    credit,
  };
}

function example(
  id: string,
  sourcePages: number[],
  transaction: string,
  entries: JournalEntry[],
  note?: RichText,
): JournalExample {
  return {
    id,
    sourcePages,
    transaction: r(s(transaction)),
    ...(note === undefined ? {} : { note }),
    presentation: "entries",
    entries,
  };
}

function variantExample(
  id: string,
  sourcePages: number[],
  transaction: string,
  variants: JournalVariant[],
): JournalExample {
  return {
    id,
    sourcePages,
    transaction: r(s(transaction)),
    presentation: "variants",
    variants,
  };
}

function theory(
  id: string,
  order: number,
  title: string,
  sourcePages: number[],
  blocks: ContentBlock[],
  journal?: TheoryItem["journal"],
  correctionIds?: string[],
): TheoryItem {
  return {
    id,
    chapterId: "ch-02",
    order,
    title,
    sourcePages,
    updatedAt: UPDATED_AT,
    ...(correctionIds === undefined ? {} : { correctionIds }),
    blocks,
    ...(journal === undefined ? {} : { journal }),
  };
}

export const chapter02: Chapter = {
  id: "ch-02",
  order: 2,
  title: "기본 계정과목과 거래 처리",
  sourcePages: [5, 6, 7, 8, 9, 10],
  theories: [
    theory(
      "ch-02-t01",
      1,
      "당좌예금 입금과 당좌수표 수취·발행",
      [5],
      [
        p(
          s("당좌예금에 현금을 입금하면 "),
          s("당좌예금", "account"),
          s("이 증가하고 "),
          s("현금", "account"),
          s("이 감소한다."),
        ),
        l(
          r(
            s("자기발행 당좌수표: ", "bold"),
            s("당좌예금 차변잔액과 한도액을 확인하고 발행하며, "),
            s("당좌예금", "account"),
            s(" 잔액이 소멸한다."),
          ),
          r(
            s("타인발행 당좌수표: ", "bold"),
            s("수취하면 "),
            s("현금", "account"),
            s("으로 처리한다.", "highlight"),
          ),
          r(s("매출자는 수표를 수취하고, 매입자는 수표를 발행한다.")),
        ),
      ],
      {
        representative: example(
          "ch-02-t01-j01",
          [5],
          "당좌예금(들)에 현금(나) 100,000원을 입금하다.",
          [entry([line("당좌예금", 100000)], [line("현금", 100000)])],
        ),
        extras: [
          example(
            "ch-02-t01-j02",
            [5],
            "상품(나) 50,000원을 매출하고 대금은 타인발행 당좌수표(들)로 받다.",
            [entry([line("현금", 50000)], [line("상품매출", 50000)])],
            r(
              s("타인발행수표를 수취하면 "),
              s("현금", "account"),
              s("으로 처리한다."),
            ),
          ),
          example(
            "ch-02-t01-j03",
            [5],
            "상품(들) 50,000원을 매입하고 대금은 당좌수표(나)를 발행하여 지급하다.",
            [entry([line("상품", 50000)], [line("당좌예금", 50000)])],
            r(
              s("자기발행수표를 발행하면 "),
              s("당좌예금", "account"),
              s("으로 처리한다."),
            ),
          ),
        ],
      },
    ),
    theory(
      "ch-02-t02",
      2,
      "비품과 상거래·비상거래 채권채무 계정 선택",
      [5],
      [
        p(
          s("비품", "account"),
          s(
            "은 업무에 사용하기 위해 구입한 책상, 의자, 에어컨, 컴퓨터와 주변기기, 빔프로젝트, 사무용가구 등 1년 이상 사용할 것으로 예상되는 자산이다.",
          ),
        ),
        p(
          s("상거래와 상거래가 아닌 거래를 구분하여 "),
          s("채권(받을권리)", "bold"),
          s("과 "),
          s("채무(갚을의무)", "bold"),
          s(" 계정과목을 선택한다."),
        ),
        t("상거래·비상거래 채권채무 계정 선택", 3, [
          [
            c("구분", true, "col"),
            c("외상매입·외상구입·외상취득", true, "col"),
            c("외상매출·외상처분·외상매각", true, "col"),
          ],
          [
            c("상거래○", true, "row"),
            c(r(s("상품·원재료", "account"), s(" / "), s("외상매입금", "account"))),
            c(
              r(
                s("외상매출금", "account"),
                s(" / "),
                s("상품매출·제품매출", "account"),
              ),
            ),
          ],
          [
            c("상거래X", true, "row"),
            c(r(s("비품·토지 등", "account"), s(" / "), s("미지급금", "account"))),
            c(
              r(
                s("미수금", "account"),
                s(" / "),
                s("비품·토지 등 감소", "account"),
              ),
            ),
          ],
        ]),
      ],
      {
        representative: example(
          "ch-02-t02-j01",
          [5],
          "상품(들) 100원을 외상으로 매입하다.",
          [entry([line("상품", 100)], [line("외상매입금", 100)])],
        ),
        extras: [
          example(
            "ch-02-t02-j02",
            [5],
            "상품(나) 100원을 외상으로 매출하다.",
            [entry([line("외상매출금", 100)], [line("상품매출", 100)])],
          ),
          example(
            "ch-02-t02-j03",
            [5],
            "영업용 건물(들)을 100원에 외상으로 구입하다.",
            [entry([line("건물", 100)], [line("미지급금", 100)])],
          ),
          example(
            "ch-02-t02-j04",
            [5],
            "영업용 건물(나)을 100원에 외상으로 매각하다.",
            [entry([line("미수금", 100)], [line("건물", 100)])],
          ),
        ],
      },
    ),
    theory(
      "ch-02-t03",
      3,
      "어음 수취·발행과 만기 회수·상환",
      [5, 6],
      [
        p(
          s("어음(약속어음, 전자어음)"),
          s("은 만기일(지급기일)에 지급하겠다고 약속한 증서이다."),
        ),
        t("어음의 발행과 수취", 3, [
          [c("구분", true, "col"), c("당사자", true, "col"), c("회계 흐름", true, "col")],
          [
            c("발행", true, "row"),
            c("발행인·채무자"),
            c(r(s("발행: 부채 증가 → 만기: 부채 감소", "highlight"))),
          ],
          [
            c("수취", true, "row"),
            c("수취인·채권자"),
            c(r(s("수취: 자산 증가 → 만기: 자산 감소", "highlight"))),
          ],
        ]),
        p(
          s(
            "어음을 수취한 매출자는 수취인·수령인·채권자이고, 어음을 발행한 매입자는 발행인·채무자이다.",
          ),
        ),
      ],
      {
        representative: example(
          "ch-02-t03-j01",
          [6],
          "상품(들) 500원을 매입하고 대금은 2개월 만기 약속어음을 발행하여 지급하다.",
          [entry([line("상품", 500)], [line("지급어음", 500)], "08/06")],
        ),
        extras: [
          example(
            "ch-02-t03-j02",
            [6],
            "상품(나) 500원을 매출하고 대금은 2개월 만기 약속어음으로 받다.",
            [entry([line("받을어음", 500)], [line("상품매출", 500)], "08/06")],
            r(s("받을어음", "account"), s(" 500 / "), s("상품매출", "account"), s(" 500")),
          ),
          example(
            "ch-02-t03-j03",
            [6],
            "지난 08/06일 받아두었던 약속어음 500원이 금일 만기되어 당사의 보통예금(들)으로 입금받다.",
            [
              entry(
                [line("보통예금", 500)],
                [line("받을어음", 500)],
                "10/06",
                "만기일·만기추심",
              ),
            ],
          ),
          example(
            "ch-02-t03-j04",
            [6],
            "지난 08/06일 발행했던 약속어음 500원이 금일 만기되어 보통예금(나)에서 이체하여 지급하다.",
            [
              entry(
                [line("지급어음", 500)],
                [line("보통예금", 500)],
                "10/06",
                "만기일·만기결제",
              ),
            ],
          ),
        ],
      },
      ["correction-003"],
    ),
    theory(
      "ch-02-t04",
      4,
      "임차보증금·임대보증금",
      [6],
      [
        p(
          s("세입자인 "),
          s("임차인", "bold"),
          s("은 지급한 보증금을 "),
          s("임차보증금", "account"),
          s("으로, 건물주인 "),
          s("임대인", "bold"),
          s("은 받은 보증금을 "),
          s("임대보증금", "account"),
          s("으로 처리한다."),
        ),
      ],
      {
        representative: example(
          "ch-02-t04-j01",
          [6],
          "㈜그린은 ㈜미금과 사무실 임대차 계약을 체결하고 보증금 100,000원을 보통예금(나)에서 이체하여 지급하다.",
          [
            entry(
              [line("임차보증금", 100000, "㈜미금")],
              [line("보통예금", 100000)],
              "08/01",
            ),
          ],
        ),
        extras: [
          example(
            "ch-02-t04-j02",
            [6],
            "㈜미금은 ㈜그린과 사무실 임대차 계약을 체결하고 보증금 100,000원을 보통예금(들)으로 입금받다.",
            [
              entry(
                [line("보통예금", 100000)],
                [line("임대보증금", 100000, "㈜그린")],
                "08/01",
              ),
            ],
          ),
        ],
      },
    ),
    theory(
      "ch-02-t05",
      5,
      "임차료·임대료",
      [6],
      [
        p(
          s("임차료", "account"),
          s(
            "는 빌려서 사용한 대가로 지급하는 비용이며, 승용차 렌트비와 정수기·복사기 등의 렌탈비가 포함된다.",
          ),
        ),
      ],
      {
        representative: example(
          "ch-02-t05-j01",
          [6],
          "㈜그린은 8월분 사무실 월세(임대료) 10,000원을 현금(나)으로 지급하다.",
          [entry([line("임차료", 10000)], [line("현금", 10000)], "08/31")],
        ),
        extras: [
          example(
            "ch-02-t05-j02",
            [6],
            "㈜미금은 8월분 사무실 월세(임대료) 10,000원을 현금(들)으로 받다.",
            [entry([line("현금", 10000)], [line("임대료", 10000)], "08/31")],
          ),
        ],
      },
    ),
    theory(
      "ch-02-t06",
      6,
      "인건비와 통신비 계정과목",
      [6],
      [
        p(s("정기적 성격의 인건비", "bold"), s("는 매월 지급하는 월급과 각종 수당이다.")),
        t("정기적 성격의 인건비", 2, [
          [c("지급대상", true, "col"), c("계정과목", true, "col")],
          [c("본사: 영업부·관리부 등", true, "row"), c(r(s("급여", "account")))],
          [
            c("공장(제조업): 생산부·인사관리부 등", true, "row"),
            c(r(s("임금", "account"))),
          ],
          [c("일용직: 아르바이트 등", true, "row"), c(r(s("잡급", "account")))],
        ]),
        p(s("부정기적 성격의 인건비", "bold"), s("는 어쩌다 지급하는 상여금과 퇴직금 등이다.")),
        t("부정기적 성격의 인건비", 2, [
          [c("지급대상", true, "col"), c("계정과목", true, "col")],
          [
            c("명절·기념일 등에 지급하는 보너스", true, "row"),
            c(r(s("상여금", "account"))),
          ],
          [
            c("임직원 퇴사 시 지급하는 퇴직금", true, "row"),
            c(r(s("퇴직급여", "account"))),
          ],
        ]),
        p(
          s("통신비", "account"),
          s(
            "에는 전화요금, 인터넷요금, 우편요금(등기·일반 등), 우표구입비, 영업사원 휴대폰요금 지원 등이 포함된다.",
          ),
        ),
      ],
    ),
    theory(
      "ch-02-t07",
      7,
      "여비교통비와 광고선전비",
      [7],
      [
        p(s("여비교통비", "account"), s("는 여비와 교통비로 구분한다.")),
        l(
          r(
            s("여비: ", "bold"),
            s("출장 시 사용하는 경비로 숙박비와 출장 시 식대가 포함된다. 출장 시 식대는 "),
            s("복리후생비 복수정답", "highlight"),
            s("이다."),
          ),
          r(
            s("교통비: ", "bold"),
            s("대중교통요금, 택시, 철도요금, 고속버스, 항공권, 선박요금, 톨비 등이다."),
          ),
        ),
        p(
          s("광고선전비", "account"),
          s(
            "에는 TV광고, 인터넷광고, 라디오광고, SNS광고, 신문·잡지광고, 판촉물제작비, 현수막제작비가 포함된다.",
          ),
        ),
        l(
          r(s("홍보용 전단지 등 인쇄물: "), s("도서인쇄비 복수정답", "highlight")),
          r(s("직원채용공고 수수료: "), s("수수료비용 복수정답", "highlight")),
          r(
            s("간판제작비: 광고선전비. 단, "),
            s("회수 가능한 특수 간판은 비품", "warning"),
            s("이다."),
          ),
        ),
      ],
    ),
    theory(
      "ch-02-t08",
      8,
      "세금과공과와 수도광열 관련 계정",
      [7],
      [
        p(
          s("세금과공과", "account"),
          s("는 세금(조세)과 공과금(강제적 부담금)을 합한 것이다."),
        ),
        callout(
          "warning",
          s(
            "법인세·소득세·부가세·취득세·등록세 등 ‘○○○세’에는 절대 세금과공과 계정과목을 사용하지 않는다.",
            "warning",
          ),
        ),
        p(
          s("아래의 5가지 세금만", "bold", "highlight"),
          s(" 세금과공과 계정과목을 사용한다. (암기)"),
        ),
        t("세금과공과 계정과목을 사용하는 5개 범주", 3, [
          [c("범주", true, "col"), c("기준", true, "col"), c("예시·처리", true, "col")],
          [
            c("보유세(총칭명)", true, "row"),
            c("재산적 가치가 있는 재화를 보유함으로써 납부하는 세금"),
            c("자동차세·재산세 → 세금과공과"),
          ],
          [
            c("협회비", true, "row"),
            c("법정단체와 비법정단체를 구분"),
            c(
              "법정단체(대한상공회의소·무역협회·건설협회 등) 협회비 → 세금과공과, 비법정단체(동창회·향우회·종친회 등) 협회비 → 기부금",
            ),
          ],
          [
            c("국민연금사업주부담금", true, "row"),
            c("강제적으로 납부하는 부담금·회사부담금 50%"),
            c("환경개선부담금·폐수배출부담금·폐기물처리부담금 등 → 세금과공과"),
          ],
          [
            c("각 종 벌금", true, "row"),
            c("법 위반에 따른 부담"),
            c("과태료·범칙금·과징금·가산세 등 → 세금과공과"),
          ],
          [
            c("(균등할) 주민세", true, "row"),
            c("기업의 종업원 수·매출액 등에 따라 차등 납부하는 지방세"),
            c("세금과공과"),
          ],
        ]),
        p(s("난방비에는 난방용 유류비용과 가스충전요금이 포함된다.")),
        t("전기·수도·가스·난방비 계정 구분", 3, [
          [
            c("발생 장소", true, "col"),
            c("비용", true, "col"),
            c("계정과목", true, "col"),
          ],
          [
            c("본사", true, "row"),
            c("전기요금·수도요금·가스요금·난방비"),
            c(r(s("수도광열비", "account"))),
          ],
          [
            c("공장(제조업)", true, "row"),
            c("전기요금"),
            c(r(s("전력비", "account"))),
          ],
          [
            c("공장(제조업)", true, "row"),
            c("수도요금·가스요금·난방비"),
            c(r(s("가스수도료", "account"))),
          ],
        ]),
      ],
      undefined,
      ["correction-017"],
    ),
    theory(
      "ch-02-t09",
      9,
      "유가증권 개요",
      [7],
      [
        p(
          s("유가증권", "account"),
          s(
            "은 재산적 가치가 있는 증권으로 주식, 사채(社債: 기업이 발행하는 채무증권), 공채, 지방채, 국채 등이 있다.",
          ),
        ),
        p(
          s("기업이 여유자금으로 투자목적 자산을 구입하면 "),
          s("보유목적과 능력에 따라 4가지 계정과목", "highlight"),
          s("을 사용한다."),
        ),
      ],
    ),
    theory(
      "ch-02-t10",
      10,
      "매출자의 선수금 계약 처리",
      [7],
      [
        p(
          s("선수금", "account"),
          s("은 매출자가 계약금을 미리 받은 경우의 계정으로, "),
          s("미리 걷은 돈·남의 돈", "highlight"),
          s("이다."),
        ),
        p(
          s("계약을 이행하면 대변에서 발생한 "),
          s("선수금", "account"),
          s("을 차변에서 소멸시킨다."),
        ),
      ],
      {
        representative: example(
          "ch-02-t10-j01",
          [7],
          "㈜그린은 ㈜미금으로부터 상품 500,000원을 주문받고 계약금 50,000원을 보통예금(들)으로 입금받다.",
          [
            entry(
              [line("보통예금", 50000)],
              [line("선수금", 50000, "㈜미금")],
              "08/07",
            ),
          ],
        ),
        extras: [
          example(
            "ch-02-t10-j02",
            [7],
            "㈜그린은 ㈜미금에 상품 500,000원을 매출하고 지난 7일에 받은 계약금 50,000원을 제외한 잔액을 외상으로 하다.",
            [
              entry(
                [line("선수금", 50000, "㈜미금"), line("외상매출금", 450000, "㈜미금")],
                [line("상품매출", 500000)],
                "08/10",
              ),
            ],
          ),
        ],
      },
    ),
    theory(
      "ch-02-t11",
      11,
      "매입자의 선급금 계약 처리",
      [7],
      [
        p(
          s("선급금", "account"),
          s("은 매입자가 계약금을 미리 지급한 경우의 계정으로, "),
          s("미리 지급한 돈·내 돈", "highlight"),
          s("이다."),
        ),
        p(
          s("계약을 이행하면 차변에서 발생한 "),
          s("선급금", "account"),
          s("을 대변에서 소멸시킨다."),
        ),
      ],
      {
        representative: example(
          "ch-02-t11-j01",
          [7],
          "㈜미금은 ㈜그린에 상품 500,000원을 주문하고 계약금 50,000원을 보통예금(나)에서 이체하여 지급하다.",
          [
            entry(
              [line("선급금", 50000, "㈜그린")],
              [line("보통예금", 50000)],
              "08/07",
            ),
          ],
        ),
        extras: [
          example(
            "ch-02-t11-j02",
            [7],
            "㈜미금은 ㈜그린으로부터 상품(들) 500,000원을 매입하고 지난 7일에 지급한 계약금 50,000원을 제외한 잔액을 외상으로 하다.",
            [
              entry(
                [line("상품", 500000)],
                [line("선급금", 50000, "㈜그린"), line("외상매입금", 450000, "㈜그린")],
                "08/10",
              ),
            ],
          ),
        ],
      },
    ),
    theory(
      "ch-02-t12",
      12,
      "도서인쇄비와 소모품비",
      [8],
      [
        p(
          s("도서인쇄비", "account"),
          s(
            "에는 도서구입비, 신문대금, 도서정기구독료, 임직원 명함제작비, 제본비용 등이 포함된다.",
          ),
        ),
        callout(
          "key",
          s("전단지 등 홍보용 인쇄물은 "),
          s("광고선전비 복수정답", "highlight"),
          s("이다."),
        ),
        p(
          s("소모품비", "account"),
          s(
            "에는 볼펜·A4용지 등 사무용품과 청소용품, 세제, 휴지 등 각 종 소모품이 포함된다. 실무에서 사무용품을 대량 사용하는 기업은 사무용품비를 사용한다.",
          ),
        ),
      ],
    ),
    theory(
      "ch-02-t13",
      13,
      "매입·취득 시 부대비용",
      [8],
      [
        p(
          s("모든 자산은 매입·취득 시 발생하는 부대비용을 "),
          s("취득하는 자산의 취득원가에 포함", "bold", "highlight"),
          s("하여 자산으로 처리한다."),
        ),
        callout(
          "warning",
          s("단, "),
          s("단기매매증권", "account"),
          s(" 취득 시 발생하는 수수료는 "),
          s("수수료비용", "account"),
          s("으로 처리한다.", "warning"),
        ),
        p(
          s(
            "부대비용에는 매입 시 운반비, 수수료, 취득세, 취득과 관련 있는 등록세가 포함된다.",
          ),
        ),
        callout(
          "warning",
          s("취득과 관련 없는 등록세는 "),
          s("세금과공과", "account"),
          s(
            "로 처리한다. 법인의 대표이사 변경 시 발생하는 등록세가 이에 해당한다.",
            "warning",
          ),
        ),
        f(
          s("상품 매입원가 500,000 + 부대비용 20,000 = "),
          s("장부상 취득원가 520,000원", "highlight"),
        ),
        l(
          r(s("오대리는 신상품 원가를 500,000원으로 확인하였다.")),
          r(
            s(
              "사장님은 특판가 510,000원에 판매하면 1개당 10,000원의 순이익이 발생한다고 생각하였다.",
            ),
          ),
          r(
            s(
              "문제 해결: 상품의 매입원가 500,000원과 운반비 20,000원을 합하여 장부상 취득원가를 520,000원으로 기록한다.",
              "bold",
            ),
          ),
          r(s("사장님의 판매가 결정은 530,000원이다.")),
        ),
      ],
      {
        representative: example(
          "ch-02-t13-j01",
          [8],
          "㈜그린은 상품(들, 자산) 500,000원을 매입하며 매입 시 운반비 20,000원과 함께 현금(나)으로 지급하다.",
          [entry([line("상품", 520000)], [line("현금", 520000)], "26/08/07")],
          r(s("매입 시 운반비를 "), s("상품 취득원가", "account"), s("에 포함한다.")),
        ),
        extras: [
          example(
            "ch-02-t13-j02",
            [8],
            "㈜그린은 운반용 화물트럭(들, 자산)을 현대자동차로부터 80,000,000원에 구입하고 취득세 2,000,000원, 등록세 1,000,000원을 현금으로 지급하고 트럭 구입대금 80,000,000원은 보통예금(나)에서 이체하여 지급하다.",
            [
              entry(
                [line("차량운반구", 83000000)],
                [line("현금", 3000000), line("보통예금", 80000000)],
                "26/08/07",
              ),
            ],
            r(s("차량운반구 83,000,000원에 "), s("취득세 포함", "highlight")),
          ),
          example(
            "ch-02-t13-j03",
            [8],
            "㈜그린은 공장부지로 사용하고자 ㈜서현으로부터 토지(들, 자산)를 500,000,000원에 구입하고 부동산 중개수수료 10,000,000원은 현금(나)으로 지급하고 토지 구입대금은 다음 달에 지급하기로 하였다.",
            [
              entry(
                [line("토지", 510000000)],
                [line("현금", 10000000), line("미지급금", 500000000, "㈜서현")],
                "26/08/07",
              ),
            ],
          ),
          example(
            "ch-02-t13-j04",
            [8],
            "㈜그린은 ㈜미금으로부터 상품(들, 자산)을 매입하며 매입 시 발생한 우체국 택배비용 800,000원은 현금(나)으로 지급하였다.",
            [entry([line("상품", 800000)], [line("현금", 800000)], "26/08/07")],
          ),
        ],
      },
      ["correction-004"],
    ),
    theory(
      "ch-02-t14",
      14,
      "매출 시 부대비용",
      [8],
      [
        p(
          s("매출 시 운반비 등 부대비용은 "),
          s("비용으로 처리", "bold", "highlight"),
          s("한다."),
        ),
      ],
      {
        representative: example(
          "ch-02-t14-j01",
          [8],
          "㈜그린은 ㈜죽전에 상품(나) 7,000,000원을 외상으로 매출하고 매출 시 운반비 150,000원을 하나운송에 현금(나)으로 지급하였다. 하나의 전표로 처리할 것.",
          [
            entry(
              [line("외상매출금", 7000000, "㈜죽전"), line("운반비", 150000)],
              [line("상품매출", 7000000), line("현금", 150000)],
              "26/08/07",
            ),
          ],
        ),
        extras: [],
      },
    ),
    theory(
      "ch-02-t15",
      15,
      "취득 후 지출과 비용 계정 구분",
      [9, 10],
      [
        t("자산 취득 후 수선·유지비용", 4, [
          [
            c("대상", true, "col"),
            c("예시", true, "col"),
            c("지출", true, "col"),
            c("계정과목", true, "col"),
          ],
          [
            c("차량운반구", true, "row"),
            c("승용차·트럭·지게차·이륜차 등"),
            c("유류대·수선비·주차요금·세차요금 등"),
            c(r(s("차량유지비", "account"))),
          ],
          [
            c("차량운반구", true, "row"),
            c("승용차·트럭·지게차·이륜차 등"),
            c("보험료"),
            c(r(s("보험료", "account"))),
          ],
          [
            c("나머지 유형자산", true, "row"),
            c("건물·비품·기계장치 등"),
            c("수선비·도색비·하수구 수선 등"),
            c(r(s("수선비", "account"))),
          ],
          [
            c("나머지 유형자산", true, "row"),
            c("건물·비품·기계장치 등"),
            c("보험료"),
            c(r(s("보험료", "account"))),
          ],
        ]),
        t("복리후생비와 기업업무추진비(접대비)", 3, [
          [c("계정과목", true, "col"), c("지출대상", true, "col"), c("목적", true, "col")],
          [
            c("복리후생비", true, "row"),
            c("내부 임직원에게 선물·경조사비·식대·회식 등"),
            c("임직원의 복리후생목적"),
          ],
          [
            c("기업업무추진비", true, "row"),
            c("외부 거래처에게 선물·경조사비·식대·회식 등"),
            c("거래처와의 관계개선"),
          ],
        ]),
        t("광고선전비·기업업무추진비·기부금", 4, [
          [
            c("계정과목", true, "col"),
            c("사업관련성", true, "col"),
            c("지출대상", true, "col"),
            c("법인세법상 한도액", true, "col"),
          ],
          [c("광고선전비", true, "row"), c("사업유관"), c("불특정"), c("X")],
          [c("기업업무추진비", true, "row"), c("사업유관"), c("특정(거래처 등)"), c("○")],
          [c("기부금", true, "row"), c("사업무관"), c("특정(이재민 등)"), c("○")],
        ]),
        p(
          s("일반적인 비용에는 "),
          s("복리후생비", "account"),
          s(", "),
          s("통신비", "account"),
          s(", "),
          s("도서인쇄비", "account"),
          s(" 등이 있다."),
        ),
        t("일반적인 비용 계정 구분", 3, [
          [c("구분", true, "col"), c("발생 장소", true, "col"), c("원문 예시", true, "col")],
          [
            c("제조원가(500번대 코드)", true, "row"),
            c("공장"),
            c("생산직 직원 결혼식 축의금 → 복리후생비(제)"),
          ],
          [
            c("판매와관리비(800번대 코드)", true, "row"),
            c("본사"),
            c("영업부 직원 결혼식 축의금 → 복리후생비(판)"),
          ],
        ]),
        p(
          s("비용계정 중 "),
          s("수수료비용 계정만", "bold", "highlight"),
          s(" 제조원가, 판매와관리비, 영업외비용으로 구분한다."),
        ),
        t("수수료비용 계정 구분", 2, [
          [c("구분", true, "col"), c("발생 기준", true, "col")],
          [c("제조원가(500번대 코드)", true, "row"), c("공장에서 발생한 비용")],
          [c("판매와관리비(800번대 코드)", true, "row"), c("본사에서 발생한 비용")],
          [
            c("영업외비용(900번대 코드)", true, "row"),
            c("영업과 관련 없이(사업무관) 발생한 수수료비용"),
          ],
        ]),
        p(
          s("기업업무추진비 계정은 기업업무추진비를 "),
          s("어느 거래처에 지출했는지", "bold", "highlight"),
          s("에 따라 구분한다."),
        ),
        t("기업업무추진비 계정 구분", 2, [
          [c("구분", true, "col"), c("지출 거래처", true, "col")],
          [c("제조원가(500번대 코드)", true, "row"), c("매입거래처에 지출")],
          [
            c("판매와관리비(800번대 코드)", true, "row"),
            c("매출거래처에 지출(99%)"),
          ],
        ]),
      ],
    ),
    theory(
      "ch-02-t16",
      16,
      "카드매출과 가맹점 정산",
      [9],
      [
        p(
          s("카드매출의 매출자는 가맹점(단말기 소지)이며 "),
          s("가맹점수수료", "account"),
          s("가 발생한다."),
        ),
        callout(
          "warning",
          s("상품매출은 상거래이므로 "),
          s("미수금(국민)", "account", "warning"),
          s("을 사용하지 않는다.", "warning"),
        ),
      ],
      {
        representative: variantExample(
          "ch-02-t16-j01",
          [9],
          "㈜그린은 ㈜미금에 상품 50,000원을 매출하고 대금은 법인 신용·직불카드인 국민카드로 결제받다.",
          [
            {
              label: "신용카드 처리",
              entries: [
                entry(
                  [line("외상매출금(국민)", 50000)],
                  [line("상품매출", 50000)],
                  "08/07",
                ),
              ],
            },
            {
              label: "직불카드 처리",
              entries: [
                entry([line("보통예금", 50000)], [line("상품매출", 50000)], "08/07"),
              ],
            },
          ],
        ),
        extras: [
          example(
            "ch-02-t16-j02",
            [9],
            "㈜그린은 지난 7일 발생한 상품매출 관련 카드대금 50,000원에서 가맹점수수료 1%를 제외한 잔액을 당사의 보통예금으로 입금받다.",
            [
              entry(
                [line("보통예금", 49500), line("수수료비용(판/영)", 500)],
                [line("외상매출금(국민)", 50000)],
                "08/09",
              ),
            ],
          ),
        ],
      },
    ),
    theory(
      "ch-02-t17",
      17,
      "카드매입과 카드대금 결제",
      [9],
      [
        p(s("카드매입의 매입자는 법인카드 소지자이다.")),
        callout(
          "warning",
          s("상품매입은 상거래이므로 "),
          s("미지급금(국민)", "account", "warning"),
          s("을 사용하지 않는다.", "warning"),
        ),
      ],
      {
        representative: variantExample(
          "ch-02-t17-j01",
          [9],
          "㈜미금은 ㈜그린으로부터 상품 50,000원을 매입하고 대금은 법인 신용·직불카드인 국민카드로 결제하다.",
          [
            {
              label: "신용카드 처리",
              entries: [
                entry(
                  [line("상품", 50000)],
                  [line("외상매입금(국민)", 50000)],
                  "08/07",
                ),
              ],
            },
            {
              label: "직불카드 처리",
              entries: [
                entry([line("상품", 50000)], [line("보통예금", 50000)], "08/07"),
              ],
            },
          ],
        ),
        extras: [
          example(
            "ch-02-t17-j02",
            [9],
            "지난 8월에 발생한 상품매입 관련 카드대금 50,000원이 금일 당사의 보통예금에서 국민카드사로 자동이체 되었다.",
            [
              entry(
                [line("외상매입금(국민)", 50000)],
                [line("보통예금", 50000)],
                "09/10",
                "카드 결제일",
              ),
            ],
          ),
        ],
      },
      ["correction-005"],
    ),
    theory(
      "ch-02-t18",
      18,
      "채권·채무 거래처 관리",
      [9],
      [
        l(
          r(
            s("채권(받을권리): ", "bold"),
            s("외상매출금, 받을어음, 미수금, 대여금, 임차보증금, 선급금 등", "account"),
          ),
          r(
            s("채무(갚을의무): ", "bold"),
            s("외상매입금, 지급어음, 미지급금, 차입금, 임대보증금, 선수금 등", "account"),
          ),
        ),
        callout(
          "key",
          s("받을권리와 갚을의무에 대한 채권·채무는 잊지 않도록 "),
          s("반드시 거래처를 기입", "bold", "highlight"),
          s("한다."),
        ),
      ],
    ),
  ],
};
