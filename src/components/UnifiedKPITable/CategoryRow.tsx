import { TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit, Copy, Trash2, Save, X } from "lucide-react"
import { Category } from "@/types/assessment"

interface CategoryRowProps {
  category: Category
  categoryRowSpan: number
  mode: 'template' | 'usage'
  editingCategory: string | null
  canRemoveCategory: boolean
  onUpdateCategory: (categoryId: string, field: keyof Category, value: string) => void
  onEditCategory: (categoryId: string) => void
  onSaveCategory: () => void
  onCancelEdit: () => void
  onCopyCategory: (categoryId: string) => void
  onRemoveCategory: (categoryId: string) => void
}

export function CategoryRow({
  category,
  categoryRowSpan,
  mode,
  editingCategory,
  canRemoveCategory,
  onUpdateCategory,
  onEditCategory,
  onSaveCategory,
  onCancelEdit,
  onCopyCategory,
  onRemoveCategory
}: CategoryRowProps) {
  return (
    <>
      {/* 类别列 */}
      <TableCell rowSpan={categoryRowSpan} className="align-top border-r">
        {mode === 'template' && editingCategory === category.id ? (
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
          <div className="space-y-2">
            <div className="text-sm font-bold text-gray-900">{category.name}</div>
            {mode === 'template' && (
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => onEditCategory(category.id)} className="h-6 w-6 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onCopyCategory(category.id)} className="h-6 w-6 p-0">
                  <Copy className="w-3 h-3" />
                </Button>
                {canRemoveCategory && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveCategory(category.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </TableCell>
      
      {/* 说明列 */}
      <TableCell rowSpan={categoryRowSpan} className="align-top border-r">
        {mode === 'template' && editingCategory === category.id ? (
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
    </>
  )
}