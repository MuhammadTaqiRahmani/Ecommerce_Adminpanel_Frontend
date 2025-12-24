'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OrderStatus, orderStatusLabels } from '@/types/order';

interface OrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  currentStatus: OrderStatus;
  newStatus: OrderStatus;
  onConfirm: (orderId: string, status: OrderStatus, notes: string) => void;
  isLoading?: boolean;
}

export function OrderStatusDialog({
  open,
  onOpenChange,
  orderId,
  currentStatus,
  newStatus,
  onConfirm,
  isLoading = false,
}: OrderStatusDialogProps) {
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(orderId, newStatus, notes);
    setNotes('');
  };

  const getStatusChangeTitle = () => {
    switch (newStatus) {
      case 'confirmed':
        return 'Confirm Order';
      case 'processing':
        return 'Start Processing';
      case 'shipped':
        return 'Mark as Shipped';
      case 'delivered':
        return 'Mark as Delivered';
      case 'cancelled':
        return 'Cancel Order';
      case 'refunded':
        return 'Refund Order';
      default:
        return 'Update Status';
    }
  };

  const getStatusChangeDescription = () => {
    switch (newStatus) {
      case 'confirmed':
        return 'This will confirm the order and notify the customer that their order has been received.';
      case 'processing':
        return 'This indicates that the order is being prepared for shipment.';
      case 'shipped':
        return 'This will mark the order as shipped. You can add tracking information in the notes.';
      case 'delivered':
        return 'This confirms that the order has been delivered to the customer.';
      case 'cancelled':
        return 'This will cancel the order. This action may trigger a refund process if payment was received.';
      case 'refunded':
        return 'This marks the order as refunded. Make sure the refund has been processed before confirming.';
      default:
        return `Change order status from ${orderStatusLabels[currentStatus]} to ${orderStatusLabels[newStatus]}.`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getStatusChangeTitle()}</DialogTitle>
          <DialogDescription>{getStatusChangeDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Status Change:</span>
            <span className="text-muted-foreground">
              {orderStatusLabels[currentStatus]} → {orderStatusLabels[newStatus]}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              These notes will be recorded in the order history.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant={newStatus === 'cancelled' || newStatus === 'refunded' ? 'destructive' : 'default'}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getStatusChangeTitle()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
