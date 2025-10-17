import { useState } from "react"
import { UnifiedKPITable } from "./UnifiedKPITable"
import { Category, KPI, Evaluator } from "@/types/assessment"

interface DepartmentAssessmentTableProps {
  categories: Category[]
  onUpdateCategory?: (categoryId: string, field: keyof Category, value: string) => void
  onUpdateKPI?: (categoryId: string, kpiId: string, field: keyof KPI, value: string | number) => void
  onUpdateEvaluator?: (categoryId: string, kpiId: string, evaluatorId: string, field: keyof Evaluator, value: string | number) => void
  onAddEvaluator?: (categoryId: string, kpiId: string) => void
  onRemoveEvaluator?: (categoryId: string, kpiId: string, evaluatorId: string) => void
  onAddKPI?: (categoryId: string) => void
  onRemoveKPI?: (categoryId: string, kpiId: string) => void
  onRemoveCategory?: (categoryId: string) => void
  onCopyCategory?: (categoryId: string) => void
  onMoveEvaluator?: (categoryId: string, kpiId: string, evaluatorId: string, direction: 'up' | 'down') => void
  canRemoveCategory?: boolean
  readOnly?: boolean
  mode?: 'template' | 'usage' // 模板设置模式 或 使用模式
}

export function DepartmentAssessmentTable({
  categories,
  onUpdateCategory,
  onUpdateKPI,
  onUpdateEvaluator,
  onAddEvaluator,
  onRemoveEvaluator,
  onAddKPI,
  onRemoveKPI,
  onRemoveCategory,
  onCopyCategory,
  onMoveEvaluator,
  canRemoveCategory = false,
  readOnly = false,
  mode = 'usage'
}: DepartmentAssessmentTableProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)

  const handleEditCategory = (categoryId: string) => {
    if (!readOnly) setEditingCategory(categoryId)
  }

  const handleSaveCategory = () => {
    setEditingCategory(null)
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
  }

  // 默认的空函数，当父组件未提供时使用
  const noop = () => {}

  return (
    <UnifiedKPITable
      categories={categories}
      editingCategory={readOnly ? null : editingCategory}
      onEditCategory={handleEditCategory}
      onSaveCategory={handleSaveCategory}
      onCancelEdit={handleCancelEdit}
      onUpdateCategory={onUpdateCategory || noop}
      onUpdateKPI={onUpdateKPI || noop}
      onUpdateEvaluator={onUpdateEvaluator || noop}
      onAddEvaluator={onAddEvaluator || noop}
      onRemoveEvaluator={onRemoveEvaluator || noop}
      onAddKPI={onAddKPI || noop}
      onRemoveKPI={onRemoveKPI || noop}
      onRemoveCategory={onRemoveCategory || noop}
      onCopyCategory={onCopyCategory || noop}
      canRemoveCategory={canRemoveCategory}
      onMoveEvaluator={onMoveEvaluator || noop}
      mode={mode}
    />
  )
}
