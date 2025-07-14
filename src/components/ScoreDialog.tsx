
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ScoreDialogProps {
  score?: number
  onScoreChange: (score: number) => void
  children: React.ReactNode
  disabled?: boolean
}

export function ScoreDialog({ score, onScoreChange, children, disabled = false }: ScoreDialogProps) {
  const [open, setOpen] = useState(false)
  const [tempScore, setTempScore] = useState(score?.toString() || "")

  const handleSave = () => {
    const numScore = parseFloat(tempScore)
    if (!isNaN(numScore) && numScore >= 0 && numScore <= 120) {
      onScoreChange(numScore)
      setOpen(false)
    }
  }

  const handleCancel = () => {
    setTempScore(score?.toString() || "")
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
            <Label htmlFor="score">分数 (0-120分)</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="120"
              step="0.1"
              value={tempScore}
              onChange={(e) => setTempScore(e.target.value)}
              placeholder="请输入分数"
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
