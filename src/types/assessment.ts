
export interface Evaluator {
  id: string
  name: string
  weight: string
  score?: number // 每个评估人的分数
  remark?: string // 评分备注
  invited?: boolean // 是否已邀请
}

export interface KPI {
  id: string
  name: string
  target: string
  evaluators: Evaluator[]
  description: string
}

export interface Category {
  id: string
  name: string
  description: string
  kpis: KPI[]
}

export interface Department {
  id: string
  name: string
  description: string
  categories: Category[]
  kpis: KPI[]
}
