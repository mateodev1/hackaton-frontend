import { useState } from 'react'

export function useExpandedRows() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(orderId)) {
      newExpandedRows.delete(orderId)
    } else {
      newExpandedRows.add(orderId)
    }
    setExpandedRows(newExpandedRows)
  }

  const isExpanded = (orderId: string) => expandedRows.has(orderId)

  const expandAll = (orderIds: string[]) => {
    setExpandedRows(new Set(orderIds))
  }

  const collapseAll = () => {
    setExpandedRows(new Set())
  }

  return {
    expandedRows,
    toggleRow,
    isExpanded,
    expandAll,
    collapseAll
  }
} 