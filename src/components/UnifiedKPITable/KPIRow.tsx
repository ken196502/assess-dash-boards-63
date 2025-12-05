import { TableRow, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { UserPlus, Trash2 } from "lucide-react"
import { KPI, Category } from "@/types/assessment"
import { EvaluatorRow } from "./EvaluatorRow"
import { CategoryRow } from "./CategoryRow"

interface KPIRowProps {
  category: Category
  kpi: KPI
  mode: 'template' | 'usage'
  editingCategory: string | null
  onUpdateKPI: (categoryId: string, kpiId: string, field: keyof KPI, value: string | number) => void
  onUpdateEvaluator: (categoryId: string, kpiId: string, evaluatorId: string, field: keyof any, value: string | number | boolean) => void
  onAddEvaluator: (categoryId: string, kpiId: string) => void
  onMoveEvaluator: (categoryId: string, kpiId: string, evaluatorId: string, direction: 'up' | 'down') => void
  onInvite: (categoryId: string, kpiId: string, evaluatorId: string, evaluatorName: string) => void
  onDeleteClick: (type: 'kpi' | 'evaluator', id: string, categoryId?: string, kpiId?: string) => void
  forceUpdate: () => void
  categoryRowSpan: number
  isFirstKPIInCategory: boolean
  // 类别相关的函数
  onUpdateCategory?: (categoryId: string, field: keyof Category, value: string) => void
  onEditCategory?: (categoryId: string) => void
  onSaveCategory?: () => void
  onCancelEdit?: () => void
  onCopyCategory?: (categoryId: string) => void
  onRemoveCategory?: (categoryId: string) => void
  canRemoveCategory?: boolean
}

export function KPIRow({
  category,
  kpi,
  mode,
  editingCategory,
  onUpdateKPI,
  onUpdateEvaluator,
  onAddEvaluator,
  onMoveEvaluator,
  onInvite,
  onDeleteClick,
  forceUpdate,
  categoryRowSpan,
  isFirstKPIInCategory,
  onUpdateCategory,
  onEditCategory,
  onSaveCategory,
  onCancelEdit,
  onCopyCategory,
  onRemoveCategory,
  canRemoveCategory
}: KPIRowProps) {
  const kpiRowSpan = Math.max(1, kpi.evaluators.length)
  
  if (kpi.evaluators.length > 0) {
    return (
      <>
        {kpi.evaluators.map((evaluator, evalIndex) => (
          <TableRow key={`${kpi.id}-${evaluator.id}`}>
            {/* 类别和说明列 - 只在第一个KPI的第一行显示 */}
            {isFirstKPIInCategory && evalIndex === 0 && (
              <CategoryRow
                category={category}
                categoryRowSpan={categoryRowSpan}
                mode={mode}
                editingCategory={editingCategory}
                canRemoveCategory={canRemoveCategory || false}
                onUpdateCategory={onUpdateCategory || (() => {})}
                onEditCategory={onEditCategory || (() => {})}
                onSaveCategory={onSaveCategory || (() => {})}
                onCancelEdit={onCancelEdit || (() => {})}
                onCopyCategory={onCopyCategory || (() => {})}
                onRemoveCategory={onRemoveCategory || (() => {})}
              />
            )}
            
            {/* 指标列 - 只在KPI的第一行显示 */}
            {evalIndex === 0 && (
              <TableCell rowSpan={kpiRowSpan} className="font-medium align-top">
                {mode === 'template' && editingCategory === category.id ? (
                  <Input
                    value={kpi.name}
                    onChange={(e) => onUpdateKPI(category.id, kpi.id, "name", e.target.value)}
                    placeholder="指标名称"
                  />
                ) : (
                  kpi.name
                )}
              </TableCell>
            )}

            {/* 要求/目标列 - 只在KPI的第一行显示 */}
            {evalIndex === 0 && (
              <TableCell rowSpan={kpiRowSpan} className="align-top">
                {mode === 'template' && editingCategory === category.id ? (
                  <Input
                    value={kpi.target}
                    onChange={(e) => onUpdateKPI(category.id, kpi.id, "target", e.target.value)}
                    placeholder="要求/目标"
                  />
                ) : (
                  <span className="font-medium text-green-600">{kpi.target}</span>
                )}
              </TableCell>
            )}

            {/* 口径说明列 - 只在KPI的第一行显示 */}
            {evalIndex === 0 && (
              <TableCell rowSpan={kpiRowSpan} className="align-top">
                {mode === 'template' && editingCategory === category.id ? (
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

            {/* 指标权重列 - 只在KPI的第一行显示 */}
            {evalIndex === 0 && (
              <TableCell rowSpan={kpiRowSpan} className="align-top">
                {mode === 'template' && editingCategory === category.id ? (
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={kpi.weight?.replace('%', '') || '0'}
                    onChange={(e) => {
                      const value = e.target.value
                      const numValue = parseInt(value)
                      if (value === '' || (numValue >= 0 && numValue <= 100)) {
                        onUpdateKPI(category.id, kpi.id, "weight", value === '' ? '0%' : `${numValue}%`)
                      }
                    }}
                    placeholder="0-100"
                    className="w-full"
                  />
                ) : (
                  <span className="font-medium text-purple-600">{kpi.weight || '0%'}</span>
                )}
              </TableCell>
            )}

            <EvaluatorRow
              category={category}
              kpi={kpi}
              evaluator={evaluator}
              evalIndex={evalIndex}
              mode={mode}
              editingCategory={editingCategory}
              onUpdateEvaluator={onUpdateEvaluator}
              onMoveEvaluator={onMoveEvaluator}
              onInvite={onInvite}
              onDeleteClick={onDeleteClick}
              forceUpdate={forceUpdate}
            />
          </TableRow>
        ))}
        
        {/* 在编辑模式下，为每个KPI添加一个"添加评价人"的行 */}
        {mode === 'template' && editingCategory === category.id && (
          <TableRow key={`${kpi.id}-add-evaluator`} className="bg-blue-50/30">
            <TableCell className="text-right" colSpan={3}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddEvaluator(category.id, kpi.id)}
                className="w-full border-dashed"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                添加评价人
              </Button>
            </TableCell>
          </TableRow>
        )}
      </>
    )
  }

  // 处理没有评估人的情况
  return (
    <TableRow key={kpi.id}>
      <TableCell className="font-medium">
        {mode === 'template' && editingCategory === category.id ? (
          <Input
            value={kpi.name}
            onChange={(e) => onUpdateKPI(category.id, kpi.id, "name", e.target.value)}
            placeholder="指标名称"
          />
        ) : (
          kpi.name
        )}
      </TableCell>
      <TableCell>
        {mode === 'template' && editingCategory === category.id ? (
          <Input
            value={kpi.target}
            onChange={(e) => onUpdateKPI(category.id, kpi.id, "target", e.target.value)}
            placeholder="要求/目标"
          />
        ) : (
          <span className="font-medium text-green-600">{kpi.target}</span>
        )}
      </TableCell>
      <TableCell>
        {mode === 'template' && editingCategory === category.id ? (
          <Textarea
            value={kpi.description}
            onChange={(e) => onUpdateKPI(category.id, kpi.id, "description", e.target.value)}
            className="min-h-[60px]"
            placeholder="输入口径说明"
          />
        ) : (
          kpi.description
        )}
      </TableCell>
      <TableCell>
        {mode === 'template' && editingCategory === category.id ? (
          <Input
            type="number"
            min="0"
            max="100"
            value={kpi.weight?.replace('%', '') || '0'}
            onChange={(e) => {
              const value = e.target.value
              const numValue = parseInt(value)
              if (value === '' || (numValue >= 0 && numValue <= 100)) {
                onUpdateKPI(category.id, kpi.id, "weight", value === '' ? '0%' : `${numValue}%`)
              }
            }}
            placeholder="0-100"
            className="w-full"
          />
        ) : (
          <span className="font-medium text-purple-600">{kpi.weight || '0%'}</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {mode === 'template' && editingCategory === category.id ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddEvaluator(category.id, kpi.id)}
            className="h-8 w-full"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            添加评价人
          </Button>
        ) : (
          '--'
        )}
      </TableCell>
      <TableCell>--</TableCell>
      <TableCell>--</TableCell>
      <TableCell>
        {mode === 'template' && editingCategory === category.id && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteClick('kpi', kpi.id, category.id)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </TableCell>
      {mode === 'usage' && <TableCell></TableCell>}
    </TableRow>
  )
}