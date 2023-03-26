import { TImageMaterialConfig } from "./Image";
import { TNFTConfig } from "./NFT";
import { EEntityType } from "./SceneData";
import { TVideoMaterialConfig } from "./VideoScreen";

export type TLoadingQueueItem = {
  type: EEntityType;
  data: TImageMaterialConfig | TVideoMaterialConfig | TNFTConfig;
};
