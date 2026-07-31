import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Pagination } from "@/shared/ui/pagination"

type PaginationDemoProps = {
  totalPages: number
}

function PaginationDemo({ totalPages }: PaginationDemoProps) {
  const [page, setPage] = React.useState(1)
  return (
    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
  )
}

const meta = {
  title: "shared/ui/Pagination",
  parameters: { layout: "padded" },
} satisfies Meta<typeof PaginationDemo>

export default meta
type Story = StoryObj<typeof meta>

export const MultiplePages: Story = {
  render: () => <PaginationDemo totalPages={24} />,
}

export const SinglePage: Story = {
  render: () => <PaginationDemo totalPages={1} />,
}
