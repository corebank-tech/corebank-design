import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "@/shared/ui/checkbox"

const meta = {
  title: "shared/ui/Checkbox",
  component: Checkbox,
  args: { label: "전체 약관에 동의합니다" },
  argTypes: {
    label: {
      control: "text",
      description: "체크박스 오른쪽에 표시되는 라벨.",
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }
