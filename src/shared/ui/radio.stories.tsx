import type { Meta, StoryObj } from "@storybook/react-vite"
import { Radio } from "@/shared/ui/radio"

const meta = {
  title: "shared/ui/Radio",
  component: Radio,
  args: { name: "period", label: "1개월" },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }

export const Group: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Radio name="period-group" label="1개월" defaultChecked />
      <Radio name="period-group" label="3개월" />
      <Radio name="period-group" label="6개월" />
      <Radio name="period-group" label="12개월" />
    </div>
  ),
}
