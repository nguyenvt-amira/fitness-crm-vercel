'use client';

import { useState } from 'react';

import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';

type RiskDetailsSectionProps = {
  riskScore: number;
  riskReason: string;
  riskDetails?: Array<{
    reason: string;
    score: number;
    description: string;
  }>;
};

export function RiskDetailsSection({
  riskScore,
  riskReason,
  riskDetails = [],
}: RiskDetailsSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="text-destructive size-5" />
          リスク判定詳細
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Risk Score */}
        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">リスクスコア合計</span>
            <span className="text-destructive text-2xl font-bold">{riskScore}</span>
          </div>
          <div className="text-muted-foreground mt-2 text-sm">理由：{riskReason}</div>
        </div>

        {/* Risk Factors Breakdown */}
        {riskDetails.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">要素別内訳</h3>
            {riskDetails.map((detail, index) => (
              <div key={index} className="rounded-lg border">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{detail.reason}</span>
                    <span className="text-muted-foreground text-sm">配点：{detail.score}</span>
                  </div>
                  {expandedItems.has(index) ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </Button>
                {expandedItems.has(index) && (
                  <div className="bg-muted/30 border-t p-4">
                    <p className="text-muted-foreground text-sm">{detail.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Recommended Actions */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
          <h3 className="mb-2 font-medium text-amber-900">推奨アクション</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-800">
            <li>本人確認書類の再確認</li>
            <li>追加情報の取得</li>
            <li>手動審査の実施</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
