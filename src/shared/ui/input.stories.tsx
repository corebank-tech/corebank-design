import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "@/shared/ui/input"

const DEMO_ACCOUNT_NO = "110-234-567890"

const meta = {
  title: "shared/ui/Input",
  component: Input,
  args: { placeholder: "계좌번호를 입력하세요" },
  argTypes: {
    invalid: {
      control: "boolean",
      description: "검증 실패 상태. 보더·포커스 링을 danger 톤으로 바꾼다.",
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: DEMO_ACCOUNT_NO } }
export const Invalid: Story = {
  args: { invalid: true, defaultValue: DEMO_ACCOUNT_NO.slice(0, 7) },
}
export const Disabled: Story = {
  args: { disabled: true, defaultValue: DEMO_ACCOUNT_NO },
}
