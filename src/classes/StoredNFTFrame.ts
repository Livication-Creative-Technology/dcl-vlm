import {
  sdkImageFlippedDimension,
  sdkImagesAreFlipped,
  sdkImagesFace,
  vlmImagesFace,
} from "../helpers/defaults";
import { getEntityByName } from "../helpers/entity";
import { ITransform } from "../interfaces/index";
import { nftInstances, nftConfigs } from "../storage";
import { TNFTInstanceConfig, TNFTConfig } from "../types/index";
import { TTransform } from "../types/Transform";
import { StoredEntityConfig, StoredEntityInstance } from "./StoredEntity";

export class StoredNFTConfig extends StoredEntityConfig {
  id: string;
  customId?: string;
  customRendering?: boolean;
  parent?: string;
  show: boolean;
  instanceIds: string[] | any = [];
  chain: number | string = 1;
  contractAddress: string;
  tokenId?: number | string;
  itemId?: number | string;
  withCollisions: boolean;
  nftLink: string;
  color?: Color3;
  style: PictureFrameStyle = PictureFrameStyle.Classic;
  isTransparent: boolean = false;
  startVisible: boolean;

  constructor(_config: TNFTConfig, startVisible: boolean = true) {
    super(_config);
    let chain = this.getChainName(_config.chain);
    this.nftLink = `${chain}://${_config.contractAddress}/${_config.tokenId}`;
    if (_config.color) {
      this.color = Color3.FromHexString(_config.color);
    }
    if (_config.style) {
      this.style = _config.style;
    }

    this.id = _config.id;
    this.customId = _config.customId;
    this.contractAddress = _config.contractAddress;
    this.withCollisions = !!_config.withCollisions;
    this.tokenId = _config.tokenId;
    this.show = _config.show;
    this.startVisible = startVisible;

    if (this.customId) {
      nftConfigs[this.customId] = nftConfigs[this.id];
    }

    if (_config.instances?.length) {
      _config.instances.forEach((instance: TNFTInstanceConfig) => {
        this.createInstance(instance);
      });
    }
  }

  updateNft: CallableFunction = (nftConfig: TNFTConfig) => {
    let chain = this.getChainName(nftConfig.chain);
    this.chain = nftConfig.chain;
    this.contractAddress = nftConfig.contractAddress;
    this.tokenId = nftConfig.tokenId;
    this.nftLink = `${chain}://${nftConfig.contractAddress}/${nftConfig.tokenId}`;
    if (nftConfig.color) {
      this.color = Color3.FromHexString(nftConfig.color);
    }
    if (nftConfig.style) {
      this.style = nftConfig.style;
    }

    [...this.instanceIds].forEach((instanceId: string) => {
      const instance = nftInstances[instanceId];
      const newShape = new NFTShape(this.nftLink, {
        color: this.color,
        style: this.style,
      });
      newShape.withCollisions = !!instance.withCollisions;
      instance.addComponentOrReplace(newShape);
    });
  };

  getChainName: CallableFunction = (chain: string | number) => {
    switch (Number(chain)) {
      case 1:
        return "ethereum";
      case 137:
        return "polygon";
      default:
        return "ethereum";
    }
  };

  // deletes the material record AND removes the instances from the engine
  delete: CallableFunction = () => {
    delete nftConfigs[this.id];
    [...this.instanceIds].forEach((instanceId: string) => {
      log(instanceId);
      nftInstances[instanceId].delete();
    });
  };

  // just removes the instances from the engine, keeps the material record and instance records so we can bring stuff back
  remove: CallableFunction = () => {
    [...this.instanceIds].forEach((instanceId: string) => {
      nftInstances[instanceId].remove();
    });
  };

  showAll: CallableFunction = () => {
    [...this.instanceIds].forEach((instanceId: string) => {
      const visible = nftInstances[instanceId].show,
        parent = nftInstances[instanceId].parent || this.parent;

      if (!visible) {
        return;
      } else if (parent) {
        nftInstances[instanceId].updateParent(parent);
      } else {
        nftInstances[instanceId].add();
      }
    });
  };

  updateParent: CallableFunction = (parent: string) => {
    [...this.instanceIds].forEach((instanceId: string) => {
      if (nftInstances[instanceId].parent === this.parent) {
        nftInstances[instanceId].updateParent(parent);
      }
    });
    this.parent = parent;
  };

  updateCustomId: CallableFunction = (customId: string) => {
    if (this.customId && nftConfigs[this.customId]) {
      delete nftConfigs[this.customId];
    }
    nftConfigs[customId] = nftConfigs[this.id];
    this.customId = customId;
  };

