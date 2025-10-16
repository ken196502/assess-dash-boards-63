import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Plus, Trash2 } from "lucide-react"
import { AssessmentTemplate, TemplateItem } from "@/types/template"
import { toast } from "@/hooks/use-toast"

const mockTemplates: AssessmentTemplate[] = [
  {
    id: "1",
    department: "业务部门",
    level: "主管",
    changeLog: "2024-01-15 创建模板",
    items: []
  },
  {
    id: "2",
    department: "技术部门",
    level: "员工",
    changeLog: "2024-02-20 更新权重",
    items: []
  }
]

export default function TemplateManagement() {
  const [templates] = useState<AssessmentTemplate[]>(mockTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null)
  const [templateItems, setTemplateItems] = useState<TemplateItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenSettings = (template: AssessmentTemplate) => {
    setSelectedTemplate(template)
    setTemplateItems(template.items.length > 0 ? template.items : [])
    setIsDialogOpen(true)
  }

  const handleAddItem = () => {
    const newItem: TemplateItem = {
      id: Date.now().toString(),
      category: "",
      description: "",
      indicator: "",
      target: "",
      caliber: "",
      evaluator: "",
      weight: 0
    }
    setTemplateItems([...templateItems, newItem])
  }

  const handleDeleteItem = (id: string) => {
    setTemplateItems(templateItems.filter(item => item.id !== id))
  }

  const handleUpdateItem = (id: string, field: keyof TemplateItem, value: string | number) => {
    setTemplateItems(templateItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "模板设置已保存",
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">个人考核模板管理</h1>
              <p className="text-gray-600">管理各部门、各职级的考核模板</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">部门</TableHead>
                <TableHead className="w-[20%]">职级</TableHead>
                <TableHead className="w-[35%]">变动日志</TableHead>
                <TableHead className="w-[20%]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.department}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${template.level === '主管' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {template.level}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{template.changeLog}</TableCell>
                  <TableCell>
                    <Dialog open={isDialogOpen && selectedTemplate?.id === template.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenSettings(template)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          设置模板
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            设置模板 - {selectedTemplate?.department} / {selectedTemplate?.level}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">考核项目</h3>
                            <Button onClick={handleAddItem} size="sm">
                              <Plus className="w-4 h-4 mr-1" />
                              添加项目
                            </Button>
                          </div>

                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[12%]">类别</TableHead>
                                  <TableHead className="w-[15%]">说明</TableHead>
                                  <TableHead className="w-[12%]">指标</TableHead>
                                  <TableHead className="w-[15%]">要求/目标</TableHead>
                                  <TableHead className="w-[15%]">口径说明</TableHead>
                                  <TableHead className="w-[12%]">评价人</TableHead>
                                  <TableHead className="w-[10%]">权重(%)</TableHead>
                                  <TableHead className="w-[9%]">操作</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {templateItems.length > 0 ? (
                                  templateItems.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        <Input
                                          value={item.category}
                                          onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                                          placeholder="类别"
                                          className="h-8"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          value={item.description}
                                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                                          placeholder="说明"
                                          className="h-8"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          value={item.indicator}
                                          onChange={(e) => handleUpdateItem(item.id, 'indicator', e.target.value)}
                                          placeholder="指标"
                                          className="h-8"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          value={item.target}
                                          onChange={(e) => handleUpdateItem(item.id, 'target', e.target.value)}
                                          placeholder="要求/目标"
                                          className="h-8"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          value={item.caliber}
                                          onChange={(e) => handleUpdateItem(item.id, 'caliber', e.target.value)}
                                          placeholder="口径说明"
                                          className="h-8"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          value={item.evaluator}
                                          onChange={(e) => handleUpdateItem(item.id, 'evaluator', e.target.value)}
                                          placeholder="评价人"
                                          className="h-8"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          value={item.weight}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0
                                            if (val >= 1 && val <= 100) {
                                              handleUpdateItem(item.id, 'weight', val)
                                            }
                                          }}
                                          placeholder="1-100"
                                          className="h-8"
                                          min={1}
                                          max={100}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleDeleteItem(item.id)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                      暂无考核项目，请点击"添加项目"按钮
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>

                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              取消
                            </Button>
                            <Button onClick={handleSave}>
                              保存设置
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
