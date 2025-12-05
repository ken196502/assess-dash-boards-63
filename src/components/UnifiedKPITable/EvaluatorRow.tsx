import { useState } from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, X, Mail } from "lucide-react"
import { Evaluator, KPI, Category } from "@/types/assessment"
import { calculateEvaluatorWeightSum, isEvaluatorWeightValid } from "./utils"

interface EvaluatorRowProps {
  category: Category
  kpi: KPI
  evaluator: Evaluator
  evalIndex: number
  mode: 'template' | 'usage'
  editingCategory: string | null
  onUpdateEvaluator: (categoryId: string, kpiId: string, evaluatorId: string, field: keyof Evaluator, value: string | number | boolean) => void
  onMoveEvaluator: (categoryId: string, kpiId: string, evaluatorId: string, direction: 'up' | 'down') => void
  onInvite: (categoryId: string, kpiId: string, evaluatorId: string, evaluatorName: string) => void
  onDeleteClick: (type: 'evaluator', id: string, categoryId?: string, kpiId?: string) => void
  forceUpdate: () => void
}

export function EvaluatorRow({
  category,
  kpi,
  evaluator,
  evalIndex,
  mode,
  editingCategory,
  onUpdateEvaluator,
  onMoveEvaluator,
  onInvite,
  onDeleteClick,
  forceUpdate
}: EvaluatorRowProps) {
  return (
    <>
      {/* 评价人列 */}
      <TableCell className="text-right">
        {mode === 'template' && editingCategory === category.id ? (
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
            <div className="flex-1 space-y-1">
              <Input
                value={evaluator.name}
                onChange={(e) => onUpdateEvaluator(category.id, kpi.id, evaluator.id, "name", e.target.value)}
                placeholder="评价人姓名"
                className="text-right"
              />
              {/* <Input
                value={evaluator.position || ''}
                onChange={(e) => onUpdateEvaluator(category.id, kpi.id, evaluator.id, "position", e.target.value)}
                placeholder="职务"
                className="text-right text-xs"
              /> */}
            </div>
            {kpi.evaluators.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteClick('evaluator', evaluator.id, category.id, kpi.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-sm text-right">
            <div className="font-medium">{evaluator.name}</div>
            {evaluator.position && (
              <div className="text-xs text-gray-500 mt-0.5">{evaluator.position}</div>
            )}
          </div>
        )}
      </TableCell>

      {/* 评价人权重列 */}
      <TableCell>
        {mode === 'template' && editingCategory === category.id ? (
          <div className="space-y-1">
            <Input
              type="number"
              min="0"
              max="100"
              value={evaluator.weight.replace('%', '')}
              onChange={(e) => {
                const value = e.target.value
                const numValue = parseInt(value)
                if (value === '' || (numValue >= 0 && numValue <= 100)) {
                  onUpdateEvaluator(category.id, kpi.id, evaluator.id, "weight", value === '' ? '0%' : `${numValue}%`)
                }
              }}
              placeholder="0-100"
              className="w-full"
            />
            {evalIndex === kpi.evaluators.length - 1 && (
              <div className={`text-xs ${isEvaluatorWeightValid(kpi) ? 'text-green-600' : 'text-red-600'}`}>
                合计: {calculateEvaluatorWeightSum(kpi)}%
                {!isEvaluatorWeightValid(kpi) && ' (需100%)'}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm font-medium text-blue-600">
            {evaluator.weight}
          </div>
        )}
      </TableCell>

      {/* 评价顺序列 - 仅在模板模式下显示 */}
      {mode === 'template' && (
        <TableCell>
          {editingCategory === category.id ? (
            <Input
              type="number"
              value={evaluator.order ?? ''}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : parseInt(e.target.value)
                onUpdateEvaluator(category.id, kpi.id, evaluator.id, "order", value as number)
              }}
              placeholder="顺序"
              className="w-16"
            />
          ) : (
            <div className="text-sm text-gray-600">
              {evaluator.order ?? '--'}
            </div>
          )}
        </TableCell>
      )}

      {/* 评估分数列 - 简化版本 */}
      <TableCell>
        <input
          type="number"
          min={-999}
          step="0.1"
          defaultValue={evaluator.score ?? ''}
          onBlur={(e) => {
            const value = e.target.value === '' ? undefined : parseFloat(e.target.value)
            evaluator.score = value
            forceUpdate()
          }}
          onChange={(e) => {
            const value = e.target.value === '' ? undefined : parseFloat(e.target.value)
            evaluator.score = value
            forceUpdate()
          }}
          placeholder="分数"
          className="w-20 px-2 py-1 border border-gray-300 rounded"
          style={{ width: '80px' }}
        />
      </TableCell>

      {/* 评估备注列 - 仅在使用模式下显示 */}
      {mode === 'usage' && (
        <TableCell>
          <div className="space-y-1">
            <Input
              value={evaluator.remark ?? ''}
              onChange={(e) => onUpdateEvaluator(category.id, kpi.id, evaluator.id, "remark", e.target.value)}
              placeholder="备注"
              className="w-full"
            />
            {typeof evaluator.score === 'number' && evaluator.score < 0 && (
              <p className="text-xs text-red-600">扣分必须备注</p>
            )}
          </div>
        </TableCell>
      )}

      {/* 已邀请列 - 仅在使用模式下显示 */}
      {mode === 'usage' && (
        <TableCell>
          <div className="flex justify-center">
            {evaluator.invited && (
              <span className="text-green-600 font-bold">✓</span>
            )}
          </div>
        </TableCell>
      )}

      {/* 操作列 - 仅在使用模式下显示 */}
      {mode === 'usage' && (
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onInvite(category.id, kpi.id, evaluator.id, evaluator.name)}
              className="h-6 w-6 p-0 text-purple-500 hover:text-purple-700 hover:bg-purple-50"
              title="邀请评价"
            >
              <Mail className="h-3 w-3" />
            </Button>
          </div>
        </TableCell>
      )}
    </>
  )
}