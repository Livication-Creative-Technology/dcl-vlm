import { TCustomizationConfig } from "./Customization";
import { TEntityInstanceConfig, TEntityMaterialConfig } from "./Entity";
import { TImageInstanceConfig, TImageMaterialConfig } from "./Image";
import { TMessage } from "./Message";
import { TNFTConfig, TNFTInstanceConfig } from "./NFT";
import { TSceneData, TSceneFeatures } from "./SceneData";
import { TVideoInstanceConfig, TVideoMaterialConfig } from "./VideoScreen";

export type TWebSocketMessage = {
  action: string;
  property: string;
  sceneData: TSceneData;
  features: TSceneFeatures;
  entityData?: TEntityMaterialConfig | TVideoMaterialConfig | TImageMaterialConfig | TNFTConfig;
  instanceData?: TEntityInstanceConfig | TVideoInstanceConfig | TImageInstanceConfig | TNFTInstanceConfig;
  customizationData?: TCustomizationConfig;
  message?: TMessage;
  id?: string;
};
