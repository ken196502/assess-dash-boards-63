import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Trash2, UserPlus, X, ChevronUp, ChevronDown, Copy, Edit, Save } from "lucide-react"
import { KPI, Category, Evaluator } from "@/types/assessment"
import { ScoreDialog } from "./ScoreDialog"

interface UnifiedKPITableProps {
  categories: Category[]
  editingCategory: string | null
  onEditCategory: (categoryId: string) => void
  onSaveCategory: () => void
  onCancelEdit: () => void
  onUpdateCategory: (categoryId: string, field: keyof Category, value: string) => void
  onUpdateKPI: (categoryId: string, kpiId: string, field: keyof KPI, value: string | number) => void
  onUpdateEvaluator: (categoryId: string, kpiId: string, evaluatorId: string, field: keyof Evaluator, value: string | number) => void
  onAddEvaluator: (categoryId: string, kpiId: string) => void
  onRemoveEvaluator: (categoryId: string, kpiId: string, evaluatorId: string) => void
  onAddKPI: (categoryId: string) => void
  onRemoveKPI: (categoryId: string, kpiId: string) => void
  onRemoveCategory: (categoryId: string) => void
  onCopyCategory: (categoryId: string) => void
  canRemoveCategory: boolean
  onMoveEvaluator: (categoryId: string, kpiId: string, evaluatorId: string, direction: 'up' | 'down') => void
}

