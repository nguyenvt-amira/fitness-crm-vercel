'use client';

import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { useRouter } from 'next/navigation';

import { FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { MembershipApplication } from '@/lib/api';
import { navigate } from '@/lib/routes/routes.util';

import { ApproveApplicationModal, SelectType } from '../../_components/approve-application-modal';
import { RejectApplicationModal } from '../../_components/reject-application-modal';

export default function ApplicationDetailFooter({
  application,
}: Readonly<{ application: MembershipApplication }>) {
  const [modalState, setModalState] = useState({
    status: false,
    type: undefined as SelectType | undefined,
  });
  const [rejectModalState, setRejectModalState] = useState({
    status: false,
    type: undefined as SelectType | undefined,
  });

  const router = useRouter();

  return (
    <Fragment>
      <ApproveApplicationModal
        modalState={modalState}
        setModalState={setModalState}
        onOpenChange={(open) => {
          setModalState({ status: open, type: modalState.type });
        }}
        application={application}
        onSuccess={() => {
          setModalState({ status: false, type: modalState.type });
          router.push(navigate('/membership-applications'));
        }}
      />
      <RejectApplicationModal
        modalState={rejectModalState}
        setModalState={setRejectModalState}
        onOpenChange={(open) => {
          setRejectModalState({ status: open, type: rejectModalState.type });
        }}
        application={application}
        onSuccess={() => {
          setRejectModalState({ status: false, type: rejectModalState.type });
          router.push(navigate('/membership-applications'));
        }}
      />
      <div className="bg-sidebar fixed right-0 bottom-0 left-0 border-t px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <FileText className="size-4" />
            <span>入会処理を完了させてください。</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                setRejectModalState({ status: true, type: 'single' });
              }}
            >
              却下
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setModalState({ status: true, type: 'single' });
              }}
            >
              承認
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
