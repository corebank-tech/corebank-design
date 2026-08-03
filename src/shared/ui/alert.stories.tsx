import type { Meta, StoryObj } from "@storybook/react-vite"
import { Alert } from "@/shared/ui/alert"

const meta = {
  title: "shared/ui/Alert",
  component: Alert,
  args: { children: "입력하신 정보를 다시 확인해 주세요." },
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
      description:
        "안내 톤. 실 화면에서는 success·danger만 쓴다(폼 검증 안내).",
    },
    title: {
      control: "text",
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = { args: { variant: "info", title: "안내" } }
export const Success: Story = {
  args: {
    variant: "success",
    title: "완료",
    children: "이체가 완료되었습니다.",
  },
}
export const Warning: Story = {
  args: {
    variant: "warning",
    title: "주의",
    children: "1일 이체한도에 근접했습니다.",
  },
}
export const Danger: Story = {
  args: {
    variant: "danger",
    title: "오류",
    children: "비밀번호가 일치하지 않습니다.",
  },
}
