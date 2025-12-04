import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Calendar } from "lucide-react"

interface DepartmentAssessment {
  id: string
  name: string
  score: number | null
  grade: string | null
  status: '未开始' | '进行中' | '已完成'
  year: number
}

const mockDepartments: DepartmentAssessment[] = [
  { id: "1", name: "销售部门", score: 85, grade: "A", status: "已完成", year: 2024 },
  { id: "2", name: "技术部门", score: 92, grade: "A", status: "已完成", year: 2024 },
  { id: "3", name: "人事部门", score: null, grade: null, status: "进行中", year: 2024 },
  { id: "4", name: "财务部门", score: 78, grade: "B", status: "已完成", year: 2024 },
  { id: "5", name: "市场部门", score: null, grade: null, status: "未开始", year: 2024 },
]

export default function DepartmentList() {
  const navigate = useNavigate()
  const [departments] = useState<DepartmentAssessment[]>(mockDepartments)
  const [selectedYear, setSelectedYear] = useState<string>('2024')

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => year.toString())

  const handleViewDetail = (departmentId: string) => {
    navigate(`/department/${departmentId}`)
  }

  const filteredDepartments = departments.filter(dept => dept.year.toString() === selectedYear)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">部门考核管理</h1>
              <p className="text-sm md:text-base text-gray-600">管理各部门的绩效考核指标和评价标准</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="选择年度" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">部门名称</TableHead>
                <TableHead className="whitespace-nowrap">考核状态</TableHead>
                <TableHead className="whitespace-nowrap">考核分数</TableHead>
                <TableHead className="whitespace-nowrap">考核等级</TableHead>
                <TableHead className="whitespace-nowrap">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium whitespace-nowrap">{dept.name}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${dept.status === '已完成' ? 'bg-green-100 text-green-800' : ''}
                        ${dept.status === '进行中' ? 'bg-blue-100 text-blue-800' : ''}
                        ${dept.status === '未开始' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {dept.status}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {dept.score !== null ? (
                        <span className="font-semibold text-blue-600">{dept.score}</span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {dept.grade ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${dept.grade === 'A' ? 'bg-green-100 text-green-800' : ''}
                          ${dept.grade === 'B' ? 'bg-blue-100 text-blue-800' : ''}
                          ${dept.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${dept.grade === 'D' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {dept.grade}
                        </span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetail(dept.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500 whitespace-nowrap">
                    暂无部门考核数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
