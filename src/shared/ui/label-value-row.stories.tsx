import type { Meta, StoryObj } from "@storybook/react-vite"
import { LabelValueRow } from "@/shared/ui/label-value-row"

const meta = {
  title: "shared/ui/LabelValueRow",
  parameters: { layout: "padded" },
} satisfies Meta<typeof LabelValueRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-100">
      <LabelValueRow label="최근 접속일시" value="2026.07.23 08:57:34" />
    </div>
  ),
}

export const List: Story = {
  render: () => (
    <div className="flex w-100 flex-col border border-border">
      <LabelValueRow label="최근 접속일시" value="2026.07.23 08:57:34" />
      <LabelValueRow label="접속 IP" value="203.245.11.87" />
      <LabelValueRow label="최근 거래일시" value="2026.07.23 08:41:02" />
    </div>
  ),
}
