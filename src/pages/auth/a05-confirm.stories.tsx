import type { Meta, StoryObj } from "@storybook/react-vite"
import { PageShell } from "@/app/page-shell"
import { A05Confirm } from "@/pages/auth/a05-confirm"
import type { SignupData } from "@/pages/auth/signup-shared"
import { WithGuestPage } from "../../../.storybook/decorators/page-providers"

const MOCK_DATA: SignupData = {
  name: "홍길동",
  birth: "900101",
  phone: "01012345678",
  email: "hong@corebank.com",
  userId: "honggildong",
  password: "Password1!",
}

const meta = {
  title: "pages/A05 회원가입 4단계",
  decorators: [WithGuestPage],
  parameters: { layout: "fullscreen" },
  render: () => (
    <PageShell breadcrumb={["홈", "로그인", "회원가입"]}>
      <A05Confirm data={MOCK_DATA} onEdit={() => {}} onComplete={() => {}} />
    </PageShell>
  ),
} satisfies Meta<typeof A05Confirm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
