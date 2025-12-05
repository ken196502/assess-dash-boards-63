import { TableHeader, TableHead, TableRow } from "@/components/ui/table"

interface KPITableHeaderProps {
  mode: 'template' | 'usage'
}

export function KPITableHeader({ mode }: KPITableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[10%]">类别</TableHead>
        <TableHead className="w-[10%]">说明</TableHead>
        <TableHead className="w-[8%]">指标</TableHead>
        <TableHead className="w-[6%]">要求/目标</TableHead>
        <TableHead className="w-[10%]">口径说明</TableHead>
        <TableHead className="w-[5%]">指标权重</TableHead>
        <TableHead className="w-[7%] text-right">评价人</TableHead>
        <TableHead className="w-[5%]">评价人权重</TableHead>
        {mode === 'template' && <TableHead className="w-[5%]">评价顺序</TableHead>}
        <TableHead className="w-[6%]">评估分数</TableHead>
        {mode === 'usage' && <TableHead className="w-[10%]">评估备注</TableHead>}
        {mode === 'usage' && <TableHead className="w-[6%]">已邀请</TableHead>}
        {mode === 'usage' && <TableHead className="w-[10%]">操作</TableHead>}
      </TableRow>
    </TableHeader>
  )
}