import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/shared/ui/button"

const meta = {
  title: "shared/ui/Button",
  component: Button,
  args: { children: "이체하기" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
      description: "버튼의 강조 수준. primary는 화면당 핵심 동작 1개에만 쓴다.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "버튼 높이. size 키는 반응형 클래스 금지 규칙의 예외다.",
    },
    fullWidth: {
      control: "boolean",
      description: "너비를 부모 컨테이너에 꽉 채운다.",
    },
    disabled: {
      control: "boolean",
    },
  },
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

const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "danger",
] as const
const BUTTON_SIZES = ["sm", "md", "lg"] as const

export const AllVariants: Story = {
  name: "전체 조합 (variant × size)",
  render: () => (
    <table className="border-collapse">
      <thead>
        <tr>
          <th className="p-2" />
          {BUTTON_SIZES.map((size) => (
            <th key={size} className="p-2 text-left text-xs text-ink-faint">
              {size}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {BUTTON_VARIANTS.map((variant) => (
          <tr key={variant}>
            <th className="p-2 text-left text-xs text-ink-faint">{variant}</th>
            {BUTTON_SIZES.map((size) => (
              <td key={size} className="p-2">
                <Button variant={variant} size={size}>
                  이체하기
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
