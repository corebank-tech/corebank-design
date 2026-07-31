import type { Meta, StoryObj } from "@storybook/react-vite"
import { CollapsibleSection } from "@/shared/ui/collapsible-section"
import { LabelValueRow } from "@/shared/ui/label-value-row"
import { formatAccountNo, formatDate } from "@/shared/lib/format"

const meta = {
  title: "shared/ui/CollapsibleSection",
  parameters: { layout: "padded" },
} satisfies Meta<typeof CollapsibleSection>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  render: () => (
    <div className="w-160">
      <CollapsibleSection title="계좌정보">
        <LabelValueRow
          label="계좌번호"
          value={formatAccountNo("110632892336")}
        />
        <LabelValueRow label="개설일" value={formatDate("2021-03-14")} />
      </CollapsibleSection>
    </div>
  ),
}

export const Closed: Story = {
  render: () => (
    <div className="w-160">
      <CollapsibleSection title="계좌정보" defaultOpen={false}>
        <LabelValueRow
          label="계좌번호"
          value={formatAccountNo("110632892336")}
        />
      </CollapsibleSection>
    </div>
  ),
}
