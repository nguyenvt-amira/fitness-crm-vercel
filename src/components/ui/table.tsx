"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TableSize = "default" | "md"

const TableSizeContext = React.createContext<TableSize>("default")

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  size?: TableSize;
}
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, onScroll, size = "default", ...props }, ref) => {
    return (
      <TableSizeContext.Provider value={size}>
        <div
          data-slot="table-container"
          className={cn("relative w-full overflow-x-auto", containerClassName)}
          {...{ onScroll }}
        >
          <table
            data-slot="table"
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
          />
        </div>
      </TableSizeContext.Provider>
    )
  }
)

Table.displayName = "Table"


function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-background sticky top-0 z-10 [&_tr]:h-10 [&_tr]:border-b [&_tr]:bg-muted/50 [&_tr]:hover:bg-muted/50",
        className,
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  const size = React.useContext(TableSizeContext)

  return (
    <tr
      data-slot="table-row"
      className={cn(
        "relative z-0 hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        size === "md" ? "h-10" : "h-12",
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-4 text-left align-middle text-xs font-semibold whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 align-middle text-xs whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
