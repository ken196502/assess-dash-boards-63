import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, Users, Target, Award, Building2, User, Calendar, Eye, EyeOff, Edit, Download } from 'lucide-react'
import { getDepartmentList } from '@/data/templateData'
import { toast } from '@/hooks/use-toast'

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

// 模拟数据
const departmentScores = [
  { name: '销售部门', score: 85, target: 80, completed: 12, total: 15 },
  { name: '技术部门', score: 92, target: 85, completed: 14, total: 16 },
  { name: '人事部门', score: 78, target: 75, completed: 8, total: 10 },
  { name: '财务部门', score: 88, target: 82, completed: 11, total: 12 },
]

// 部门维度数据 - 绩效分布
const departmentKpiData = [
  { name: 'A', value: 1, color: '#10B981' },
  { name: 'B', value: 2, color: '#3B82F6' },
  { name: 'C', value: 1, color: '#F59E0B' },
  { name: 'D', value: 0, color: '#EF4444' },
]

const departmentPerformanceData = [
  { range: '90-100', count: 1, percentage: 25 },
  { range: '80-89', count: 2, percentage: 50 },
  { range: '70-79', count: 1, percentage: 25 },
  { range: '60-69', count: 0, percentage: 0 },
  { range: '60以下', count: 0, percentage: 0 },
]

// 个人维度数据 - 绩效分布
const personalKpiData = [
  { name: 'A', value: 12, color: '#10B981' },
  { name: 'B', value: 28, color: '#3B82F6' },
  { name: 'C', value: 24, color: '#F59E0B' },
  { name: 'D', value: 16, color: '#EF4444' },
]

