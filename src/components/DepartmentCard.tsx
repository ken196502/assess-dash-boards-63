
import { Card, CardContent } from "@/components/ui/card"
import { Department, KPI, Evaluator } from "@/types/assessment"
import { KPITable } from "./KPITable"

interface DepartmentCardProps {
  department: Department
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onUpdateDepartment: (field: keyof Department, value: string) => void
  onUpdateKPI: (kpiId: string, field: keyof KPI, value: string | number) => void
  onUpdateEvaluator: (kpiId: string, evaluatorId: string, field: keyof Evaluator, value: string | number) => void
  onAddEvaluator: (kpiId: string) => void
  onRemoveEvaluator: (kpiId: string, evaluatorId: string) => void
  onAddKPI: () => void
  onRemoveKPI: (kpiId: string) => void
  onRemoveDepartment: () => void
  onCopyDepartment: () => void
  canRemoveDepartment: boolean
  onMoveEvaluator: (kpiId: string, evaluatorId: string, direction: 'up' | 'down') => void
}

export function DepartmentCard({
  department,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onUpdateDepartment,
  onUpdateKPI,
  onUpdateEvaluator,
  onAddEvaluator,
  onRemoveEvaluator,
  onAddKPI,
  onRemoveKPI,
  onRemoveDepartment,
  onCopyDepartment,
  canRemoveDepartment,
  onMoveEvaluator
}: DepartmentCardProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-0">
        <KPITable
          department={department}
          isEditing={isEditing}
          onUpdateKPI={onUpdateKPI}
          onUpdateEvaluator={onUpdateEvaluator}
          onAddEvaluator={onAddEvaluator}
          onRemoveEvaluator={onRemoveEvaluator}
          onAddKPI={onAddKPI}
          onRemoveKPI={onRemoveKPI}
          onUpdateDepartment={onUpdateDepartment}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onRemoveDepartment={onRemoveDepartment}
          onCopyDepartment={onCopyDepartment}
          canRemoveDepartment={canRemoveDepartment}
          onMoveEvaluator={onMoveEvaluator}
        />
      </CardContent>
    </Card>
  )
}
