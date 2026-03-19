'use client';

import { AlertTriangle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FamilyRegistrationRiskDetailsSection({
  riskScore,
}: Readonly<{
  riskScore?: number | null;
}>) {
  if (!riskScore || riskScore <= 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="text-destructive size-5" />
          リスク判定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">リスクスコア</span>
            <span className="text-destructive text-2xl font-bold">{riskScore}</span>
          </div>
          <div className="text-muted-foreground mt-2 text-sm">
            詳細理由は現在モック未対応（`risk-evaluation` 連携で拡張予定）
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
