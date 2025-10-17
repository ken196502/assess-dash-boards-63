
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Building2, Plus, Trash2 } from "lucide-react"
import { Department, Category, KPI, Evaluator } from "@/types/assessment"
import { UnifiedKPITable } from "@/components/UnifiedKPITable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const initialDepartments: Department[] = [
  {
    id: "business",
    name: "业务部门",
    description: "业务部门整体描述和说明",
    kpis: [], // 保持为空，因为现在使用categories结构
    categories: [
      {
        id: "finance",
        name: "财务类",
        description: "反映类别真实营销典型的量化指标，需充分考虑业务实际因素",
        kpis: [
          {
            id: "revenue",
            name: "营业收入指标",
            target: "1000万元",
            evaluators: [
              { id: "eval1", name: "张三", weight: "50%" },
              { id: "eval2", name: "李四", weight: "50%" },
            ],
            description:
              "口径说明：与财务部报送总部口径一致，已扣除手续费支出及利息支出，不考虑协同收入，得分=实际完成值/目标值，120分封顶。",
          },
          {
            id: "profit",
            name: "营业利润指标",
            target: "200万元",
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
            evaluators: [
              { id: "eval6", name: "董事长", weight: "70%" },
              { id: "eval7", name: "行政总裁", weight: "30%" },
            ],
            description: "客户拓展的具体考核标准和计算方式，包括新客户数量、客户质量等维度的综合评价。",
          },
        ],
      },
    ],
  },
]

