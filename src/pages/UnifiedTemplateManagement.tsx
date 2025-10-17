import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Plus, FileText, Play } from "lucide-react"
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
}

import { templateData } from "@/data/templateData"

export default function UnifiedTemplateManagement() {
  const [templates] = useState<Template[]>(templateData)
  const [activeTab, setActiveTab] = useState<'department' | 'personal'>('department')
  const navigate = useNavigate()

  const filteredTemplates = templates.filter(template => template.type === activeTab)

  const handleEditTemplate = (templateId: string) => {
    navigate(`/template-detail/${templateId}`)
  }

  const handleCreateTemplate = () => {
    navigate(`/template-detail/new?type=${activeTab}`)
  }

  const handleLaunchTemplate = (template: Template) => {
    // 模拟启动模板的逻辑
    toast({
      title: "启动成功",
      description: `${template.department}${activeTab === 'department' ? '部门' : `${template.level}个人`}考核模板已启动，相关评价人将收到通知`,
    })
  }

  const getTypeLabel = (type: 'department' | 'personal') => {
    return type === 'department' ? '部门考核' : '个人考核'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">考核模板管理</h1>
              <p className="text-gray-600">统一管理部门考核和个人考核模板</p>
            </div>
            <Button onClick={handleCreateTemplate} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              新建{getTypeLabel(activeTab)}模板
            </Button>
          </div>

          {/* 标签页切换 */}
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
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
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">部门</TableHead>
                {activeTab === 'personal' && (
                  <TableHead className="w-[15%]">职级</TableHead>
                )}
                <TableHead className="w-[35%]">变动日志</TableHead>
                <TableHead className="w-[25%]">操作</TableHead>
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
                      
                      {activeTab === 'personal' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              启动
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认启动考核模板</AlertDialogTitle>
                              <AlertDialogDescription>
                                启动后自动通知该部门所有评价人，是否继续？
                                <br />
                                <span className="text-sm text-gray-500 mt-2 block">
                                  模板：{template.department} - {template.level}
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleLaunchTemplate(template)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                确认启动
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTemplates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={activeTab === 'personal' ? 4 : 3} className="text-center py-8 text-gray-500">
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