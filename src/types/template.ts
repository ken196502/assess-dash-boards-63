export interface AssessmentTemplate {
  id: string
  department: string // 部门
  position: string // 职务
  changeLog: string // 变动日志
  items: TemplateItem[]
}

export interface TemplateItem {
  id: string
  category: string // 类别
  description: string // 说明
  indicator: string // 指标
  target: string // 要求/目标
  caliber: string // 口径说明
  evaluator: string // 评价人
  weight: number // 权重
}
