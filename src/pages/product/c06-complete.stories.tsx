import type { Meta, StoryObj } from "@storybook/react-vite"
import { PageShell } from "@/app/page-shell"
import { C06Complete } from "@/pages/product/c06-complete"
import {
  WithAuthenticatedPage,
  type RouteWithState,
} from "../../../.storybook/decorators/page-providers"

const meta = {
  title: "pages/C06 상품가입 4단계",
  decorators: [WithAuthenticatedPage],
  parameters: { layout: "fullscreen" },
  render: () => (
    <PageShell activeId="product" breadcrumb={["금융상품", "가입"]}>
      <C06Complete />
    </PageShell>
  ),
} satisfies Meta<typeof C06Complete>

export default meta
type Story = StoryObj<typeof meta>

const JOIN_RESULT_STATE: RouteWithState = {
  path: "/product/P001/join/4",
  state: {
    productId: "P001",
    productName: "코어 정기예금",
    category: "정기예금",
    newAccountNo: "110774213980",
    amount: 5_000_000,
    termMonths: 12,
    maturityDate: "2027-07-31",
    rate: 3.85,
  },
}

/** C-05 인증 완료 후 정상 진입한 상태. */
export const Default: Story = {
  parameters: { route: JOIN_RESULT_STATE },
}

/** C-05를 거치지 않고 바로 진입했을 때 — 가입 결과가 없어 안내 문구만 표시한다. */
export const DirectEntry: Story = {}
