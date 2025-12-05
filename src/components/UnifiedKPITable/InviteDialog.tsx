import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { InviteDialogState } from "./types"

interface InviteDialogProps {
  inviteDialog: InviteDialogState
  onOpenChange: (open: boolean) => void
  onConfirmInvite: () => void
  onUpdateDialog: (updates: Partial<InviteDialogState>) => void
}

export function InviteDialog({
  inviteDialog,
  onOpenChange,
  onConfirmInvite,
  onUpdateDialog
}: InviteDialogProps) {
  return (
    <AlertDialog open={inviteDialog.open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认邀请</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-3">
              <p>确定邀请 <span className="font-medium">{inviteDialog.name}</span> 进行评价吗？</p>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inviteDialog.markAllSameName}
                  onChange={(e) => onUpdateDialog({ markAllSameName: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">同时标记所有"{inviteDialog.name}"的评估为已邀请</span>
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmInvite}>
            确定发送
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}