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

import type { Member } from '@/types/api/member.type';

interface EditMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
  onSave: (data: Partial<Member>) => Promise<void>;
}

export function EditMemberModal({ open, onOpenChange, member, onSave }: EditMemberModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name_kanji: member.basic_info.name_kanji,
    name_kana: member.basic_info.name_kana,
    postal_code: member.basic_info.postal_code || '',
    prefecture: member.basic_info.prefecture || '',
    city: member.basic_info.city || '',
    address: member.basic_info.address || '',
    building: member.basic_info.building || '',
    phone: member.basic_info.phone,
    email: member.basic_info.email,
    emergency_contactName: member.basic_info.emergency_contact?.name || '',
    emergency_contactRelationship: member.basic_info.emergency_contact?.relationship || '',
    emergency_contactPhone: member.basic_info.emergency_contact?.phone || '',
    health_status: member.health_info?.health_status || '',
    medical_history: member.health_info?.medical_history || '',
    allergies: member.health_info?.allergies || '',
    exercise_restrictions: member.health_info?.exercise_restrictions || '',
    marketingEmail: member.consent?.marketing_consent.email || false,
    marketingSms: member.consent?.marketing_consent.sms || false,
    marketingPush: member.consent?.marketing_consent.push || false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        basic_info: {
          ...member.basic_info,
          name_kanji: formData.name_kanji,
          name_kana: formData.name_kana,
          postal_code: formData.postal_code,
          prefecture: formData.prefecture,
          city: formData.city,
          address: formData.address,
          building: formData.building,
          phone: formData.phone,
          email: formData.email,
          emergency_contact: formData.emergency_contactName
            ? {
                name: formData.emergency_contactName,
                relationship: formData.emergency_contactRelationship,
                phone: formData.emergency_contactPhone,
              }
            : undefined,
        },
        health_info: {
          health_status: formData.health_status,
          medical_history: formData.medical_history,
          allergies: formData.allergies,
          exercise_restrictions: formData.exercise_restrictions,
        },
        consent: member.consent
          ? {
              ...member.consent,
              marketing_consent: {
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
                <Label htmlFor="name_kanji">氏名（漢字）</Label>
                <Input
                  id="name_kanji"
                  value={formData.name_kanji}
                  onChange={(e) => setFormData({ ...formData, name_kanji: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="name_kana">氏名（カナ）</Label>
                <Input
                  id="name_kana"
                  value={formData.name_kana}
                  onChange={(e) => setFormData({ ...formData, name_kana: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="postal_code">郵便番号</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
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
                  value={formData.emergency_contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, emergency_contactName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="emergencyRelationship">続柄</Label>
                <Input
                  id="emergencyRelationship"
                  value={formData.emergency_contactRelationship}
                  onChange={(e) =>
                    setFormData({ ...formData, emergency_contactRelationship: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="emergencyPhone">電話番号</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergency_contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emergency_contactPhone: e.target.value })
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
                <Label htmlFor="health_status">健康状態申告</Label>
                <Textarea
                  id="health_status"
                  value={formData.health_status}
                  onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="medical_history">既往歴・持病</Label>
                <Textarea
                  id="medical_history"
                  value={formData.medical_history}
                  onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
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
                <Label htmlFor="exercise_restrictions">運動制限事項</Label>
                <Textarea
                  id="exercise_restrictions"
                  value={formData.exercise_restrictions}
                  onChange={(e) =>
                    setFormData({ ...formData, exercise_restrictions: e.target.value })
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
