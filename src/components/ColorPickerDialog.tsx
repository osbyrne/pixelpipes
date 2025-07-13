import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface ColorPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (color: string, tolerance: number) => void
  onCancel: () => void
}

export function ColorPickerDialog({ open, onOpenChange, onConfirm, onCancel }: ColorPickerDialogProps) {
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [tolerance, setTolerance] = useState([30])

  const handleConfirm = () => {
    onConfirm(selectedColor, tolerance[0])
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Color to Alpha</DialogTitle>
          <DialogDescription>
            Select the color you want to make transparent. Similar colors within the tolerance range will also become transparent.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="color-picker">Target Color</Label>
            <div className="flex items-center gap-3">
              <input
                id="color-picker"
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-16 h-16 rounded-lg border border-border cursor-pointer"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="tolerance-slider">
              Tolerance: {tolerance[0]}
            </Label>
            <Slider
              id="tolerance-slider"
              min={0}
              max={100}
              step={1}
              value={tolerance}
              onValueChange={setTolerance}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Higher values make more similar colors transparent
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Apply Effect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}