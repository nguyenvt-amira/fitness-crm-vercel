"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from "react"
import { FetchNextPageOptions, FetchPreviousPageOptions, RefetchOptions } from "@tanstack/react-query"
import { Button } from "./button"
import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    variant?: 'default' | 'simple'; // 'default' = infinite scroll, 'simple' = standard table
    isFetching?: boolean;
    isLoading?: boolean;
    hasNextPage?: boolean;
    fetchNextPage?: (
        options?: FetchNextPageOptions | undefined,
    ) => Promise<unknown>;
    fetchPreviousPage?: (
        options?: FetchPreviousPageOptions | undefined,
    ) => Promise<unknown>;
    refetch?: (options?: RefetchOptions | undefined) => void;
    totalRows?: number;
    filterRows?: number;
    totalRowsFetched?: number;
    className?: string;
    onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    variant = 'default',
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    // fetchPreviousPage,
    // refetch,
    totalRows = 0,
    filterRows = 0,
    totalRowsFetched = 0,
    className,
    onRowClick,
}: Readonly<DataTableProps<TData, TValue>>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    const tableRef = React.useRef<HTMLTableElement>(null);
    const onScroll = React.useCallback(
        (e: React.UIEvent<HTMLElement>) => {
            const onPageBottom =
                Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >=
                e.currentTarget.scrollHeight;

            if (onPageBottom && !isFetching && totalRowsFetched < filterRows) {
                fetchNextPage?.();
            }
        },
        [fetchNextPage, isFetching, filterRows, totalRowsFetched],
    );
    
    // Simple table mode (no pagination)
    if (variant === 'simple') {
        return (
            <div className={cn("overflow-hidden rounded-md border", className)}>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-50/50">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="h-10 px-4">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onRowClick?.(row.original)}
                                    className={cn("h-12", onRowClick ? "cursor-pointer" : "")}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        )
    }
    
    // Default mode (infinite scroll)
    return (
        <div className={cn("overflow-hidden ", className)}>
            <Table
                ref={tableRef}
                onScroll={onScroll}
                containerClassName="max-h-[calc(100vh-361px)] rounded-md border">
                <TableHeader className={cn("sticky top-0 z-20 bg-background")}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}
                        className={cn(
                            "bg-neutral-100 hover:bg-neutral-200",
                            "[&>*]:border-b",
                          )}
                        >
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                onClick={() => onRowClick?.(row.original)}
                                className={onRowClick ? "cursor-pointer" : ""}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                        <TableCell colSpan={columns.length} className="text-center">
                            {hasNextPage || isFetching || isLoading ? (
                                <Button
                                    disabled={isFetching || isLoading}
                                    onClick={() => fetchNextPage?.()}
                                    size="sm"
                                    variant="outline"
                                >
                                    {isFetching ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Load More
                                </Button>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No more data to load ({" "}
                                    <span className="font-mono font-medium">{filterRows}</span>
                                    {" "}of{" "}
                                    <span className="font-mono font-medium">{totalRows}</span>
                                    {" "}rows)
                                </p>
                            )}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}