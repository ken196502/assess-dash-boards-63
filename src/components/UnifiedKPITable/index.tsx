import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

import { UnifiedKPITableProps, DeleteDialogState, InviteDialogState } from "./types"
import { calculateTotalWeightedScore } from "./utils"
import { KPITableHeader } from "./TableHeader"
import { CategoryRow } from "./CategoryRow"
import { KPIRow } from "./KPIRow"
import { InviteDialog } from "./InviteDialog"
import { DeleteDialog } from "./DeleteDialog"

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
  onMoveEvaluator,
  mode = 'usage',
  completeButtonConfig,
  showScoreInput = false,
  showHRAdjustment = false,
  hrAdjustment,
  onHRAdjustmentChange,
  onHRSubmit
}: UnifiedKPITableProps) {
  // 强制重新渲染的状态
  const [forceUpdate, setForceUpdate] = useState(0)
  
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    type: 'category',
    id: '',
  })
  
  const [inviteDialog, setInviteDialog] = useState<InviteDialogState>({
    open: false,
    name: '',
    categoryId: '',
    kpiId: '',
    evaluatorId: '',
    markAllSameName: false,
  })

  const handleForceUpdate = () => {
    setForceUpdate(prev => prev + 1)
  }

  // 处理邀请评价
  const handleInvite = (categoryId: string, kpiId: string, evaluatorId: string, evaluatorName: string) => {
    setInviteDialog({ 
      open: true, 
      name: evaluatorName,
      categoryId,
      kpiId,
      evaluatorId,
      markAllSameName: false
    })
  }

  const confirmInvite = () => {
    const { categoryId, kpiId, evaluatorId, name, markAllSameName } = inviteDialog
    
    if (markAllSameName) {
      // 标记所有同名评价人为已邀请
      categories.forEach(cat => {
        cat.kpis.forEach(k => {
          k.evaluators.forEach(ev => {
            if (ev.name === name) {
              onUpdateEvaluator(cat.id, k.id, ev.id, 'invited', true)
            }
          })
        })
      })
      toast({
        title: "已发送邀请",
        description: `已邀请所有"${name}"进行评价`,
      })
    } else {
      // 只标记当前评价人
      onUpdateEvaluator(categoryId, kpiId, evaluatorId, 'invited', true)
      toast({
        title: "已发送邀请",
        description: `已邀请${name}进行评价`,
      })
    }
    
    setInviteDialog({ 
      open: false, 
      name: '',
      categoryId: '',
      kpiId: '',
      evaluatorId: '',
      markAllSameName: false
    })
  }

  const handleDeleteClick = (type: 'category' | 'kpi' | 'evaluator', id: string, categoryId?: string, kpiId?: string) => {
    setDeleteDialog({ open: true, type, id, categoryId, kpiId })
  }

  const confirmDelete = () => {
    const { type, id, categoryId, kpiId } = deleteDialog
    
    if (type === 'category') {
      onRemoveCategory(id)
    } else if (type === 'kpi' && categoryId) {
      onRemoveKPI(categoryId, id)
    } else if (type === 'evaluator' && categoryId && kpiId) {
      onRemoveEvaluator(categoryId, kpiId, id)
    }
    
    setDeleteDialog({ open: false, type: 'category', id: '' })
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <Table>
          <KPITableHeader mode={mode} />
          <TableBody>
            {categories.map((category) => {
              // 计算类别总行数：包括KPI行 + 编辑模式下每个KPI的添加评价人行
              const categoryRowSpan = category.kpis.reduce((total, kpi) => {
                const kpiRows = Math.max(1, kpi.evaluators.length)
                const addButtonRow = (mode === 'template' && editingCategory === category.id) ? 1 : 0
                return total + kpiRows + addButtonRow
              }, 0)
              
              let isFirstRowInCategory = true
              
              let currentRowInCategory = 0
              
              return category.kpis.map((kpi, kpiIndex) => {
                // KPIRow 组件返回多个 TableRow，所以不需要在这里包装
                return (
                  <KPIRow
                    key={kpi.id}
                    category={category}
                    kpi={kpi}
                    mode={mode}
                    editingCategory={editingCategory}
                    onUpdateKPI={onUpdateKPI}
                    onUpdateEvaluator={onUpdateEvaluator}
                    onAddEvaluator={onAddEvaluator}
                    onMoveEvaluator={onMoveEvaluator}
                    onInvite={handleInvite}
                    onDeleteClick={handleDeleteClick}
                    forceUpdate={handleForceUpdate}
                    categoryRowSpan={categoryRowSpan}
                    isFirstKPIInCategory={kpiIndex === 0}
                    onUpdateCategory={onUpdateCategory}
                    onEditCategory={onEditCategory}
                    onSaveCategory={onSaveCategory}
                    onCancelEdit={onCancelEdit}
                    onCopyCategory={onCopyCategory}
                    onRemoveCategory={onRemoveCategory}
                    canRemoveCategory={canRemoveCategory}
                  />
                )
              })
            })}
            
            {/* 总分行 */}
            <TableRow className="bg-blue-50 font-medium">
              <TableCell colSpan={mode === 'template' ? 9 : 8} className="text-right text-blue-800">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      {mode === 'template' ? '总分(试算)：' : '总分：'}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="text-sm">sum(正数评分×指标权重×评价人权重)-sum(abs(负数评分))</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="text-blue-800 font-bold">
                <span>{calculateTotalWeightedScore(categories)}</span>
              </TableCell>
              {mode === 'usage' && <TableCell></TableCell>}
              {mode === 'usage' && <TableCell></TableCell>}
              {mode === 'usage' && (
                <TableCell>
                  {completeButtonConfig && (
                    <Button
                      size="sm"
                      onClick={completeButtonConfig.onClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {completeButtonConfig.label}
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
            
            {/* 人力资源修正评估行 */}
            {showHRAdjustment && (
              <TableRow className="bg-yellow-50 font-medium border-t-2 border-yellow-200">
                <TableCell colSpan={mode === 'template' ? 9 : 8} className="text-right text-yellow-800">
                  <span className="font-medium">人力资源修正评估：</span>
                </TableCell>
                <TableCell className="text-yellow-800">
                  <input
                    type="number"
                    min={-999}
                    step="0.1"
                    value={hrAdjustment?.score ?? ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : parseFloat(e.target.value)
                      onHRAdjustmentChange?.('score', value)
                    }}
                    placeholder="修正分数"
                    className="w-20 px-2 py-1 border border-yellow-300 rounded focus:border-yellow-500 focus:outline-none"
                  />
                </TableCell>
                {mode === 'usage' && (
                  <TableCell>
                    <input
                      type="text"
                      value={hrAdjustment?.remark ?? ''}
                      onChange={(e) => onHRAdjustmentChange?.('remark', e.target.value)}
                      placeholder="修正备注"
                      className="w-full px-2 py-1 border border-yellow-300 rounded focus:border-yellow-500 focus:outline-none"
                    />
                  </TableCell>
                )}
                {mode === 'usage' && <TableCell></TableCell>}
                {mode === 'usage' && (
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={onHRSubmit}
                      disabled={!hrAdjustment?.score && !hrAdjustment?.remark}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-gray-300"
                    >
                      提交并返回
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {mode === 'template' && editingCategory && (
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

      <InviteDialog
        inviteDialog={inviteDialog}
        onOpenChange={(open) => setInviteDialog({ ...inviteDialog, open })}
        onConfirmInvite={confirmInvite}
        onUpdateDialog={(updates) => setInviteDialog({ ...inviteDialog, ...updates })}
      />

      <DeleteDialog
        deleteDialog={deleteDialog}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirmDelete={confirmDelete}
      />
    </div>
  )
}

// 导出给原来的使用者
export { UnifiedKPITable as default }