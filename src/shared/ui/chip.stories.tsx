import type { Meta, StoryObj } from "@storybook/react-vite"
import { Chip } from "@/shared/ui/chip"

const meta = {
  title: "shared/ui/Chip",
  component: Chip,
  args: { children: "1개월" },
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
