import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { Category, KPI, Evaluator } from "@/types/assessment"
import { UnifiedKPITable } from "@/components/UnifiedKPITable"
import { toast } from "@/hooks/use-toast"

const mockDepartmentDetail = {
  id: "1",
  name: "销售部门",
  year: 2024
}

const mockCategories: Category[] = [
  {
    id: "finance",
    name: "财务类",
    description: "反映类别真实营销典型的量化指标，需充分考虑业务实际因素",
    kpis: [
      {
        id: "revenue",
        name: "营业收入指标",
        target: "1000万元",
        weight: "30%",
        evaluators: [
          { id: "eval1", name: "张三", weight: "50%", score: 85 },
          { id: "eval2", name: "李四", weight: "50%", score: 90 },
        ],
        description:
          "口径说明：与财务部报送总部口径一致，已扣除手续费支出及利息支出，不考虑协同收入，得分=实际完成值/目标值，120分封顶。",
      },
      {
        id: "profit",
        name: "营业利润指标",
        target: "200万元",
        weight: "30%",
        evaluators: [{ id: "eval3", name: "张三", weight: "100%" }],
        description:
          "口径说明：与财务部报送总部口径一致，不考虑协同收入及所得税费用，得分=实际完成值/目标值，120分封顶。",
      },
    ],
  },
  {
    id: "customer",
    name: "客户类",
    description: "体现客户的拓展、维护、项目储备、产品营销、并各有成效的相关指标",
    kpis: [
      {
        id: "general",
        name: "客户拓展指标",
        target: "新增50家",
        weight: "40%",
        evaluators: [
          { id: "eval6", name: "董事长", weight: "70%", score: 88 },
          { id: "eval7", name: "行政总裁", weight: "30%" },
        ],
        description: "客户拓展的具体考核标准和计算方式，包括新客户数量、客户质量等维度的综合评价。",
      },
    ],
  },
]

export default function DepartmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)

  const handleComplete = () => {
    toast({ title: "已完成", description: "返回列表" })
    navigate(-1)
  }

  const updateKPI = (categoryId: string, kpiId: string, field: keyof KPI, value: string | number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              kpis: cat.kpis.map((kpi) => (kpi.id === kpiId ? { ...kpi, [field]: value } : kpi)),
            }
          : cat,
      ),
    )
  }

  const updateCategory = (categoryId: string, field: keyof Category, value: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, [field]: value } : cat)),
    )
  }

  const updateEvaluator = (
    categoryId: string,
    kpiId: string,
    evaluatorId: string,
    field: keyof Evaluator,
    value: string | number | boolean,
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              kpis: cat.kpis.map((kpi) =>
                kpi.id === kpiId
                  ? {
                      ...kpi,
                      evaluators: kpi.evaluators.map((evaluator) =>
                        evaluator.id === evaluatorId ? { ...evaluator, [field]: value } : evaluator,
                      ),
                    }
                  : kpi,
              ),
            }
          : cat,
      ),
    )
  }

  const addEvaluator = (categoryId: string, kpiId: string) => {
    const newEvaluator: Evaluator = {
      id: `evaluator-${Date.now()}`,
      name: "",
      weight: "",
    }
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              kpis: cat.kpis.map((kpi) =>
                kpi.id === kpiId ? { ...kpi, evaluators: [...kpi.evaluators, newEvaluator] } : kpi,
              ),
            }
          : cat,
      ),
    )
  }

  const removeEvaluator = (categoryId: string, kpiId: string, evaluatorId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              kpis: cat.kpis.map((kpi) =>
                kpi.id === kpiId
                  ? { ...kpi, evaluators: kpi.evaluators.filter((e) => e.id !== evaluatorId) }
                  : kpi,
              ),
            }
          : cat,
      ),
    )
  }

  const addKPI = (categoryId: string) => {
    const newKPI: KPI = {
      id: `kpi-${Date.now()}`,
      name: "新指标",
      target: "",
      weight: "0%",
      evaluators: [{ id: `evaluator-${Date.now()}`, name: "", weight: "" }],
      description: "",
    }
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, kpis: [...cat.kpis, newKPI] } : cat,
      ),
    )
  }

  const removeKPI = (categoryId: string, kpiId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, kpis: cat.kpis.filter((kpi) => kpi.id !== kpiId) } : cat,
      ),
    )
  }

  const removeCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
  }

  const copyCategory = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (category) {
      const newCategory: Category = {
        ...category,
        id: `cat-${Date.now()}`,
        name: `${category.name} (副本)`,
        kpis: category.kpis.map((kpi) => ({
          ...kpi,
          id: `kpi-${Date.now()}-${Math.random()}`,
          evaluators: kpi.evaluators.map((evaluator) => ({
            ...evaluator,
            id: `evaluator-${Date.now()}-${Math.random()}`,
            score: undefined,
          })),
        })),
      }
      setCategories((prev) => [...prev, newCategory])
    }
  }

  const moveEvaluator = (categoryId: string, kpiId: string, evaluatorId: string, direction: "up" | "down") => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              kpis: cat.kpis.map((kpi) =>
                kpi.id === kpiId
                  ? {
                      ...kpi,
                      evaluators: (() => {
                        const evaluators = [...kpi.evaluators]
                        const currentIndex = evaluators.findIndex((e) => e.id === evaluatorId)
                        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
                        if (targetIndex >= 0 && targetIndex < evaluators.length) {
                          ;[evaluators[currentIndex], evaluators[targetIndex]] = [
                            evaluators[targetIndex],
                            evaluators[currentIndex],
                          ]
                        }
                        return evaluators
                      })(),
                    }
                  : kpi,
              ),
            }
          : cat,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/department-assessment")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>

          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">部门考核详情</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">部门名称：</span>
                <span className="font-medium">{mockDepartmentDetail.name}</span>
              </div>
              <div>
                <span className="text-gray-500">考核年度：</span>
                <span className="font-medium">{mockDepartmentDetail.year}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">考核详情</h2>
          <UnifiedKPITable
            categories={categories}
            editingCategory={editingCategory}
            onEditCategory={setEditingCategory}
            onSaveCategory={() => setEditingCategory(null)}
            onCancelEdit={() => setEditingCategory(null)}
            onUpdateCategory={updateCategory}
            onUpdateKPI={updateKPI}
            onUpdateEvaluator={updateEvaluator}
            onAddEvaluator={addEvaluator}
            onRemoveEvaluator={removeEvaluator}
            onAddKPI={addKPI}
            onRemoveKPI={removeKPI}
            onRemoveCategory={removeCategory}
            onCopyCategory={copyCategory}
            canRemoveCategory={categories.length > 1}
            onMoveEvaluator={moveEvaluator}
            mode="usage"
            showScoreInput={true}
            completeButtonConfig={{ label: "完成并返回列表", onClick: handleComplete }}
          />
        </div>
      </div>
    </div>
  )
}
