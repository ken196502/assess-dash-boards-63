
export interface Evaluator {
  id: string
  name: string
  weight: string
  score?: number // 每个评估人的分数
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
