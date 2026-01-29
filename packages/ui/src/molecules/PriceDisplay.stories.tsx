import type { Meta, StoryObj } from "@storybook/react"
import { PriceDisplay } from "./PriceDisplay"

const meta: Meta<typeof PriceDisplay> = {
  title: "Molecules/PriceDisplay",
  component: PriceDisplay,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    amount: {
      control: "number",
    },
    currency: {
      control: "select",
      options: ["USD", "EUR", "GBP", "JPY", "CAD"],
    },
    locale: {
      control: "select",
      options: ["en-US", "en-GB", "de-DE", "fr-FR", "ja-JP"],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    amount: 99.99,
  },
}

export const LargeAmount: Story = {
  args: {
    amount: 1234567.89,
  },
}

export const SmallAmount: Story = {
  args: {
    amount: 0.99,
  },
}

export const Euro: Story = {
  args: {
    amount: 49.99,
    currency: "EUR",
    locale: "de-DE",
  },
}

export const BritishPound: Story = {
  args: {
    amount: 79.99,
    currency: "GBP",
    locale: "en-GB",
  },
}

export const JapaneseYen: Story = {
  args: {
    amount: 15000,
    currency: "JPY",
    locale: "ja-JP",
  },
}

export const WithCustomClass: Story = {
  args: {
    amount: 299.99,
    className: "text-2xl font-bold text-primary",
  },
}

export const InContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <span>Laptop</span>
        <PriceDisplay amount={999.99} className="font-bold" />
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <span>Mouse</span>
        <PriceDisplay amount={29.99} className="font-bold" />
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <span>Keyboard</span>
        <PriceDisplay amount={79.99} className="font-bold" />
      </div>
      <div className="flex items-center justify-between p-4 border-t-2 pt-4">
        <span className="font-semibold">Total</span>
        <PriceDisplay amount={1109.97} className="text-xl font-bold text-primary" />
      </div>
    </div>
  ),
}

export const PriceComparison: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <PriceDisplay amount={149.99} className="line-through text-muted-foreground" />
      <PriceDisplay amount={99.99} className="text-xl font-bold text-destructive" />
    </div>
  ),
}
