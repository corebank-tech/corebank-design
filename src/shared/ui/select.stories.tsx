import type { Meta, StoryObj } from "@storybook/react-vite"
import { Select } from "@/shared/ui/select"

const meta = {
  title: "shared/ui/Select",
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const Options = () => (
  <>
    <option value="all">전체</option>
    <option value="deposit">입금</option>
    <option value="withdraw">출금</option>
  </>
)

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <Options />
    </Select>
  ),
}

export const Invalid: Story = {
  args: { invalid: true },
  render: (args) => (
    <Select {...args}>
      <Options />
    </Select>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Select {...args}>
      <Options />
    </Select>
  ),
}
