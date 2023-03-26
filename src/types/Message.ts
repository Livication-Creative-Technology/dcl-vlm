import { TClickEvent } from "./ClickEvent";
import { TEntityInstanceConfig, TEntityMaterialConfig } from "./Entity";
import { TTransform } from "./Transform";

export type TMessage = {
  text: string;
  config: TMessageConfig;
};

export type TMessageConfig = {
  color: string;
  outlineColor: string;
  fontSize: number;
};
