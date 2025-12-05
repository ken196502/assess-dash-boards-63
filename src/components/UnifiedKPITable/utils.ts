import { KPI, Category } from "@/types/assessment"

// 计算总加权分数: sum(正数评分×指标权重×评价人权重) - sum(abs(负数评分))
export const calculateTotalWeightedScore = (categories: Category[]) => {
  let totalScore = 0
  let hasAnyScore = false

  categories.forEach(category => {
    category.kpis.forEach(kpi => {
      const kpiWeight = parseFloat(kpi.weight?.replace('%', '') || '0') / 100

      kpi.evaluators.forEach(evaluator => {
        if (evaluator.score !== undefined) {
          const evalWeight = parseFloat(evaluator.weight.replace('%', '')) / 100
          if (!isNaN(evalWeight) && !isNaN(kpiWeight)) {
            // 负数不乘以权重，直接减去绝对值
            if (evaluator.score < 0) {
              totalScore -= Math.abs(evaluator.score)
            } else {
              totalScore += evaluator.score * kpiWeight * evalWeight
            }
            hasAnyScore = true
          }
        }
      })
    })
  })

  return hasAnyScore ? totalScore.toFixed(1) : '--'
}

// 计算指标的评价人权重总和
export const calculateEvaluatorWeightSum = (kpi: KPI) => {
  return kpi.evaluators.reduce((sum, evaluator) => {
    const weight = parseFloat(evaluator.weight.replace('%', '')) || 0
    return sum + weight
  }, 0)
}

// 检查评价人权重是否等于100%
export const isEvaluatorWeightValid = (kpi: KPI) => {
  const sum = calculateEvaluatorWeightSum(kpi)
  return kpi.evaluators.length === 0 || sum === 100
}