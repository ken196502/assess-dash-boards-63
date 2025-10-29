import React, { useState } from 'react'
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
import { TrendingUp, Users, Target, Award, Building2, User, Calendar } from 'lucide-react'
import { getDepartmentList } from '@/data/templateData'

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
  const [activeTab, setActiveTab] = useState<'department' | 'personal'>('department')
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  
  // 生成年度选项
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => year.toString())
  
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
              <p className="text-xs text-muted-foreground">
                {activeTab === 'department' ? '+1 较上月' : '+12% 较上月'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成考核</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentCompleted}</div>
              <p className="text-xs text-muted-foreground">
                完成率 {Math.round((currentCompleted / currentTotal) * 100)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均得分</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentAvgScore}</div>
              <p className="text-xs text-muted-foreground">
                {activeTab === 'department' ? '+1.5 较上月' : '+2.3 较上月'}
              </p>
            </CardContent>
          </Card>

        </div>

        {/* 图表区域 */}
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

          {/* 绩效分布 */}
          <Card>
            <CardHeader>
              <CardTitle>绩效分数分布</CardTitle>
              <CardDescription>
                {activeTab === 'department' ? '部门绩效得分区间分布' : '员工绩效得分区间分布'}
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

        {/* 详细数据表格 */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'department' ? '部门详细数据' : '个人考核概览'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'department' ? '各部门考核完成情况详细统计' : '个人考核完成情况汇总'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'department' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">部门</th>
                      <th className="text-left p-2">当前得分</th>
                      <th className="text-left p-2">绩效</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentScores.map((dept) => (
                      <tr key={dept.name} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{dept.name}</td>
                        <td className="p-2">{dept.score}</td>
                        <td className="p-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">优秀 (90-100分)</div>
                  <div className="text-2xl font-bold text-green-600">12人</div>
                  <div className="text-xs text-gray-500">占比 15%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">良好 (80-89分)</div>
                  <div className="text-2xl font-bold text-blue-600">28人</div>
                  <div className="text-xs text-gray-500">占比 35%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">合格 (70-79分)</div>
                  <div className="text-2xl font-bold text-yellow-600">24人</div>
                  <div className="text-xs text-gray-500">占比 30%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">待改进 (60-69分)</div>
                  <div className="text-2xl font-bold text-orange-600">12人</div>
                  <div className="text-xs text-gray-500">占比 15%</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}