export default function Index() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [currentDepartmentId, setCurrentDepartmentId] = useState<string>(initialDepartments[0]?.id || "")
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [showNewDeptDialog, setShowNewDeptDialog] = useState(false)
  const [newDeptName, setNewDeptName] = useState("")

  const currentDepartment = departments.find(dept => dept.id === currentDepartmentId)

  const handleEditCategory = (categoryId: string) => {
    setEditingCategory(categoryId)
  }

  const handleSaveCategory = () => {
    setEditingCategory(null)
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
  }

  const updateKPI = (categoryId: string, kpiId: string, field: keyof KPI, value: string | number) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId
          ? {
              ...dept,
              categories: dept.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      kpis: cat.kpis.map((kpi) => (kpi.id === kpiId ? { ...kpi, [field]: value } : kpi)),
                    }
                  : cat,
              ),
            }
          : dept,
      ),
    )
  }

  const updateCategory = (categoryId: string, field: keyof Category, value: string) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId
          ? {
              ...dept,
              categories: dept.categories.map((cat) => (cat.id === categoryId ? { ...cat, [field]: value } : cat)),
            }
          : dept,
      ),
    )
  }

  const updateEvaluator = (
    categoryId: string,
    kpiId: string,
    evaluatorId: string,
    field: keyof Evaluator,
    value: string | number,
  ) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId
          ? {
              ...dept,
              categories: dept.categories.map((cat) =>
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
            }
          : dept,
      ),
    )
  }

  const addEvaluator = (categoryId: string, kpiId: string) => {
    const newEvaluator: Evaluator = {
      id: `evaluator-${Date.now()}`,
      name: "",
      weight: "",
    }

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId
          ? {
              ...dept,
              categories: dept.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      kpis: cat.kpis.map((kpi) =>
                        kpi.id === kpiId ? { ...kpi, evaluators: [...kpi.evaluators, newEvaluator] } : kpi,
                      ),
                    }
                  : cat,
              ),
            }
          : dept,
      ),
    )
  }

  const removeEvaluator = (categoryId: string, kpiId: string, evaluatorId: string) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId
          ? {
              ...dept,
              categories: dept.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      kpis: cat.kpis.map((kpi) =>
                        kpi.id === kpiId
                          ? { ...kpi, evaluators: kpi.evaluators.filter((evaluator) => evaluator.id !== evaluatorId) }
                          : kpi,
                      ),
                    }
                  : cat,
              ),
            }
          : dept,
      ),
    )
  }

  const addKPI = (categoryId: string) => {
    const newKPI: KPI = {
      id: `kpi-${Date.now()}`,
      name: "新指标",
      target: "",
      evaluators: [{ id: `evaluator-${Date.now()}`, name: "", weight: "" }],
      description: "",
    }

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId
          ? {
              ...dept,
              categories: dept.categories.map((cat) =>
                cat.id === categoryId ? { ...cat, kpis: [...cat.kpis, newKPI] } : cat,
              ),
            }
          : dept,
      ),
    )
  }

  const removeKPI = (categoryId: string, kpiId: string) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId
          ? {
              ...dept,
              categories: dept.categories.map((cat) =>
                cat.id === categoryId ? { ...cat, kpis: cat.kpis.filter((kpi) => kpi.id !== kpiId) } : cat,
              ),
            }
          : dept,
      ),
    )
  }

  const addCategory = () => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: "新类别",
      description: "请输入类别描述",
      kpis: [
        {
          id: `kpi-${Date.now()}`,
          name: "新指标",
          target: "",
          evaluators: [{ id: `evaluator-${Date.now()}`, name: "", weight: "" }],
          description: "",
        },
      ],
    }

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId ? { ...dept, categories: [...dept.categories, newCategory] } : dept,
      ),
    )
    setEditingCategory(newCategory.id)
  }

  const removeCategory = (categoryId: string) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId
          ? { ...dept, categories: dept.categories.filter((cat) => cat.id !== categoryId) }
          : dept,
      ),
    )
    if (editingCategory === categoryId) {
      setEditingCategory(null)
    }
  }

  const copyCategory = (categoryId: string) => {
    const currentDept = departments.find((dept) => dept.id === currentDepartmentId)
    if (!currentDept) return

    const categoryToCopy = currentDept.categories.find((cat) => cat.id === categoryId)
    if (categoryToCopy) {
      const newCategory: Category = {
        ...categoryToCopy,
        id: `cat-${Date.now()}`,
        name: `${categoryToCopy.name} (副本)`,
        kpis: categoryToCopy.kpis.map((kpi) => ({
          ...kpi,
          id: `kpi-${Date.now()}-${Math.random()}`,
          evaluators: kpi.evaluators.map((evaluator) => ({
            ...evaluator,
            id: `evaluator-${Date.now()}-${Math.random()}`,
            score: undefined,
          })),
        })),
      }
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === currentDepartmentId ? { ...dept, categories: [...dept.categories, newCategory] } : dept,
        ),
      )
    }
  }

  const moveEvaluator = (categoryId: string, kpiId: string, evaluatorId: string, direction: "up" | "down") => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === currentDepartmentId
          ? {
              ...dept,
              categories: dept.categories.map((cat) =>
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
            }
          : dept,
      ),
    )
  }

  const addDepartment = () => {
    if (!newDeptName.trim()) return

    const newDepartment: Department = {
      id: `dept-${Date.now()}`,
      name: newDeptName,
      description: "请输入部门描述",
      kpis: [],
      categories: [
        {
          id: `cat-${Date.now()}`,
          name: "新类别",
          description: "请输入类别描述",
          kpis: [
            {
              id: `kpi-${Date.now()}`,
              name: "新指标",
              target: "",
              evaluators: [{ id: `evaluator-${Date.now()}`, name: "", weight: "" }],
              description: "",
            },
          ],
        },
      ],
    }

    setDepartments((prev) => [...prev, newDepartment])
    setCurrentDepartmentId(newDepartment.id)
    setNewDeptName("")
    setShowNewDeptDialog(false)
  }

  const removeDepartment = (departmentId: string) => {
    if (departments.length <= 1) return

    setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId))
    if (currentDepartmentId === departmentId) {
      const remainingDepts = departments.filter((dept) => dept.id !== departmentId)
      setCurrentDepartmentId(remainingDepts[0]?.id || "")
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">部门考核管理</h1>
                <p className="text-gray-600">管理各部门的绩效考核指标和评价标准</p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">当前部门：</span>
                  <Select value={currentDepartmentId} onValueChange={setCurrentDepartmentId}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {departments.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeDepartment(currentDepartmentId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {currentDepartment && (
            <UnifiedKPITable
              categories={currentDepartment.categories}
              editingCategory={editingCategory}
              onEditCategory={handleEditCategory}
              onSaveCategory={handleSaveCategory}
              onCancelEdit={handleCancelEdit}
              onUpdateCategory={updateCategory}
              onUpdateKPI={updateKPI}
              onUpdateEvaluator={updateEvaluator}
              onAddEvaluator={addEvaluator}
              onRemoveEvaluator={removeEvaluator}
              onAddKPI={addKPI}
              onRemoveKPI={removeKPI}
              onRemoveCategory={removeCategory}
              onCopyCategory={copyCategory}
              canRemoveCategory={currentDepartment.categories.length > 1}
              onMoveEvaluator={moveEvaluator}
              mode="usage"
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
