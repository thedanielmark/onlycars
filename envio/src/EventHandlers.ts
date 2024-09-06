/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  OnlyCars,
  OnlyCars_Approval,
  OnlyCars_ApprovalForAll,
  OnlyCars_BalanceTopUp,
  OnlyCars_StationRegistered,
  OnlyCars_StationReported,
  OnlyCars_StationUsed,
  OnlyCars_Transfer,
  OnlyCars_VehicleRegistered,
} from "generated";

OnlyCars.Approval.handler(async ({ event, context }) => {
  const entity: OnlyCars_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    approved: event.params.approved,
    tokenId: event.params.tokenId,
  };

  context.OnlyCars_Approval.set(entity);
});

OnlyCars.ApprovalForAll.handler(async ({ event, context }) => {
  const entity: OnlyCars_ApprovalForAll = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    operator: event.params.operator,
    approved: event.params.approved,
  };

  context.OnlyCars_ApprovalForAll.set(entity);
});

OnlyCars.BalanceTopUp.handler(async ({ event, context }) => {
  const entity: OnlyCars_BalanceTopUp = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    amount: event.params.amount,
  };

  context.OnlyCars_BalanceTopUp.set(entity);
});

OnlyCars.StationRegistered.handler(async ({ event, context }) => {
  const entity: OnlyCars_StationRegistered = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    stationId: event.params.stationId,
    owner: event.params.owner,
    metadata: event.params.metadata,
    attestationId: event.params.attestationUID,
    isActive: event.params.isActive,
  };

  context.OnlyCars_StationRegistered.set(entity);
});

OnlyCars.StationReported.handler(async ({ event, context }) => {
  const entity: OnlyCars_StationReported = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    stationId: event.params.stationId,
    reporter: event.params.reporter,
    issue: event.params.issue,
  };

  context.OnlyCars_StationReported.set(entity);
});

OnlyCars.StationUsed.handler(async ({ event, context }) => {
  const entity: OnlyCars_StationUsed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    stationId: event.params.stationId,
    vehicleId: event.params.vehicleId,
    amount: event.params.amount,
  };

  context.OnlyCars_StationUsed.set(entity);
});

OnlyCars.Transfer.handler(async ({ event, context }) => {
  const entity: OnlyCars_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
  };

  context.OnlyCars_Transfer.set(entity);
});

OnlyCars.VehicleRegistered.handler(async ({ event, context }) => {
  const entity: OnlyCars_VehicleRegistered = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    vehicleId: event.params.vehicleId,
    owner: event.params.owner,
    metadata: event.params.metadata,
    attestationId: event.params.attestationUID,
  };

  context.OnlyCars_VehicleRegistered.set(entity);
});
