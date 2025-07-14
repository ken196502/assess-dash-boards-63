
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X, Trash2 } from "lucide-react"
import { Department } from "@/types/assessment"

interface DepartmentHeaderProps {
  department: Department
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onUpdate: (field: keyof Department, value: string) => void
  onRemove: () => void
  canRemove: boolean
}

export function DepartmentHeader({
  department,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
  onRemove,
  canRemove
}: DepartmentHeaderProps) {
  return (
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={department.name}
                onChange={(e) => onUpdate("name", e.target.value)}
                className="text-xl font-bold"
              />
              <Textarea
                value={department.description}
                onChange={(e) => onUpdate("description", e.target.value)}
                className="text-sm"
                rows={2}
              />
            </div>
          ) : (
            <div>
              <CardTitle className="text-xl text-gray-900 mb-2">{department.name}</CardTitle>
              <p className="text-sm text-gray-600">{department.description}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          {isEditing ? (
            <>
              <Button size="sm" onClick={onSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-1" />
                编辑
              </Button>
              {canRemove && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRemove}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </CardHeader>
  )
}
