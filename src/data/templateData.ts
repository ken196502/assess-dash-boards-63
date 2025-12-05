// 共享的模板数据源
export interface TemplateData {
  id: string
  type: 'department' | 'personal'
  department: string
  level?: '非管理层' | '管理层'
  changeLog: string
  lastModified: string
  version: string
  usageCount: number
}

export const templateData: TemplateData[] = [
  {
    id: "dept-1",
    type: "department",
    department: "销售部门",
    changeLog: "2024-01-15 admin 创建模板",
    lastModified: "2024-01-15",
    version: "20240115",
    usageCount: 16
  },
  {
    id: "dept-2", 
    type: "department",
    department: "技术部门",
    changeLog: "2024-02-20 admin 编辑模板",
    lastModified: "2024-02-20",
    version: "20240220",
    usageCount: 8
  },
  {
    id: "dept-3", 
    type: "department",
    department: "人事部门",
    changeLog: "2024-03-01 admin 创建模板",
    lastModified: "2024-03-01",
    version: "20240301",
    usageCount: 12
  },
  {
    id: "dept-4", 
    type: "department",
    department: "财务部门",
    changeLog: "2024-03-05 admin 创建模板",
    lastModified: "2024-03-05",
    version: "20240305",
    usageCount: 5
  },
  {
    id: "personal-1",
    type: "personal",
    department: "销售部门",
    level: "管理层",
    changeLog: "2024-01-15 admin 创建模板",
    lastModified: "2024-01-15",
    version: "20240115",
    usageCount: 23
  },
  {
    id: "personal-2",
    type: "personal",
    department: "技术部门",
    level: "非管理层",
    changeLog: "2024-02-20 admin 编辑模板",
    lastModified: "2024-02-20",
    version: "20240220",
    usageCount: 14
  },
  {
    id: "personal-3",
    type: "personal",
    department: "销售部门",
    level: "非管理层",
    changeLog: "2024-02-25 admin 创建模板",
    lastModified: "2024-02-25",
    version: "20240225",
    usageCount: 9
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