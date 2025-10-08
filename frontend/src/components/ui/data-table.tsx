import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, item: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  title: string
  description: string
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (id: string) => void
  loading?: boolean
  emptyMessage?: string
}

export function DataTable<T extends { id: string }>({
  title,
  description,
  data,
  columns,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'No data found'
}: TableProps<T>) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th key={String(column.key)} className="text-left p-2 font-medium">
                      {column.label}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="text-left p-2 font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    {columns.map((column) => (
                      <td key={String(column.key)} className={`p-2 ${column.className || ''}`}>
                        {column.render 
                          ? column.render(item[column.key as keyof T], item)
                          : String(item[column.key as keyof T] || '-')
                        }
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="p-2">
                        <div className="flex gap-2">
                          {onEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(item)}
                            >
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(item.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