const personalPerformanceData = [
  { range: '90-100', count: 12, percentage: 15 },
  { range: '80-89', count: 28, percentage: 35 },
  { range: '70-79', count: 24, percentage: 30 },
  { range: '60-69', count: 12, percentage: 15 },
  { range: '60以下', count: 4, percentage: 5 },
]

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'department' | 'personal'>('department')
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [showCharts, setShowCharts] = useState<boolean>(false)
  const [departments] = useState<DepartmentAssessment[]>(mockDepartments)
  
  // 生成年度选项
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => year.toString())
  
  const handleViewDetail = (department: DepartmentAssessment) => {
    navigate(`/department/${department.id}`, { state: { department } })
  }

  const handleExport = () => {
    toast({
      title: "导出功能",
      description: "部门考核数据导出功能尚未开发",
    })
  }

  const filteredDepartments = departments.filter(dept => dept.year.toString() === selectedYear)
  
  // 部门维度指标
  const totalDepartments = 4
  const completedDepartmentAssessments = 3
  const avgDepartmentScore = 85.8
  const departmentOnTimeRate = 75
  
  // 个人维度指标
  const totalEmployees = 80
  const completedPersonalAssessments = 45
  const avgPersonalScore = 85.2
  const personalOnTimeRate = 92
  
  // 根据当前标签页选择数据
  const currentKpiData = activeTab === 'department' ? departmentKpiData : personalKpiData
  const currentPerformanceData = activeTab === 'department' ? departmentPerformanceData : personalPerformanceData
  const currentTotal = activeTab === 'department' ? totalDepartments : totalEmployees
  const currentCompleted = activeTab === 'department' ? completedDepartmentAssessments : completedPersonalAssessments
  const currentAvgScore = activeTab === 'department' ? avgDepartmentScore : avgPersonalScore
  const currentOnTimeRate = activeTab === 'department' ? departmentOnTimeRate : personalOnTimeRate

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* 页面标题 */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">考核数据看板</h1>
              <p className="text-sm md:text-base text-gray-600">全面了解组织绩效考核情况和数据分析</p>
            </div>
            
            {/* 年度筛选 */}
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

          {/* 维度切换标签 */}
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-4 md:mb-6">
            <button
              onClick={() => setActiveTab('department')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'department'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              部门维度
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              个人维度
            </button>
          </div>
        </div>

        {/* 关键指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {activeTab === 'department' ? '总部门数' : '总参与人数'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentTotal}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成考核</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentCompleted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均得分</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentAvgScore}</div>
            </CardContent>
          </Card>

        </div>

        {/* 图表区域标题和切换 */}
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCharts(!showCharts)}
            className="flex items-center gap-2"
          >
            {showCharts ? (
              <>
                <EyeOff className="w-4 h-4" />
                隐藏图表
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                显示图表
              </>
            )}
          </Button>
        </div>

        {/* 图表区域 */}
        {showCharts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* 绩效分布 */}
            <Card>
              <CardHeader>
                <CardTitle>绩效分布</CardTitle>
                <CardDescription>
                  {activeTab === 'department' ? '部门绩效等级分布' : '个人绩效等级分布'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currentKpiData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, value}) => `${name} ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {currentKpiData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 绩效分数分布 */}
            <Card>
              <CardHeader>
                <CardTitle>绩效分数分布</CardTitle>
                <CardDescription>
                  {activeTab === 'department' ? '部门绩效得分区间分布' : '非管理层绩效得分区间分布'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={currentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 详细数据表格 */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                {activeTab === 'department' ? '部门详细数据' : '个人考核概览'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'department' ? '各部门考核完成情况详细统计' : '个人考核完成情况汇总'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'department' ? (
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
                              onClick={() => handleViewDetail(dept)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {dept.score !== null ? (
                                <Eye className="w-4 h-4 mr-1" />
                              ) : (
                                <Edit className="w-4 h-4 mr-1 text-orange-500" />
                              )}
                              {dept.score !== null ? (
                                <span>查看详情</span>
                              ) : (
                                <span className="text-orange-500">去评价</span>
                              )}
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
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">部门</TableHead>
                      <TableHead className="whitespace-nowrap">部门绩效</TableHead>
                      <TableHead className="whitespace-nowrap">A（优秀）90分及以上</TableHead>
                      <TableHead className="whitespace-nowrap">B（称职）[80,90)</TableHead>
                      <TableHead className="whitespace-nowrap">C（基本称职）[60,80)</TableHead>
                      <TableHead className="whitespace-nowrap">D（不称职）60分以下</TableHead>
                      <TableHead className="whitespace-nowrap">总人数</TableHead>
                      <TableHead className="whitespace-nowrap">平均分</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentScores.map((dept) => {
                      const excellent = Math.floor(dept.total * 0.15)
                      const good = Math.floor(dept.total * 0.35)
                      const qualified = Math.floor(dept.total * 0.30)
                      const needsImprovement = dept.total - excellent - good - qualified
                      return (
                        <TableRow key={dept.name}>
                          <TableCell 
                            className="font-medium whitespace-nowrap text-blue-600 cursor-pointer hover:underline"
                            onClick={() => navigate(`/personal?department=${encodeURIComponent(dept.name)}`)}
                          >
                            {dept.name}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              dept.score >= 90 
                                ? 'bg-green-100 text-green-800' 
                                : dept.score >= 80
                                ? 'bg-blue-100 text-blue-800'
                                : dept.score >= 70
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {dept.score >= 90 ? 'A' : dept.score >= 80 ? 'B' : dept.score >= 70 ? 'C' : 'D'}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-green-600 font-semibold">{excellent}人</div>
                            <div className="text-xs text-gray-500">{Math.round(excellent / dept.total * 100)}%</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-blue-600 font-semibold">{good}人</div>
                            <div className="text-xs text-gray-500">{Math.round(good / dept.total * 100)}%</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-yellow-600 font-semibold">{qualified}人</div>
                            <div className="text-xs text-gray-500">{Math.round(qualified / dept.total * 100)}%</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-orange-600 font-semibold">{needsImprovement}人</div>
                            <div className="text-xs text-gray-500">{Math.round(needsImprovement / dept.total * 100)}%</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-semibold">{dept.total}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className={`font-semibold ${
                              dept.score >= 90 ? 'text-green-600' : 
                              dept.score >= 80 ? 'text-blue-600' : 
                              dept.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {dept.score}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {/* 合计行 */}
                    <TableRow className="bg-gray-50 font-semibold">
                      <TableCell className="whitespace-nowrap">全部合计</TableCell>
                      <TableCell className="whitespace-nowrap">-</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-green-600">
                          {departmentScores.reduce((sum, dept) => sum + Math.floor(dept.total * 0.15), 0)}人
                        </div>
                        <div className="text-xs text-gray-500">15%</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-blue-600">
                          {departmentScores.reduce((sum, dept) => sum + Math.floor(dept.total * 0.35), 0)}人
                        </div>
                        <div className="text-xs text-gray-500">35%</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-yellow-600">
                          {departmentScores.reduce((sum, dept) => sum + Math.floor(dept.total * 0.30), 0)}人
                        </div>
                        <div className="text-xs text-gray-500">30%</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-orange-600">
                          {departmentScores.reduce((sum, dept) => {
                            const excellent = Math.floor(dept.total * 0.15)
                            const good = Math.floor(dept.total * 0.35)
                            const qualified = Math.floor(dept.total * 0.30)
                            return sum + (dept.total - excellent - good - qualified)
                          }, 0)}人
                        </div>
                        <div className="text-xs text-gray-500">20%</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {departmentScores.reduce((sum, dept) => sum + dept.total, 0)}人
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="text-blue-600">
                          {(departmentScores.reduce((sum, dept) => sum + dept.score * dept.total, 0) / 
                            departmentScores.reduce((sum, dept) => sum + dept.total, 0)).toFixed(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}