type MainContractEditStateTarget = {
  active_contracts?: number | null;
};

type MainContractDeleteStateTarget = MainContractEditStateTarget & {
  child_contracts?: Array<unknown> | null;
};

export function getMainContractEditState(contract: MainContractEditStateTarget): {
  canEdit: boolean;
  editBlockedMessage?: string;
} {
  const activeContracts = contract.active_contracts ?? 0;

  if (activeContracts <= 0) {
    return { canEdit: true };
  }

  return {
    canEdit: false,
    editBlockedMessage: '契約者が存在するため編集できません。新規マスタを登録してください',
  };
}

export function getMainContractDeleteState(contract: MainContractDeleteStateTarget): {
  canDelete: boolean;
  deleteBlockedMessage?: string;
} {
  const activeContracts = contract.active_contracts ?? 0;
  const childContractsCount = contract.child_contracts?.length ?? 0;

  if (activeContracts <= 0 && childContractsCount <= 0) {
    return { canDelete: true };
  }

  return {
    canDelete: false,
    deleteBlockedMessage: `契約者 ${activeContracts.toLocaleString()}名・派生マスタ ${childContractsCount}件が存在するため削除できません`,
  };
}
