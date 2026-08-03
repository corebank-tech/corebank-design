import type { Meta, StoryObj } from "@storybook/react-vite"
import { Divider } from "@/shared/ui/divider"

const meta = {
  title: "shared/ui/Divider",
  component: Divider,
  argTypes: {
    tone: {
      control: "select",
      options: ["border-strong", "ink-faint", "footer-divider"],
      description: "구분선 색. 헤더·푸터 등 배경 톤에 맞춰 고른다.",
    },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const InContext: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-ink-muted">
      <span>이용약관</span>
      <Divider tone="border-strong" />
      <span>개인정보처리방침</span>
      <Divider tone="ink-faint" />
      <span>고객센터</span>
    </div>
  ),
}
