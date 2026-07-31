import type { Meta, StoryObj } from "@storybook/react-vite"
import { SummaryRow } from "@/shared/ui/summary-row"
import { formatAmount } from "@/shared/lib/format"

const meta = {
  title: "shared/ui/SummaryRow",
  component: SummaryRow,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SummaryRow>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    items: [{ label: "입출금계좌 총잔액", value: formatAmount(17_700_500) }],
  },
}

export const Multiple: Story = {
  args: {
    items: [
      { label: "이체건수", value: "12건", numeric: false },
      { label: "이체금액", value: formatAmount(3_240_000) },
      {
        label: "실패건수",
        value: "1건",
        valueColor: "var(--color-danger)",
      },
    ],
  },
}
