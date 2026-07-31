import type { Meta, StoryObj } from "@storybook/react-vite"
import { X } from "lucide-react"
import { IconButton } from "@/shared/ui/icon-button"

const meta = {
  title: "shared/ui/IconButton",
  component: IconButton,
  args: {
    "aria-label": "닫기",
    className: "border border-border-strong text-ink-muted hover:bg-surface",
    children: <X className="h-4 w-4" aria-hidden="true" />,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Square: Story = { args: { shape: "square" } }
export const Circle: Story = { args: { shape: "circle" } }

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <IconButton {...args} size="sm" />
      <IconButton {...args} size="md" />
      <IconButton {...args} size="lg" />
    </div>
  ),
}
