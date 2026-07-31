import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "@/shared/ui/input"

const meta = {
  title: "shared/ui/Input",
  component: Input,
  args: { placeholder: "계좌번호를 입력하세요" },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: "110-234-567890" } }
export const Invalid: Story = {
  args: { invalid: true, defaultValue: "110-234" },
}
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "110-234-567890" },
}
