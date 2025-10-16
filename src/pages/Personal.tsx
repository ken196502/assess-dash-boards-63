import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Eye } from "lucide-react"
import { Employee } from "@/types/employee"
import { toast } from "@/hooks/use-toast"

const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "E001",
    department: "业务部门",
    name: "张三",
    position: "经理",
    level: "主管",
    annualScore: 85.5,
    annualGrade: "A",
    year: 2024
  },
  {
    id: "2",
    employeeId: "E002",
    department: "技术部门",
    name: "李四",
    position: "工程师",
    level: "员工",
    annualScore: 78.3,
    annualGrade: "B",
    year: 2024
  },
  {
    id: "3",
    employeeId: "E003",
    department: "业务部门",
    name: "王五",
    position: "主管",
    level: "主管",
    annualScore: 92.1,
    annualGrade: "A",
    year: 2024
  }
]

export default function Personal() {
  const navigate = useNavigate()
  const [employees] = useState<Employee[]>(mockEmployees)
  const [filters, setFilters] = useState({
    department: "all",
    name: "",
    position: "",
    level: "all",
    year: "2024"
  })

  const handleImportEmployees = () => {
    toast({
      title: "导入功能",
      description: "员工信息导入功能尚未开发",
    })
  }

  const handleViewDetail = (employeeId: string) => {
    navigate(`/personal/${employeeId}`)
  }

  // 筛选逻辑
  const filteredEmployees = employees.filter(emp => {
    if (filters.department !== "all" && emp.department !== filters.department) return false
    if (filters.name && !emp.name.includes(filters.name)) return false
    if (filters.position && !emp.position.includes(filters.position)) return false
    if (filters.level !== "all" && emp.level !== filters.level) return false
    if (filters.year && emp.year.toString() !== filters.year) return false
    return true
  })

  // 获取所有唯一的部门
  const departments = Array.from(new Set(employees.map(emp => emp.department)))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">个人考核管理</h1>
              <p className="text-gray-600">管理员工个人绩效考核信息</p>
            </div>
            <Button onClick={handleImportEmployees} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              导入员工信息
            </Button>
          </div>

          {/* 筛选区域 */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">部门</label>
                <Select 
                  value={filters.department} 
                  onValueChange={(value) => setFilters({...filters, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">姓名</label>
                <Input 
                  placeholder="搜索姓名" 
                  value={filters.name}
                  onChange={(e) => setFilters({...filters, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">职位</label>
                <Input 
                  placeholder="搜索职位" 
                  value={filters.position}
                  onChange={(e) => setFilters({...filters, position: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">职级</label>
                <Select 
                  value={filters.level} 
                  onValueChange={(value) => setFilters({...filters, level: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部职级</SelectItem>
                    <SelectItem value="员工">员工</SelectItem>
                    <SelectItem value="主管">主管</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">年度</label>
                <Select 
                  value={filters.year} 
                  onValueChange={(value) => setFilters({...filters, year: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* 员工列表表格 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[10%]">工号</TableHead>
                <TableHead className="w-[12%]">部门</TableHead>
                <TableHead className="w-[10%]">姓名</TableHead>
                <TableHead className="w-[12%]">职位</TableHead>
                <TableHead className="w-[10%]">职级</TableHead>
                <TableHead className="w-[14%]">年度绩效考核分数</TableHead>
                <TableHead className="w-[14%]">年度考核等级</TableHead>
                <TableHead className="w-[18%]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employeeId}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${employee.level === '主管' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {employee.level}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-blue-600">{employee.annualScore}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${employee.annualGrade === 'A' ? 'bg-green-100 text-green-800' : ''}
                        ${employee.annualGrade === 'B' ? 'bg-blue-100 text-blue-800' : ''}
                        ${employee.annualGrade === 'C' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${employee.annualGrade === 'D' ? 'bg-orange-100 text-orange-800' : ''}
                        ${employee.annualGrade === 'E' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {employee.annualGrade}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetail(employee.id)}
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
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    暂无符合条件的员工数据
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
