import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { FormField } from "./FormField"

const meta: Meta<typeof FormField> = {
  title: "Molecules/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    required: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Username",
    name: "username",
    placeholder: "Enter your username",
    value: "",
    onChange: () => {},
  },
}

export const Email: Story = {
  args: {
    label: "Email Address",
    name: "email",
    type: "email",
    placeholder: "you@example.com",
    value: "",
    onChange: () => {},
  },
}

export const Password: Story = {
  args: {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter password",
    value: "",
    onChange: () => {},
  },
}

export const Number: Story = {
  args: {
    label: "Price",
    name: "price",
    type: "number",
    placeholder: "0.00",
    step: "0.01",
    min: "0",
    value: "",
    onChange: () => {},
  },
}

export const Required: Story = {
  args: {
    label: "Required Field",
    name: "required",
    placeholder: "This field is required",
    required: true,
    value: "",
    onChange: () => {},
  },
}

export const Interactive: Story = {
  render: function InteractiveFormField() {
    const [value, setValue] = useState("")
    return (
      <div className="w-[300px]">
        <FormField
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <p className="mt-2 text-sm text-muted-foreground">
            Current value: {value}
          </p>
        )}
      </div>
    )
  },
}

export const FormExample: Story = {
  render: function FormExample() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      price: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
      <div className="w-[350px] space-y-4">
        <FormField
          label="Product Name"
          name="name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Contact Email"
          name="email"
          type="email"
          placeholder="contact@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        <FormField
          label="Price"
          name="price"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
    )
  },
}
