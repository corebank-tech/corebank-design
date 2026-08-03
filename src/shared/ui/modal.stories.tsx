import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Modal } from "@/shared/ui/modal"
import { Button } from "@/shared/ui/button"

type ModalDemoProps = {
  tone: React.ComponentProps<typeof Modal>["tone"]
  title: string
  triggerLabel: string
}

function ModalDemo({ tone, title, triggerLabel }: ModalDemoProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        tone={tone}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setOpen(false)}>확인</Button>
          </>
        }
      >
        <p className="text-base text-ink">이 작업을 진행하시겠습니까?</p>
      </Modal>
    </>
  )
}

const meta = {
  title: "shared/ui/Modal",
  component: ModalDemo,
  parameters: { layout: "fullscreen" },
  args: { tone: "primary", title: "확인", triggerLabel: "모달 열기" },
  argTypes: {
    tone: {
      control: "select",
      options: ["primary", "danger"],
      description: "타이틀바 색. danger는 해지·삭제 등 위험 동작 확인에 쓴다.",
    },
  },
} satisfies Meta<typeof ModalDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: () => (
    <ModalDemo tone="primary" title="출금계좌 삭제" triggerLabel="모달 열기" />
  ),
}

export const Danger: Story = {
  render: () => (
    <ModalDemo
      tone="danger"
      title="상품 해지"
      triggerLabel="모달 열기 (danger)"
    />
  ),
}
