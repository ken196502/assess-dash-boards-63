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
import { DeleteDialogState } from "./types"

interface DeleteDialogProps {
  deleteDialog: DeleteDialogState
  onOpenChange: (open: boolean) => void
  onConfirmDelete: () => void
}

export function DeleteDialog({
  deleteDialog,
  onOpenChange,
  onConfirmDelete
}: DeleteDialogProps) {
  return (
    <AlertDialog open={deleteDialog.open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            删除后无法恢复，确定删除吗？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete} className="bg-red-600 hover:bg-red-700">
            确定删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}