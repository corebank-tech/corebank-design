import type { Meta, StoryObj } from "@storybook/react-vite"
import { Chip } from "@/shared/ui/chip"

const meta = {
  title: "shared/ui/Chip",
  component: Chip,
  args: { children: "1개월" },
  argTypes: {
    tone: {
      control: "select",
      options: ["default", "active", "primary", "primary-tint", "muted"],
      description:
        "화면마다 실제 쓰이던 색 조합을 그대로 옮긴 톤 — 새 톤을 추가하지 않는다.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "화면별로 실제 쓰이던 높이·패딩 조합(h-7/h-8/h-9).",
    },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { tone: "default" } }
export const Active: Story = { args: { tone: "active" } }
export const Primary: Story = { args: { tone: "primary" } }
export const PrimaryTint: Story = { args: { tone: "primary-tint" } }
export const Muted: Story = { args: { tone: "muted" } }

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Chip {...args} size="sm" />
      <Chip {...args} size="md" />
      <Chip {...args} size="lg" />
    </div>
  ),
}
