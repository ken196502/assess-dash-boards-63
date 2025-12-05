import { KPI, Category, Evaluator } from "@/types/assessment"

export interface UnifiedKPITableProps {
  categories: Category[]
  editingCategory: string | null
  onEditCategory: (categoryId: string) => void
  onSaveCategory: () => void
  onCancelEdit: () => void
  onUpdateCategory: (categoryId: string, field: keyof Category, value: string) => void
  onUpdateKPI: (categoryId: string, kpiId: string, field: keyof KPI, value: string | number) => void
  onUpdateEvaluator: (categoryId: string, kpiId: string, evaluatorId: string, field: keyof Evaluator, value: string | number | boolean) => void
  onAddEvaluator: (categoryId: string, kpiId: string) => void
  onRemoveEvaluator: (categoryId: string, kpiId: string, evaluatorId: string) => void
  onAddKPI: (categoryId: string) => void
  onRemoveKPI: (categoryId: string, kpiId: string) => void
  onRemoveCategory: (categoryId: string) => void
  onCopyCategory: (categoryId: string) => void
  canRemoveCategory: boolean
  onMoveEvaluator: (categoryId: string, kpiId: string, evaluatorId: string, direction: 'up' | 'down') => void
  mode?: 'template' | 'usage'
  completeButtonConfig?: { label: string, onClick: () => void }
  showScoreInput?: boolean
  // 人力资源修正评估相关
  showHRAdjustment?: boolean
  hrAdjustment?: {
    score?: number
    remark?: string
  }
  onHRAdjustmentChange?: (field: 'score' | 'remark', value: number | string | undefined) => void
  onHRSubmit?: () => void
}

export interface DeleteDialogState {
  open: boolean
  type: 'category' | 'kpi' | 'evaluator'
  id: string
  categoryId?: string
  kpiId?: string
}

export interface InviteDialogState {
  open: boolean
  name: string
  categoryId: string
  kpiId: string
  evaluatorId: string
  markAllSameName: boolean
}