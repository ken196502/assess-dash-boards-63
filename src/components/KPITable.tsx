
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Trash2, UserPlus, X, ChevronUp, ChevronDown, Copy } from "lucide-react"
import { KPI, Department, Evaluator } from "@/types/assessment"
import { ScoreDialog } from "./ScoreDialog"

interface KPITableProps {
  department: Department
  isEditing: boolean
  onUpdateKPI: (kpiId: string, field: keyof KPI, value: string | number) => void
  onUpdateEvaluator: (kpiId: string, evaluatorId: string, field: keyof Evaluator, value: string | number) => void
  onAddEvaluator: (kpiId: string) => void
  onRemoveEvaluator: (kpiId: string, evaluatorId: string) => void
  onAddKPI: () => void
  onRemoveKPI: (kpiId: string) => void
  onUpdateDepartment: (field: keyof Department, value: string) => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onRemoveDepartment: () => void
  onCopyDepartment: () => void
  canRemoveDepartment: boolean
  onMoveEvaluator: (kpiId: string, evaluatorId: string, direction: 'up' | 'down') => void
}

export function KPITable({
  department,
  isEditing,
  onUpdateKPI,
  onUpdateEvaluator,
  onAddEvaluator,
  onRemoveEvaluator,
  onAddKPI,
  onRemoveKPI,
  onUpdateDepartment,
  onEdit,
  onSave,
  onCancel,
  onRemoveDepartment,
  onCopyDepartment,
  canRemoveDepartment,
  onMoveEvaluator
}: KPITableProps) {
  // 计算加权总分 - 真正按权重计算
  const calculateWeightedScore = () => {
    let totalScore = 0
    let hasAnyScore = false

    department.kpis.forEach(kpi => {
      let kpiWeightedScore = 0
      let kpiTotalWeight = 0
      let kpiHasScore = false

      kpi.evaluators.forEach(evaluator => {
        if (evaluator.score !== undefined) {
          const weight = parseFloat(evaluator.weight.replace('%', '')) / 100
          if (!isNaN(weight)) {
            kpiWeightedScore += evaluator.score * weight
            kpiTotalWeight += weight
            kpiHasScore = true
          }
        }
      })

      if (kpiHasScore && kpiTotalWeight > 0) {
        totalScore += kpiWeightedScore
        hasAnyScore = true
      }
    })

    return hasAnyScore ? totalScore.toFixed(1) : '--'
  }

  // 检查是否可以填写评分（顺序限制）
  const canFillScore = (kpiIndex: number, evaluatorIndex: number) => {
    // 检查前面的KPI是否都已完成评分
    for (let i = 0; i < kpiIndex; i++) {
      const prevKpi = department.kpis[i]
      for (const evaluator of prevKpi.evaluators) {
        if (evaluator.score === undefined) {
          return false
        }
      }
    }

    // 检查当前KPI前面的评价人是否都已完成评分
    const currentKpi = department.kpis[kpiIndex]
    for (let i = 0; i < evaluatorIndex; i++) {
      if (currentKpi.evaluators[i].score === undefined) {
        return false
      }
    }

    return true
  }

  return (
    <>
      <Table className="border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">类别</TableHead>
            <TableHead className="w-[15%]">说明</TableHead>
            <TableHead className="w-[12%]">指标</TableHead>
            <TableHead className="w-[10%]">要求/目标</TableHead>
            <TableHead className="w-[15%] text-right">评价人</TableHead>
            <TableHead className="w-[15%]">口径说明</TableHead>
            <TableHead className="w-[8%]">权重</TableHead>
            <TableHead className="w-[10%]">评估分数</TableHead>
            {isEditing && <TableHead className="w-[10%]">操作</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {department.kpis.map((kpi, kpiIndex) => (
            <TableRow key={kpi.id}>
              {/* 类别列 - 只在第一行显示 */}
              {kpiIndex === 0 && (
                <TableCell rowSpan={department.kpis.length} className="align-top border-r">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={department.name}
                        onChange={(e) => onUpdateDepartment("name", e.target.value)}
                        className="text-lg font-bold"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={onSave} className="bg-green-600 hover:bg-green-700">
                          保存
                        </Button>
                        <Button size="sm" variant="outline" onClick={onCancel}>
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-lg font-bold text-gray-900">{department.name}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={onEdit}>
                          编辑
                        </Button>
                        <Button size="sm" variant="outline" onClick={onCopyDepartment}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        {canRemoveDepartment && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={onRemoveDepartment}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </TableCell>
              )}
              
              {/* 说明列 - 只在第一行显示 */}
              {kpiIndex === 0 && (
                <TableCell rowSpan={department.kpis.length} className="align-top border-r">
                  {isEditing ? (
                    <Textarea
                      value={department.description}
                      onChange={(e) => onUpdateDepartment("description", e.target.value)}
                      className="text-sm"
                      rows={3}
                    />
                  ) : (
                    <div className="text-sm text-gray-600">{department.description}</div>
                  )}
                </TableCell>
              )}

              {/* 指标列 */}
              <TableCell className="font-medium">
                {isEditing ? (
                  <Input
                    value={kpi.name}
                    onChange={(e) => onUpdateKPI(kpi.id, "name", e.target.value)}
                    className="border-0 p-0 h-auto focus-visible:ring-0"
                  />
                ) : (
                  kpi.name
                )}
              </TableCell>

              {/* 要求/目标列 */}
              <TableCell>
                {isEditing ? (
                  <Input
                    value={kpi.target}
                    onChange={(e) => onUpdateKPI(kpi.id, "target", e.target.value)}
                    className="border-0 p-0 h-auto focus-visible:ring-0"
                  />
                ) : (
                  <span className="font-medium text-green-600">{kpi.target}</span>
                )}
              </TableCell>

              {/* 评价人列 */}
              <TableCell className="text-right">
                {isEditing ? (
                  <div className="space-y-2">
                    {kpi.evaluators.map((evaluator, evalIndex) => (
                      <div key={evaluator.id} className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onMoveEvaluator(kpi.id, evaluator.id, 'up')}
                            disabled={evalIndex === 0}
                            className="h-4 w-4 p-0"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onMoveEvaluator(kpi.id, evaluator.id, 'down')}
                            disabled={evalIndex === kpi.evaluators.length - 1}
                            className="h-4 w-4 p-0"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input
                          value={evaluator.name}
                          onChange={(e) => onUpdateEvaluator(kpi.id, evaluator.id, "name", e.target.value)}
                          placeholder="评价人"
                          className="flex-1 text-right"
                        />
                        {kpi.evaluators.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveEvaluator(kpi.id, evaluator.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddEvaluator(kpi.id)}
                      className="w-full h-8 text-xs"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      添加评价人
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {kpi.evaluators.map((evaluator) => (
                      <div key={evaluator.id} className="text-sm">
                        {evaluator.name}
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>

              {/* 口径说明列 */}
              <TableCell>
                {isEditing ? (
                  <Textarea
                    value={kpi.description}
                    onChange={(e) => onUpdateKPI(kpi.id, "description", e.target.value)}
                    className="min-h-[60px]"
                    placeholder="输入口径说明"
                  />
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-sm text-gray-700 line-clamp-2 cursor-help">
                        {kpi.description}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-sm">{kpi.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TableCell>

              {/* 权重列 */}
              <TableCell>
                {isEditing ? (
                  <div className="space-y-2">
                    {kpi.evaluators.map((evaluator) => (
                      <Input
                        key={evaluator.id}
                        value={evaluator.weight}
                        onChange={(e) => onUpdateEvaluator(kpi.id, evaluator.id, "weight", e.target.value)}
                        placeholder="权重"
                        className="w-full"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {kpi.evaluators.map((evaluator) => (
                      <div key={evaluator.id} className="text-sm font-medium text-blue-600">
                        {evaluator.weight}
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>

              {/* 评估分数列 */}
              <TableCell>
                <div className="space-y-1">
                  {kpi.evaluators.map((evaluator, evalIndex) => {
                    const canFill = canFillScore(kpiIndex, evalIndex)
                    return (
                      <ScoreDialog
                        key={evaluator.id}
                        score={evaluator.score}
                        onScoreChange={(score) => onUpdateEvaluator(kpi.id, evaluator.id, "score", score)}
                        disabled={!canFill}
                      >
                        <Button
                          variant="ghost"
                          className={`h-8 px-2 text-sm font-medium w-full ${
                            canFill 
                              ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" 
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!canFill}
                        >
                          {evaluator.score !== undefined ? evaluator.score.toFixed(1) : '--'}
                        </Button>
                      </ScoreDialog>
                    )
                  })}
                </div>
              </TableCell>

              {/* 操作列 */}
              {isEditing && (
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveKPI(kpi.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
          {/* 总分行 */}
          <TableRow className="bg-blue-50 font-medium">
            <TableCell colSpan={isEditing ? 7 : 6} className="text-right text-blue-800">
              按权重计算总分：
            </TableCell>
            <TableCell className="text-blue-800 font-bold">
              {calculateWeightedScore()}
            </TableCell>
            {isEditing && <TableCell></TableCell>}
          </TableRow>
        </TableBody>
      </Table>
      {isEditing && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={onAddKPI}
            className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加新指标
          </Button>
        </div>
      )}
    </>
  )
}
