import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { DepartmentAssessmentTable } from "@/components/DepartmentAssessmentTable"
import { Category } from "@/types/assessment"

// 模拟员工详情数据
const mockEmployeeDetail = {
  id: "1",
  employeeId: "E001",
  name: "张三",
  department: "业务部门",
  position: "经理",
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
        evaluators: [
          { id: "eval1", name: "张三", weight: "50%", score: 85 },
          { id: "eval2", name: "李四", weight: "50%", score: 90 },
        ],
        description:
          "口径说明：与财务部报送总部口径一致，已扣除手续费支出及利息支出，不考虑协同收入，得分=实际完成值/目标值，120分封顶。",
      }
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
          { id: "eval6", name: "董事长", weight: "70%", score: 88 },
          { id: "eval7", name: "行政总裁", weight: "30%" },
        ],
        description: "客户拓展的具体考核标准和计算方式，包括新客户数量、客户质量等维度的综合评价。",
      },
    ],
  },
]

export default function PersonalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories] = useState<Category[]>(mockCategories)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/personal")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>

          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">员工考核详情</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">工号：</span>
                <span className="font-medium">{mockEmployeeDetail.employeeId}</span>
              </div>
              <div>
                <span className="text-gray-500">姓名：</span>
                <span className="font-medium">{mockEmployeeDetail.name}</span>
              </div>
              <div>
                <span className="text-gray-500">部门：</span>
                <span className="font-medium">{mockEmployeeDetail.department}</span>
              </div>
              <div>
                <span className="text-gray-500">职位：</span>
                <span className="font-medium">{mockEmployeeDetail.position}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">考核详情</h2>
          <DepartmentAssessmentTable
            categories={categories}
            readOnly={true}
            canRemoveCategory={false}
          />
        </div>
      </div>
    </div>
  )
}
