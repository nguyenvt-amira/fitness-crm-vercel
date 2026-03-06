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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    isFetching?: boolean;
    isLoading?: boolean;
    hasNextPage?: boolean;
    fetchNextPage: (
        options?: FetchNextPageOptions | undefined,
    ) => Promise<unknown>;
    fetchPreviousPage?: (
        options?: FetchPreviousPageOptions | undefined,
    ) => Promise<unknown>;
    refetch: (options?: RefetchOptions | undefined) => void;
    totalRows?: number;
    filterRows?: number;
    totalRowsFetched?: number;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    // fetchPreviousPage,
    // refetch,
    totalRows = 0,
    filterRows = 0,
    totalRowsFetched = 0,
}: DataTableProps<TData, TValue>) {
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
                fetchNextPage();
            }
        },
        [fetchNextPage, isFetching, filterRows, totalRowsFetched],
    );
    return (
        <div className="overflow-hidden rounded-md border">
            <Table
                ref={tableRef}
                onScroll={onScroll}>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
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
                                    onClick={() => fetchNextPage()}
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
                                    No more data to load (
                                    <span className="font-mono font-medium">
                                        {filterRows}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-mono font-medium">
                                        {totalRows}
                                    </span>{" "}
                                    rows)
                                </p>
                            )}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}