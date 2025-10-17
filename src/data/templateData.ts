// 共享的模板数据源
export interface TemplateData {
  id: string
  type: 'department' | 'personal'
  department: string
  level?: '员工' | '主管'
  changeLog: string
  lastModified: string
}

export const templateData: TemplateData[] = [
  {
    id: "dept-1",
    type: "department",
    department: "销售部门",
    changeLog: "2024-01-15 创建模板",
    lastModified: "2024-01-15"
  },
  {
    id: "dept-2", 
    type: "department",
    department: "技术部门",
    changeLog: "2024-02-20 更新权重配置",
    lastModified: "2024-02-20"
  },
  {
    id: "dept-3", 
    type: "department",
    department: "人事部门",
    changeLog: "2024-03-01 初始化模板",
    lastModified: "2024-03-01"
  },
  {
    id: "dept-4", 
    type: "department",
    department: "财务部门",
    changeLog: "2024-03-05 新建模板",
    lastModified: "2024-03-05"
  },
  {
    id: "personal-1",
    type: "personal",
    department: "销售部门",
    level: "主管",
    changeLog: "2024-01-15 创建模板",
    lastModified: "2024-01-15"
  },
  {
    id: "personal-2",
    type: "personal",
    department: "技术部门",
    level: "员工",
    changeLog: "2024-02-20 更新权重",
    lastModified: "2024-02-20"
  },
  {
    id: "personal-3",
    type: "personal",
    department: "销售部门",
    level: "员工",
    changeLog: "2024-02-25 新增模板",
    lastModified: "2024-02-25"
  }
]

// 获取部门考核模板列表
export const getDepartmentTemplates = (): TemplateData[] => {
  return templateData.filter(template => template.type === 'department')
}

// 获取个人考核模板列表
export const getPersonalTemplates = (): TemplateData[] => {
  return templateData.filter(template => template.type === 'personal')
}

// 根据ID获取模板
export const getTemplateById = (templateId: string): TemplateData | undefined => {
  return templateData.find(template => template.id === templateId)
}

// 获取部门列表（从部门模板中提取）
export const getDepartmentList = (): string[] => {
  const departmentTemplates = getDepartmentTemplates()
  return departmentTemplates.map(template => template.department)
}