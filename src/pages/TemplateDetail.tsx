import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Plus } from "lucide-react"
import { Category, KPI, Evaluator } from "@/types/assessment"
import { UnifiedKPITable } from "@/components/UnifiedKPITable"
import { toast } from "@/hooks/use-toast"
import { getTemplateById } from "@/data/templateData"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// 模拟数据
const mockDepartmentTemplate: Category[] = [
  {
    id: "cat1",
    name: "工作业绩",
    description: "工作目标达成情况",
    kpis: [
      {
        id: "kpi1",
        name: "销售目标达成率",
        target: "≥100%",
        description: "年度销售目标完成情况",
        evaluators: [
          { id: "eval1", name: "直属上级", weight: "60%", score: undefined },
          { id: "eval2", name: "部门总监", weight: "40%", score: undefined },
        ]
      }
    ]
  },
  {
    id: "cat2",
    name: "工作能力",
    description: "业务能力与专业技能",
    kpis: [
      {
        id: "kpi2",
        name: "专业技能",
        target: "熟练掌握",
        description: "岗位所需专业技能掌握程度",
        evaluators: [
          { id: "eval3", name: "直属上级", weight: "100%", score: undefined },
        ]
      }
    ]
  }
]

interface TemplateInfo {
  id: string
  type: 'department' | 'personal'
  department: string
  level?: '员工' | '主管'
}

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const templateType = searchParams.get('type') as 'department' | 'personal' || 'department'

  // 根据模板ID获取模板信息

  const existingTemplate = !isNew ? getTemplateById(id || '') : null

  const [templateInfo, setTemplateInfo] = useState<TemplateInfo>({
    id: isNew ? '' : id || '',
    type: isNew ? templateType : (existingTemplate?.type as 'department' | 'personal' || 'department'),
    department: isNew ? '' : (existingTemplate?.department || '示例部门'),
    level: isNew ? '员工' : (existingTemplate?.level as '员工' | '主管' || '员工')
  })

  const [categories, setCategories] = useState<Category[]>(isNew ? [] : mockDepartmentTemplate)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  
  // 年份选项（当年及倒数3年）
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  
  // 模拟已使用次数
  const [usageCount] = useState<number>(Math.floor(Math.random() * 20))

  const handleBack = () => {
    navigate('/template-management')
  }

  const handleSave = () => {
    if (!templateInfo.department.trim()) {
      toast({
        title: "保存失败",
        description: "请填写部门名称",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "保存成功",
      description: `${templateInfo.department}${templateInfo.type === 'department' ? '部门' : `${templateInfo.level}个人`}考核模板已保存`,
    })
    
    // 这里可以添加实际的保存逻辑
    setTimeout(() => {
      navigate('/template-management')
    }, 1000)
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

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: "新类别",
      description: "类别描述",
      kpis: [
        {
          id: `kpi-${Date.now()}`,
          name: "",
          target: "",
          description: "",
          evaluators: []
        }
      ]
    }
    setCategories([...categories, newCategory])
    setEditingCategory(newCategory.id)
  }

  const handleEditCategory = (categoryId: string) => {
    setEditingCategory(categoryId)
  }

  const handleSaveCategory = () => {
    setEditingCategory(null)
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* 头部 */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack} size="sm" className="md:size-default">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
                  {isNew ? '新建' : '编辑'}{templateInfo.department}
                  {templateInfo.type === 'department' ? '部门' : `${templateInfo.level}个人`}考核模板
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  {isNew ? '创建新的' : '编辑'}考核模板设置
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleAddCategory} variant="outline" size="sm" className="md:size-default">
                <Plus className="w-4 h-4 mr-2" />
                添加类别
              </Button>
              <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700 md:size-lg">
                <Save className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                保存模板
              </Button>
            </div>
          </div>

          {/* 模板基本信息 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold mb-4">基本信息</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部门名称</label>
                <Input
                  value={templateInfo.department}
                  onChange={(e) => setTemplateInfo({ ...templateInfo, department: e.target.value })}
                  placeholder="请输入部门名称"
                />
              </div>
              {templateInfo.type === 'personal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">职级</label>
                  <select
                    value={templateInfo.level}
                    onChange={(e) => setTemplateInfo({ ...templateInfo, level: e.target.value as '员工' | '主管' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="员工">员工</option>
                    <option value="主管">主管</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年份</label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}年
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">已使用次数</label>
                <div className="flex items-center gap-2 h-10">
                  <Badge variant="secondary" className="text-base">
                    {usageCount} 次
                  </Badge>
                  <span className="text-sm text-red-600">（注意：重新编辑会清空相关已评估纪录！）</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 表格 */}
        <UnifiedKPITable
          categories={categories}
          editingCategory={editingCategory}
          onEditCategory={handleEditCategory}
          onSaveCategory={handleSaveCategory}
          onCancelEdit={handleCancelEdit}
          onUpdateCategory={handleUpdateCategory}
          onUpdateKPI={handleUpdateKPI}
          onUpdateEvaluator={handleUpdateEvaluator}
          onAddEvaluator={handleAddEvaluator}
          onRemoveEvaluator={handleRemoveEvaluator}
          onAddKPI={handleAddKPI}
          onRemoveKPI={handleRemoveKPI}
          onRemoveCategory={handleRemoveCategory}
          onCopyCategory={handleCopyCategory}
          canRemoveCategory={true}
          onMoveEvaluator={handleMoveEvaluator}
          mode="template"
        />
      </div>
    </div>
  )
}