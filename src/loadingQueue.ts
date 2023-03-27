import { createImage } from "./images";
import { createNft } from "./nfts";
import { imageInstances } from "./storage";
import {
  TImageMaterialConfig,
  TNFTConfig,
  TVideoMaterialConfig,
} from "./types";
import { TLoadingQueueItem } from "./types/LoadingQueue";
import { EEntityType } from "./types/SceneData";
import { TWebSocketMessage } from "./types/WebSocketMessage";
import { createVideoScreen } from "./videos";

export class LoadingQueue implements ISystem {
  static items: TLoadingQueueItem[] = [];
  loadingFrame: boolean = false;
  loadingTime: number = 0;
  loadingPromise: Promise<void>;
  shrunkenItems: any[] = [];
  resolvePromise: () => void;
  rejectPromise: () => void;

  constructor(message: TWebSocketMessage) {
    log("constructing loading queue");
    message.sceneData.images?.forEach((image: TImageMaterialConfig) => {
      LoadingQueue.items.push({ type: EEntityType.IMAGE, data: image });
    });
    message.sceneData.videoScreens?.forEach((video: TVideoMaterialConfig) => {
      LoadingQueue.items.push({ type: EEntityType.VIDEO, data: video });
    });
    message.sceneData.nfts?.forEach((nft: TNFTConfig) => {
      LoadingQueue.items.push({ type: EEntityType.NFT, data: nft });
    });
    engine.addSystem(this, 1);

    this.loadingPromise = new Promise((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
  }

  update(dt: number): void {
    this.loadingTime += dt;

    if (LoadingQueue.items.length >= 3) {
      this.loadNextItem();
      this.loadNextItem();
      this.loadNextItem();
      // log(`${LoadingQueue.items.length} items remain - frame delay: ${dt}`);
    } else if (LoadingQueue.items.length) {
      this.loadNextItem();
      // log(`${LoadingQueue.items.length} items remain - frame delay: ${dt}`);
    } else {
      log(`VLM Load in time was ${this.loadingTime} seconds`);
      Object.keys(imageInstances).forEach((key: string) => {
        imageInstances[key].add();
      });
      engine.removeSystem(this);
      this.resolvePromise();
    }
  }

  loadNextItem: CallableFunction = () => {
    log(LoadingQueue.items);
    const nextItem = LoadingQueue.items.shift();

    if (!nextItem) {
      return;
    }
    switch (nextItem.type) {
      case EEntityType.IMAGE:
        createImage(nextItem.data as TImageMaterialConfig, false);
        break;
      case EEntityType.VIDEO:
        createVideoScreen(nextItem.data as TVideoMaterialConfig);
        break;
      case EEntityType.NFT:
        createNft(nextItem.data as TNFTConfig);
        break;
    }
  };
}
