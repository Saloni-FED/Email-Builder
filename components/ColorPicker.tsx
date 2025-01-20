import React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

const colors = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#808080",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
]

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[80px] h-[30px] p-0" style={{ backgroundColor: color }} />
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((c) => (
            <Button
              key={c}
              className="w-8 h-8 rounded-full p-0"
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

