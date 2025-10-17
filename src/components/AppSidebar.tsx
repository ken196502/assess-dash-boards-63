import { Building2, User, FileText, Settings, BarChart3, HelpCircle } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const items = [
  { title: "数据看板", url: "/", icon: BarChart3 },
  { title: "部门考核管理", url: "/department", icon: Building2 },
  { title: "个人考核管理", url: "/personal", icon: User },
  { title: "考核模板管理", url: "/template-management", icon: FileText },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // 页面加载时自动弹出系统说明
    const timer = setTimeout(() => {
      setIsDialogOpen(true)
    }, 1000) // 延迟1秒弹出，避免影响页面加载体验

    return () => clearTimeout(timer)
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>考核管理系统</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        isActive ? "bg-accent text-accent-foreground font-medium" : ""
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left font-normal"
                size="sm"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {open && <span>考核系统说明</span>}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>考核系统说明</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 text-sm">
                {/* 业务部门考核标准 */}
                <div>
                  <h3 className="font-semibold text-base mb-3">业务部门考核标准</h3>
                  <p className="mb-3 text-gray-600">业务部门年初制定的年度绩效考核目标进行绩效考核。</p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left border-b">年度绩效得分</th>
                          <th className="px-4 py-2 text-left border-b">年度绩效结果</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2">90及以上</td>
                          <td className="px-4 py-2">A（优秀）</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">[80,90）</td>
                          <td className="px-4 py-2">B（称职）</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">[60,80）</td>
                          <td className="px-4 py-2">C（基本称职）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">60以下</td>
                          <td className="px-4 py-2">D（不称职）</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 中后台部门考核标准 */}
                <div>
                  <h3 className="font-semibold text-base mb-3">中后台部门考核标准</h3>
                  <p className="mb-3 text-gray-600">中后台部门依据目标完成情况进行评价，确定绩效得分。</p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left border-b">年度绩效得分</th>
                          <th className="px-4 py-2 text-left border-b">年度绩效结果</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2">90及以上，且排名前3位</td>
                          <td className="px-4 py-2">A（优秀）</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">[80,90）</td>
                          <td className="px-4 py-2">B（称职）</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">[60,80）</td>
                          <td className="px-4 py-2">C（基本称职）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">60以下</td>
                          <td className="px-4 py-2">D（不称职）</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 考核流程 */}
                <div>
                  <h3 className="font-semibold text-base mb-3">考核流程</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">1</div>
                      <div>
                        <p className="font-medium">人力设置部门模板</p>
                        <p className="text-gray-600 text-xs">包括评估人设置</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">2</div>
                      <div>
                        <p className="font-medium">人力手动发送邀请评价</p>
                         <p className="text-gray-600 text-xs">企微通知和邮件通知</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">3</div>
                      <div>
                        <p className="font-medium">评估人收到通知</p>
                        <p className="text-gray-600 text-xs">在企微和邮件中点击链接进入评估页面</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">4</div>
                      <div>
                        <p className="font-medium">评估人进行评价</p>
                        <p className="text-gray-600 text-xs">仅能看到需要自己评的模块</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">5</div>
                      <div>
                        <p className="font-medium">系统自动更新结果</p>
                        <p className="text-gray-600 text-xs">评估后自动计算并更新结果</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">6</div>
                      <div>
                        <p className="font-medium">年度考核时间</p>
                        <p className="text-gray-600 text-xs">每年第一季度结束上一年评估</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
