
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ScoreDialogProps {
  score?: number
  remark?: string
  onScoreChange: (score: number, remark: string) => void
  children: React.ReactNode
  disabled?: boolean
}

export function ScoreDialog({ score, remark, onScoreChange, children, disabled = false }: ScoreDialogProps) {
  const [open, setOpen] = useState(false)
  const [tempScore, setTempScore] = useState(score?.toString() || "")
  const [tempRemark, setTempRemark] = useState(remark || "")

  const handleSave = () => {
    const numScore = parseFloat(tempScore)
    if (!isNaN(numScore) && numScore >= -999 && numScore <= 120) {
      onScoreChange(numScore, tempRemark)
      setOpen(false)
    }
  }

  const handleCancel = () => {
    setTempScore(score?.toString() || "")
    setTempRemark(remark || "")
    setOpen(false)
  }

  if (disabled) {
    return children
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>输入评估分数</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="score">分数 (负数或0-120分)</Label>
            <Input
              id="score"
              type="number"
              min="-999"
              max="120"
              step="0.1"
              value={tempScore}
              onChange={(e) => setTempScore(e.target.value)}
              placeholder="请输入分数"
            />
            <p className="text-sm text-muted-foreground">负数不乘以权重</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Textarea
              id="remark"
              value={tempRemark}
              onChange={(e) => setTempRemark(e.target.value)}
              placeholder="请输入备注"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
