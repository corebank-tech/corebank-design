import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "@/shared/ui/badge"

const meta = {
  title: "shared/ui/Badge",
  component: Badge,
  args: { children: "정상" },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: "primary" } }
export const Neutral: Story = { args: { variant: "neutral", children: "해지" } }
export const Success: Story = { args: { variant: "success" } }
export const Danger: Story = { args: { variant: "danger", children: "실패" } }
export const Warning: Story = { args: { variant: "warning", children: "대기" } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="primary">정상</Badge>
      <Badge variant="neutral">해지</Badge>
      <Badge variant="success">완료</Badge>
      <Badge variant="danger">실패</Badge>
      <Badge variant="warning">대기</Badge>
    </div>
  ),
}
