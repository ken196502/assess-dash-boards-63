import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Plus, FileText, Copy } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

interface Template {
  id: string
  type: 'department' | 'personal'
  department: string
  level?: '员工' | '主管'
  changeLog: string
  lastModified: string
  version: string
  usageCount: number
}

import { templateData } from "@/data/templateData"

export default function UnifiedTemplateManagement() {
  const [templates] = useState<Template[]>(templateData)
  const [activeTab, setActiveTab] = useState<'department' | 'personal'>('department')
  const [selectedYear, setSelectedYear] = useState<string>("2025")
  const navigate = useNavigate()

  const filteredTemplates = templates.filter(template => {
    const matchesType = template.type === activeTab
    const matchesYear = template.version.startsWith(selectedYear)
    return matchesType && matchesYear
  })

  const handleEditTemplate = (templateId: string) => {
    navigate(`/template-detail/${templateId}`)
  }

  const handleCreateTemplate = () => {
    navigate(`/template-detail/new?type=${activeTab}`)
  }

  const handleCopyTemplate = (template: Template) => {
    toast({
      title: "复制成功",
      description: `已复制 ${template.department}${activeTab === 'department' ? '部门' : `${template.level}个人`}考核模板`,
    })
  }

  const getTypeLabel = (type: 'department' | 'personal') => {
    return type === 'department' ? '部门考核' : '个人考核'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">考核模板管理</h1>
              <p className="text-sm md:text-base text-gray-600">统一管理部门考核和个人考核模板</p>
            </div>
            <Button onClick={handleCreateTemplate} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              新建{getTypeLabel(activeTab)}模板
            </Button>
          </div>

          {/* 标签页切换和年份筛选 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab('department')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'department'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                部门考核模板
              </button>
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'personal'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                个人考核模板
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">年份：</span>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">部门</TableHead>
                {activeTab === 'personal' && (
                  <TableHead className="w-[12%]">职级</TableHead>
                )}
                <TableHead className="w-[20%]">版本</TableHead>
                <TableHead className="w-[30%]">变动日志</TableHead>
                <TableHead className="w-[18%]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.department}</TableCell>
                  {activeTab === 'personal' && (
                    <TableCell>
                      <Badge variant={template.level === '主管' ? 'default' : 'secondary'}>
                        {template.level}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-sm">
                    <span className="font-medium text-gray-900">{template.version.substring(0, 4)}</span>
                    <span className="text-gray-500">（已用{template.usageCount}次）</span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{template.changeLog}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTemplate(template.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyTemplate(template)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        复制
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTemplates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={activeTab === 'personal' ? 5 : 4} className="text-center py-8 text-gray-500">
                    暂无{getTypeLabel(activeTab)}模板，
                    <Button variant="link" onClick={handleCreateTemplate} className="p-0 ml-1">
                      立即创建
                    </Button>
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