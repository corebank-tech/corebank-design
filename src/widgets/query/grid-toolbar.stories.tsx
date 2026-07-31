import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { GridToolbar } from "@/widgets/query/grid-toolbar"

type GridToolbarDemoProps = React.ComponentProps<typeof GridToolbar>

function GridToolbarDemo(props: GridToolbarDemoProps) {
  const [pageSize, setPageSize] = React.useState(props.pageSize)
  return (
    <div className="w-240">
      <GridToolbar
        {...props}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}

const meta = {
  title: "widgets/query/GridToolbar",
  component: GridToolbarDemo,
  args: {
    totalCount: 42,
    pageSize: 10,
    periodLabel: "2026.06.23 ~ 2026.07.23",
    baseTimeLabel: "2026.07.23 08:57:34",
  },
} satisfies Meta<typeof GridToolbarDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutPeriod: Story = {
  args: { periodLabel: undefined, totalCount: 7 },
}
