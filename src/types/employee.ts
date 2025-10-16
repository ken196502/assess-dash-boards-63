export interface Employee {
  id: string
  employeeId: string // 工号
  department: string // 部门
  name: string // 姓名
  position: string // 职位
  level: '员工' | '主管' // 职级
  annualScore: number // 年度绩效考核分数
  annualGrade: 'A' | 'B' | 'C' | 'D' | 'E' // 年度考核等级
  year: number // 年度
}
