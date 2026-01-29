import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "./label"
import { Input } from "./input"

const meta: Meta<typeof Label> = {
  title: "Atoms/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Label text",
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="name">Your name</Label>
      <Input type="text" id="name" placeholder="Enter your name" />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">
        Email <span className="text-destructive">*</span>
      </Label>
      <Input type="email" id="email" placeholder="Email" required />
    </div>
  ),
}
