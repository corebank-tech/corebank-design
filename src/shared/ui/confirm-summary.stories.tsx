import type { Meta, StoryObj } from "@storybook/react-vite"
import { ConfirmSummary } from "@/shared/ui/confirm-summary"
import { formatAccountNo, formatAmount } from "@/shared/lib/format"

const meta = {
  title: "shared/ui/ConfirmSummary",
  component: ConfirmSummary,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ConfirmSummary>

export default meta
type Story = StoryObj<typeof meta>

export const TransferReview: Story = {
  args: {
    columns: [
      { label: "받는분", value: "홍길동" },
      { label: "받는분 계좌번호", value: formatAccountNo("110632892336") },
      {
        label: "이체금액(원)",
        value: formatAmount(500_000, { suffix: false }),
        emphasis: true,
      },
    ],
  },
}
