import {
  StatusGrid as MigrationStatusGrid,
  type StatusCard as MigrationStatusCard,
  type StatusGridProps as MigrationStatusGridProps,
  type StatusType as MigrationStatusType,
} from '@kingly/ui/components';

export type StatusType = MigrationStatusType;
export type StatusCard = MigrationStatusCard;
export type StatusGridProps = MigrationStatusGridProps;

export function StatusGrid(props: StatusGridProps) {
  return <MigrationStatusGrid {...props} />;
}
