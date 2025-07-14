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

interface AlphaThresholdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (whiteThreshold: number, blackThreshold: number) => void
  onCancel: () => void
}

export function AlphaThresholdDialog({ open, onOpenChange, onConfirm, onCancel }: AlphaThresholdDialogProps) {
  const [whiteThreshold, setWhiteThreshold] = useState([200])
  const [blackThreshold, setBlackThreshold] = useState([100])

  const handleConfirm = () => {
    onConfirm(whiteThreshold[0], blackThreshold[0])
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
          <DialogTitle>Alpha Threshold</DialogTitle>
          <DialogDescription>
            Set thresholds for converting semi-transparent pixels to white or black based on their alpha values.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="white-threshold-slider">
              White Threshold: {whiteThreshold[0]}
            </Label>
            <Slider
              id="white-threshold-slider"
              min={0}
              max={255}
              step={1}
              value={whiteThreshold}
              onValueChange={setWhiteThreshold}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Pixels with alpha ≥ this value become white
            </p>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="black-threshold-slider">
              Black Threshold: {blackThreshold[0]}
            </Label>
            <Slider
              id="black-threshold-slider"
              min={0}
              max={255}
              step={1}
              value={blackThreshold}
              onValueChange={setBlackThreshold}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Pixels with alpha ≤ this value become black
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