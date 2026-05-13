import {
  RoadHorizonIcon , LightbulbIcon, TrashIcon , PaintRollerIcon ,
  QuestionMarkIcon, 
  type Icon
} from "@phosphor-icons/react";

const ICON_MAP: Record<string, Icon> = {
  road: RoadHorizonIcon ,
  bulb: LightbulbIcon,
  trash: TrashIcon,
  spray: PaintRollerIcon,
};

export const CategoryIcon = ({ name, size = 16 }: { name: string; size?: number }) => {
  const Icon = ICON_MAP[name] ?? QuestionMarkIcon;
  return <Icon size={size} />;
};