  createInstance: CallableFunction = (_config: TNFTInstanceConfig) => {
    this.instanceIds.push(_config.id);
    nftInstances[_config.id] = new StoredNFTInstance(this, _config);
    if (_config.customId) {
      nftInstances[_config.customId] = nftInstances[_config.id];
    }
    if (this.startVisible) {
      nftInstances[_config.id].add();
    }
    return nftInstances[_config.id];
  };

  deleteInstance: CallableFunction = (instanceId: string) => {
    this.instanceIds = this.instanceIds.filter(
      (id: string) => id !== instanceId
    );
    nftInstances[instanceId].delete();
  };

  removeInstance: CallableFunction = (instanceId: string) => {
    nftInstances[instanceId].remove();
  };

  addInstance: CallableFunction = (instanceId: string) => {
    nftInstances[instanceId].add();
  };
}

export class StoredNFTInstance
  extends StoredEntityInstance
  implements ITransform
{
  id: string;
  configId: string;
  parent?: string;
  show: boolean;
  position: TTransform;
  scale: TTransform;
  rotation: TTransform;
  modifiedTransform?: {
    position: TTransform;
    scale: TTransform;
    rotation: TTransform;
  };
  withCollisions?: boolean;
  config: StoredNFTConfig;

  constructor(_config: StoredNFTConfig, _instance: TNFTInstanceConfig) {
    let color = _config.color;
    let style = _config.style;
    const shape = new NFTShape(_config.nftLink, { color, style });
    super(_config, _instance);
    this.id = _instance.id;
    this.customId = _instance.customId;
    this.parent = _instance.parent;
    this.config = _config;
    this.position = _instance.position;
    this.scale = _instance.scale;
    this.rotation = _instance.rotation;
    this.configId = _config.id;
    this.show = _instance.show;
    _config.withCollisions =
      typeof _instance.withCollisions === "boolean"
        ? _instance.withCollisions
        : _config.withCollisions;
    this.addComponent(shape);
    this.updateTransform(this.position, this.scale, this.rotation);

    if (this.parent && this.show) {
      this.updateParent(this.parent);
    } else if (this.show) {
      this.add();
    }
  }

  add: CallableFunction = () => {
    engine.addEntity(this);
  };

  delete: CallableFunction = () => {
    delete nftInstances[this.id];
    if (this.customId) {
      delete nftInstances[this.customId];
    }
    engine.removeEntity(this);
  };

  remove: CallableFunction = () => {
    engine.removeEntity(this);
  };

  updateParent: CallableFunction = (parent: string) => {
    if (parent) {
      this.parent = parent;
      const instanceParent = getEntityByName(parent);
      this.setParent(instanceParent);
    } else {
      this.setParent(null);
    }
  };

  updateCustomId: CallableFunction = (customId: string) => {
    if (this.customId && nftInstances[this.customId]) {
      delete nftInstances[this.customId];
    }
    nftInstances[customId] = nftInstances[this.id];
    this.customId = customId;
  };

  updateTransform: CallableFunction = (
    position: TTransform,
    scale: TTransform,
    rotation: TTransform
  ) => {
    this.addComponentOrReplace(
      new Transform({
        position: new Vector3(position.x, position.y, position.z),
        scale: new Vector3(scale.x, scale.y, scale.z),
        rotation: Quaternion.Euler(rotation.x, rotation.y, rotation.z),
      })
    );
  };

  updateCollider: CallableFunction = (withCollisions: boolean) => {
    this.withCollisions = withCollisions;
    const newShape = new NFTShape(this.config.nftLink, {
      color: this.config.color,
      style: this.config.style,
    });
    newShape.withCollisions = this.withCollisions;
    nftConfigs[this.configId].withCollisions = this.withCollisions;
    this.addComponentOrReplace(newShape);
  };

  applyCustomTransforms: CallableFunction = (
    originalPosition: TTransform,
    originalScale: TTransform,
    originalRotation: TTransform
  ) => {
    this.position = originalPosition || this.position;
    this.scale = originalScale || this.scale;
    this.rotation = originalRotation || this.rotation;

    this.modifiedTransform = {
      position: { ...this.position },
      scale: { ...this.scale },
      rotation: { ...this.rotation },
    };

    if (sdkImagesAreFlipped) {
      this.modifiedTransform.rotation[sdkImageFlippedDimension] += 180;
    }

    const imageRotationDegree = (vlmImagesFace - sdkImagesFace) * 90;

    this.modifiedTransform.rotation.y += imageRotationDegree;
  };
}