export function UnifiedKPITable({
  categories,
  editingCategory,
  onEditCategory,
  onSaveCategory,
  onCancelEdit,
  onUpdateCategory,
  onUpdateKPI,
  onUpdateEvaluator,
  onAddEvaluator,
  onRemoveEvaluator,
  onAddKPI,
  onRemoveKPI,
  onRemoveCategory,
  onCopyCategory,
  canRemoveCategory,
  onMoveEvaluator
}: UnifiedKPITableProps) {
  
  // 计算总加权分数
  const calculateTotalWeightedScore = () => {
    let totalScore = 0
    let hasAnyScore = false

    categories.forEach(category => {
      category.kpis.forEach(kpi => {
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
    })

    return hasAnyScore ? totalScore.toFixed(1) : '--'
  }

  // 检查是否可以填写评分（顺序限制 - 仅在每个指标内）
  const canFillScore = (categoryId: string, kpiId: string, evaluatorIndex: number) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) return false
    
    const kpi = category.kpis.find(k => k.id === kpiId)
    if (!kpi) return false

    // 检查当前KPI前面的评价人是否都已完成评分
    for (let i = 0; i < evaluatorIndex; i++) {
      if (kpi.evaluators[i].score === undefined) {
        return false
      }
    }

    return true
  }

  // 计算所有行数
  const totalRows = categories.reduce((total, category) => {
    return total + category.kpis.reduce((kpiTotal, kpi) => {
      return kpiTotal + Math.max(1, kpi.evaluators.length)
    }, 0)
  }, 0)

  let currentRowIndex = 0

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">类别</TableHead>
              <TableHead className="w-[15%]">说明</TableHead>
              <TableHead className="w-[12%]">指标</TableHead>
              <TableHead className="w-[10%]">要求/目标</TableHead>
              <TableHead className="w-[15%]">口径说明</TableHead>
              <TableHead className="w-[10%] text-right">评价人</TableHead>
              <TableHead className="w-[8%]">权重</TableHead>
              <TableHead className="w-[10%]">评估分数</TableHead>
              <TableHead className="w-[5%]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const categoryRowStart = currentRowIndex
              const categoryRowSpan = category.kpis.reduce((total, kpi) => {
                return total + Math.max(1, kpi.evaluators.length)
              }, 0)
              
              return category.kpis.map((kpi, kpiIndex) => {
                const kpiRowStart = currentRowIndex
                const kpiRowSpan = Math.max(1, kpi.evaluators.length)
                
                return kpi.evaluators.length > 0 ? kpi.evaluators.map((evaluator, evalIndex) => {
                  const row = (
                    <TableRow key={`${kpi.id}-${evaluator.id}`}>
                      {/* 类别列 - 只在类别的第一行显示 */}
                      {currentRowIndex === categoryRowStart && (
                        <TableCell rowSpan={categoryRowSpan} className="align-top border-r">
                          {editingCategory === category.id ? (
                            <div className="space-y-3">
                              <Input
                                value={category.name}
                                onChange={(e) => onUpdateCategory(category.id, "name", e.target.value)}
                                className="text-lg font-bold"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={onSaveCategory} className="bg-green-600 hover:bg-green-700">
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={onCancelEdit}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="text-lg font-bold text-gray-900">{category.name}</div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => onEditCategory(category.id)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => onCopyCategory(category.id)}>
                                  <Copy className="w-4 h-4" />
                                </Button>
                                {canRemoveCategory && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onRemoveCategory(category.id)}
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
                      
                      {/* 说明列 - 只在类别的第一行显示 */}
                      {currentRowIndex === categoryRowStart && (
                        <TableCell rowSpan={categoryRowSpan} className="align-top border-r">
                          {editingCategory === category.id ? (
                            <Textarea
                              value={category.description}
                              onChange={(e) => onUpdateCategory(category.id, "description", e.target.value)}
                              className="text-sm"
                              rows={3}
                            />
                          ) : (
                            <div className="text-sm text-gray-600">{category.description}</div>
                          )}
                        </TableCell>
                      )}

                      {/* 指标列 - 只在KPI的第一行显示 */}
                      {evalIndex === 0 && (
                        <TableCell rowSpan={kpiRowSpan} className="font-medium align-top">
                          {editingCategory === category.id ? (
                            <Input
                              value={kpi.name}
                              onChange={(e) => onUpdateKPI(category.id, kpi.id, "name", e.target.value)}
                              className="border-0 p-0 h-auto focus-visible:ring-0"
                            />
                          ) : (
                            kpi.name
                          )}
                        </TableCell>
                      )}

                      {/* 要求/目标列 - 只在KPI的第一行显示 */}
                      {evalIndex === 0 && (
                        <TableCell rowSpan={kpiRowSpan} className="align-top">
                          {editingCategory === category.id ? (
                            <Input
                              value={kpi.target}
                              onChange={(e) => onUpdateKPI(category.id, kpi.id, "target", e.target.value)}
                              className="border-0 p-0 h-auto focus-visible:ring-0"
                            />
                          ) : (
                            <span className="font-medium text-green-600">{kpi.target}</span>
                          )}
                        </TableCell>
                      )}

                      {/* 口径说明列 - 只在KPI的第一行显示 */}
                      {evalIndex === 0 && (
                        <TableCell rowSpan={kpiRowSpan} className="align-top">
                          {editingCategory === category.id ? (
                            <Textarea
                              value={kpi.description}
                              onChange={(e) => onUpdateKPI(category.id, kpi.id, "description", e.target.value)}
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
                      )}

                      {/* 评价人列 */}
                      <TableCell className="text-right">
                        {editingCategory === category.id ? (
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onMoveEvaluator(category.id, kpi.id, evaluator.id, 'up')}
                                disabled={evalIndex === 0}
                                className="h-4 w-4 p-0"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onMoveEvaluator(category.id, kpi.id, evaluator.id, 'down')}
                                disabled={evalIndex === kpi.evaluators.length - 1}
                                className="h-4 w-4 p-0"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                            <Input
                              value={evaluator.name}
                              onChange={(e) => onUpdateEvaluator(category.id, kpi.id, evaluator.id, "name", e.target.value)}
                              placeholder="评价人"
                              className="flex-1 text-right"
                            />
                            {kpi.evaluators.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onRemoveEvaluator(category.id, kpi.id, evaluator.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm">{evaluator.name}</div>
                        )}
                      </TableCell>

                      {/* 权重列 */}
                      <TableCell>
                        {editingCategory === category.id ? (
                          <Input
                            value={evaluator.weight}
                            onChange={(e) => onUpdateEvaluator(category.id, kpi.id, evaluator.id, "weight", e.target.value)}
                            placeholder="权重"
                            className="w-full"
                          />
                        ) : (
                          <div className="text-sm font-medium text-blue-600">
                            {evaluator.weight}
                          </div>
                        )}
                      </TableCell>

                      {/* 评估分数列 */}
                      <TableCell>
                        {(() => {
                          const canFill = canFillScore(category.id, kpi.id, evalIndex)
                          return (
                            <ScoreDialog
                              score={evaluator.score}
                              onScoreChange={(score) => onUpdateEvaluator(category.id, kpi.id, evaluator.id, "score", score)}
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
                        })()}
                      </TableCell>

                      {/* 操作列 */}
                      <TableCell>
                        {editingCategory === category.id && (
                          <div className="flex gap-1">
                            {evalIndex === kpi.evaluators.length - 1 && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onAddEvaluator(category.id, kpi.id)}
                                  className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  title="添加评价人"
                                >
                                  <UserPlus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onRemoveKPI(category.id, kpi.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="删除指标"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                  currentRowIndex++
                  return row
                }) : [
                  // 处理没有评估人的情况
                  (() => {
                    const row = (
                      <TableRow key={kpi.id}>
                        {/* 类别列 - 只在类别的第一行显示 */}
                        {currentRowIndex === categoryRowStart && (
                          <TableCell rowSpan={categoryRowSpan} className="align-top border-r">
                            {editingCategory === category.id ? (
                              <div className="space-y-3">
                                <Input
                                  value={category.name}
                                  onChange={(e) => onUpdateCategory(category.id, "name", e.target.value)}
                                  className="text-lg font-bold"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={onSaveCategory} className="bg-green-600 hover:bg-green-700">
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={onCancelEdit}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="text-lg font-bold text-gray-900">{category.name}</div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => onEditCategory(category.id)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => onCopyCategory(category.id)}>
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  {canRemoveCategory && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => onRemoveCategory(category.id)}
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
                        
                        {/* 说明列 - 只在类别的第一行显示 */}
                        {currentRowIndex === categoryRowStart && (
                          <TableCell rowSpan={categoryRowSpan} className="align-top border-r">
                            {editingCategory === category.id ? (
                              <Textarea
                                value={category.description}
                                onChange={(e) => onUpdateCategory(category.id, "description", e.target.value)}
                                className="text-sm"
                                rows={3}
                              />
                            ) : (
                              <div className="text-sm text-gray-600">{category.description}</div>
                          )}
                          </TableCell>
                        )}

                        <TableCell className="font-medium">{kpi.name}</TableCell>
                        <TableCell><span className="font-medium text-green-600">{kpi.target}</span></TableCell>
                        <TableCell>{kpi.description}</TableCell>
                        <TableCell className="text-right">--</TableCell>
                        <TableCell>--</TableCell>
                        <TableCell>--</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )
                    currentRowIndex++
                    return row
                  })()
                ]
              })
            })}
            
            {/* 总分行 */}
            <TableRow className="bg-blue-50 font-medium">
              <TableCell colSpan={7} className="text-right text-blue-800">
                按权重计算总分：
              </TableCell>
              <TableCell className="text-blue-800 font-bold">
                {calculateTotalWeightedScore()}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      {editingCategory && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => onAddKPI(editingCategory)}
            className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加新指标
          </Button>
        </div>
      )}
    </div>
  )
}
