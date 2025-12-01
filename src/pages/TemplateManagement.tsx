import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings } from "lucide-react"
import { AssessmentTemplate, TemplateItem } from "@/types/template"
import { Category, KPI, Evaluator } from "@/types/assessment"
import { DepartmentAssessmentTable } from "@/components/DepartmentAssessmentTable"
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

// 将TemplateItem转换为Category格式
const convertTemplateItemsToCategories = (items: TemplateItem[]): Category[] => {
  const categoryMap = new Map<string, Category>()
  
  items.forEach(item => {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, {
        id: `cat-${item.category}`,
        name: item.category,
        description: item.description,
        kpis: []
      })
    }
    
    const category = categoryMap.get(item.category)!
    category.kpis.push({
      id: item.id,
      name: item.indicator,
      target: item.target,
      weight: `${item.weight}%`,
      description: item.caliber,
      evaluators: [{
        id: `eval-${item.id}`,
        name: item.evaluator,
        weight: `${item.weight}%`,
        score: undefined
      }]
    })
  })
  
  return Array.from(categoryMap.values())
}

// 将Category格式转换回TemplateItem
const convertCategoriesToTemplateItems = (categories: Category[]): TemplateItem[] => {
  const items: TemplateItem[] = []
  
  categories.forEach(category => {
    category.kpis.forEach(kpi => {
      kpi.evaluators.forEach(evaluator => {
        items.push({
          id: kpi.id,
          category: category.name,
          description: category.description,
          indicator: kpi.name,
          target: kpi.target,
          caliber: kpi.description,
          evaluator: evaluator.name,
          weight: parseInt(evaluator.weight.replace('%', ''))
        })
      })
    })
  })
  
  return items
}

export default function TemplateManagement() {
  const [templates] = useState<AssessmentTemplate[]>(mockTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenSettings = (template: AssessmentTemplate) => {
    setSelectedTemplate(template)
    setCategories(convertTemplateItemsToCategories(template.items))
    setIsDialogOpen(true)
  }

  const handleUpdateCategory = (categoryId: string, field: keyof Category, value: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ))
  }

  const handleUpdateKPI = (categoryId: string, kpiId: string, field: keyof KPI, value: string | number) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          kpis: cat.kpis.map(kpi => 
            kpi.id === kpiId ? { ...kpi, [field]: value } : kpi
          )
        }
      }
      return cat
    }))
  }

  const handleUpdateEvaluator = (categoryId: string, kpiId: string, evaluatorId: string, field: keyof Evaluator, value: string | number | boolean) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          kpis: cat.kpis.map(kpi => {
            if (kpi.id === kpiId) {
              return {
                ...kpi,
                evaluators: kpi.evaluators.map(evaluator => 
                  evaluator.id === evaluatorId ? { ...evaluator, [field]: value } : evaluator
                )
              }
            }
            return kpi
          })
        }
      }
      return cat
    }))
  }

  const handleAddEvaluator = (categoryId: string, kpiId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          kpis: cat.kpis.map(kpi => {
            if (kpi.id === kpiId) {
              return {
                ...kpi,
                evaluators: [
                  ...kpi.evaluators,
                  { 
                    id: `eval-${Date.now()}`, 
                    name: "", 
                    weight: "0%",
                    score: undefined 
                  }
                ]
              }
            }
            return kpi
          })
        }
      }
      return cat
    }))
  }

  const handleRemoveEvaluator = (categoryId: string, kpiId: string, evaluatorId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          kpis: cat.kpis.map(kpi => {
            if (kpi.id === kpiId) {
              return {
                ...kpi,
                evaluators: kpi.evaluators.filter(evaluator => evaluator.id !== evaluatorId)
              }
            }
            return kpi
          })
        }
      }
      return cat
    }))
  }

  const handleAddKPI = (categoryId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          kpis: [
            ...cat.kpis,
            {
              id: `kpi-${Date.now()}`,
              name: "",
              target: "",
              weight: "0%",
              description: "",
              evaluators: []
            }
          ]
        }
      }
      return cat
    }))
  }

  const handleRemoveKPI = (categoryId: string, kpiId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          kpis: cat.kpis.filter(kpi => kpi.id !== kpiId)
        }
      }
      return cat
    }))
  }

  const handleCopyCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (category) {
      const newCategory: Category = {
        ...category,
        id: `cat-${Date.now()}`,
        name: `${category.name} (副本)`,
        kpis: category.kpis.map(kpi => ({
          ...kpi,
          id: `kpi-${Date.now()}-${Math.random()}`,
          evaluators: kpi.evaluators.map(evaluator => ({
            ...evaluator,
            id: `eval-${Date.now()}-${Math.random()}`,
            score: undefined
          }))
        }))
      }
      setCategories([...categories, newCategory])
      toast({
        title: "复制成功",
        description: "类别已复制",
      })
    }
  }

  const handleRemoveCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId))
  }

  const handleMoveEvaluator = (categoryId: string, kpiId: string, evaluatorId: string, direction: 'up' | 'down') => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          kpis: cat.kpis.map(kpi => {
            if (kpi.id === kpiId) {
              const evaluators = [...kpi.evaluators]
              const index = evaluators.findIndex(e => e.id === evaluatorId)
              if (index !== -1) {
                const newIndex = direction === 'up' ? index - 1 : index + 1
                if (newIndex >= 0 && newIndex < evaluators.length) {
                  [evaluators[index], evaluators[newIndex]] = [evaluators[newIndex], evaluators[index]]
                }
              }
              return { ...kpi, evaluators }
            }
            return kpi
          })
        }
      }
      return cat
    }))
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
                      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            设置模板 - {selectedTemplate?.department} / {selectedTemplate?.level}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <DepartmentAssessmentTable
                            categories={categories}
                            onUpdateCategory={handleUpdateCategory}
                            onUpdateKPI={handleUpdateKPI}
                            onUpdateEvaluator={handleUpdateEvaluator}
                            onAddEvaluator={handleAddEvaluator}
                            onRemoveEvaluator={handleRemoveEvaluator}
                            onAddKPI={handleAddKPI}
                            onRemoveKPI={handleRemoveKPI}
                            onRemoveCategory={handleRemoveCategory}
                            onCopyCategory={handleCopyCategory}
                            onMoveEvaluator={handleMoveEvaluator}
                            canRemoveCategory={true}
                            mode="template"
                          />

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
