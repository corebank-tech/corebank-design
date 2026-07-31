import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/shared/ui/button"

const meta = {
  title: "shared/ui/Button",
  component: Button,
  args: { children: "이체하기" },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: "primary" } }
export const Secondary: Story = { args: { variant: "secondary" } }
export const Outline: Story = { args: { variant: "outline" } }
export const Ghost: Story = { args: { variant: "ghost" } }
export const Danger: Story = {
  args: { variant: "danger", children: "해지하기" },
}
export const Disabled: Story = { args: { variant: "primary", disabled: true } }

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
    </div>
  ),
}
