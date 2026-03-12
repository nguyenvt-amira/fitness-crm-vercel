'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import type { Member } from '@/types/member.type';

interface EditMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
  onSave: (data: Partial<Member>) => Promise<void>;
}

export function EditMemberModal({ open, onOpenChange, member, onSave }: EditMemberModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nameKanji: member.basicInfo.nameKanji,
    nameKana: member.basicInfo.nameKana,
    postalCode: member.basicInfo.postalCode || '',
    prefecture: member.basicInfo.prefecture || '',
    city: member.basicInfo.city || '',
    address: member.basicInfo.address || '',
    building: member.basicInfo.building || '',
    phone: member.basicInfo.phone,
    email: member.basicInfo.email,
    emergencyContactName: member.basicInfo.emergencyContact?.name || '',
    emergencyContactRelationship: member.basicInfo.emergencyContact?.relationship || '',
    emergencyContactPhone: member.basicInfo.emergencyContact?.phone || '',
    healthStatus: member.healthInfo?.healthStatus || '',
    medicalHistory: member.healthInfo?.medicalHistory || '',
    allergies: member.healthInfo?.allergies || '',
    exerciseRestrictions: member.healthInfo?.exerciseRestrictions || '',
    marketingEmail: member.consent?.marketingConsent.email || false,
    marketingSms: member.consent?.marketingConsent.sms || false,
    marketingPush: member.consent?.marketingConsent.push || false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        basicInfo: {
          ...member.basicInfo,
          nameKanji: formData.nameKanji,
          nameKana: formData.nameKana,
          postalCode: formData.postalCode,
          prefecture: formData.prefecture,
          city: formData.city,
          address: formData.address,
          building: formData.building,
          phone: formData.phone,
          email: formData.email,
          emergencyContact: formData.emergencyContactName
            ? {
                name: formData.emergencyContactName,
                relationship: formData.emergencyContactRelationship,
                phone: formData.emergencyContactPhone,
              }
            : undefined,
        },
        healthInfo: {
          healthStatus: formData.healthStatus,
          medicalHistory: formData.medicalHistory,
          allergies: formData.allergies,
          exerciseRestrictions: formData.exerciseRestrictions,
        },
        consent: member.consent
          ? {
              ...member.consent,
              marketingConsent: {
                email: formData.marketingEmail,
                sms: formData.marketingSms,
                push: formData.marketingPush,
              },
            }
          : undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>会員情報編集</DialogTitle>
          <DialogDescription>会員情報を編集します。編集不可項目は表示のみです。</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 個人情報セクション */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">個人情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nameKanji">氏名（漢字）</Label>
                <Input
                  id="nameKanji"
                  value={formData.nameKanji}
                  onChange={(e) => setFormData({ ...formData, nameKanji: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nameKana">氏名（カナ）</Label>
                <Input
                  id="nameKana"
                  value={formData.nameKana}
                  onChange={(e) => setFormData({ ...formData, nameKana: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">郵便番号</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="prefecture">都道府県</Label>
                <Select
                  value={formData.prefecture}
                  onValueChange={(value) => setFormData({ ...formData, prefecture: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="東京都">東京都</SelectItem>
                    <SelectItem value="神奈川県">神奈川県</SelectItem>
                    <SelectItem value="埼玉県">埼玉県</SelectItem>
                    <SelectItem value="千葉県">千葉県</SelectItem>
                    {/* Add more prefectures */}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">市区町村</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">番地</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="building">建物名</Label>
                <Input
                  id="building"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 緊急連絡先セクション */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">緊急連絡先</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyName">氏名</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="emergencyRelationship">続柄</Label>
                <Input
                  id="emergencyRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactRelationship: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="emergencyPhone">電話番号</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactPhone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* 健康情報セクション */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">健康情報</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="healthStatus">健康状態申告</Label>
                <Textarea
                  id="healthStatus"
                  value={formData.healthStatus}
                  onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="medicalHistory">既往歴・持病</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="allergies">アレルギー情報</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="exerciseRestrictions">運動制限事項</Label>
                <Textarea
                  id="exerciseRestrictions"
                  value={formData.exerciseRestrictions}
                  onChange={(e) =>
                    setFormData({ ...formData, exerciseRestrictions: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* マーケティング配信同意セクション */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">マーケティング配信同意</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketingEmail"
                  checked={formData.marketingEmail}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, marketingEmail: checked === true })
                  }
                />
                <Label htmlFor="marketingEmail" className="cursor-pointer">
                  メール配信同意
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketingSms"
                  checked={formData.marketingSms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, marketingSms: checked === true })
                  }
                />
                <Label htmlFor="marketingSms" className="cursor-pointer">
                  SMS配信同意
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketingPush"
                  checked={formData.marketingPush}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, marketingPush: checked === true })
                  }
                />
                <Label htmlFor="marketingPush" className="cursor-pointer">
                  プッシュ通知同意
                </Label>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground text-sm">
              <strong>編集不可項目:</strong> 会員番号、生年月日、性別、入会日などは編集できません。
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
