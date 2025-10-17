import { useState } from "react"
import { DepartmentAssessmentTable } from "@/components/DepartmentAssessmentTable"
import { Category, KPI, Evaluator } from "@/types/assessment"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

const mockTemplateData: Category[] = [
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

export default function DepartmentTemplateManagement() {
  const [categories, setCategories] = useState<Category[]>(mockTemplateData)

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

  const handleUpdateEvaluator = (categoryId: string, kpiId: string, evaluatorId: string, field: keyof Evaluator, value: string | number) => {
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

  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "部门考核模板已保存",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">部门考核模板管理</h1>
              <p className="text-gray-600">设置部门考核标准和评估模板</p>
            </div>
            <Button onClick={handleSave} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-5 h-5 mr-2" />
              保存模板
            </Button>
          </div>
        </div>

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
      </div>
    </div>
  )
}
