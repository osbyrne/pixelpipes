import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface BlurDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (radius: number) => void;
  onCancel: () => void;
}

export const BlurDialog: React.FC<BlurDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel
}) => {
  const [radius, setRadius] = useState(5);

  const handleConfirm = () => {
    onConfirm(radius);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Blur Settings</DialogTitle>
          <DialogDescription>
            Adjust the blur radius to control the strength of the blur effect.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="radius">Blur Radius: {radius}px</Label>
            <Slider
              id="radius"
              min={0}
              max={20}
              step={0.5}
              value={[radius]}
              onValueChange={(value) => setRadius(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0px (No blur)</span>
              <span>20px (Heavy blur)</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Apply Blur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};