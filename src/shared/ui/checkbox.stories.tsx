import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "@/shared/ui/checkbox"

const meta = {
  title: "shared/ui/Checkbox",
  component: Checkbox,
  args: { label: "전체 약관에 동의합니다" },
  parameters: {
    docs: {
      description: {
        component:
          "독립적으로 켜고 끌 수 있는 단일 선택 컨트롤. 약관 동의, 옵션 선택 등 값이 참/거짓 하나로 결정되는 항목에 쓴다.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "체크박스 오른쪽에 표시되는 라벨.",
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: "선택되지 않은 기본 상태." },
    },
  },
}
export const Checked: Story = {
  args: { defaultChecked: true },
  parameters: {
    docs: {
      description: {
        story: "선택된 상태. 체크 아이콘과 primary 색으로 표시한다.",
      },
    },
  },
}
export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          "조건 미충족 등으로 값을 바꿀 수 없을 때 쓴다. 필수 약관처럼 항상 체크돼 있어야 하는 항목을 잠글 때도 쓴다.",
      },
    },
  },
}
