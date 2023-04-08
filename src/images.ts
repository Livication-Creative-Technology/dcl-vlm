import { StoredImageMaterial } from "./classes/index";
import { imageInstances, imageMaterials } from "./storage";
import { TImageInstanceConfig, TImageMaterialConfig } from "./types/index";

export const initImages = (images: Array<TImageMaterialConfig>) => {
  if (!images) {
    return;
  }
  images.forEach((image: TImageMaterialConfig) => {
    createImage(image);
  });
};

export const createImage = (imageConfig: TImageMaterialConfig, startVisible: boolean = true) => {
  if (!imageConfig.show) {
    return;
  }
  return new StoredImageMaterial(imageConfig);
};

export const createImageInstance = (
  material: TImageMaterialConfig,
  instance: TImageInstanceConfig
) => {
  if (!material.show || !instance.show) {
    return;
  }
  const imageId = material.id;
  return imageMaterials[imageId].createInstance(instance);
};

export const updateImage = (
  imageConfig: TImageMaterialConfig | any,
  property: string,
  id: string
) => {
  const image: StoredImageMaterial = imageMaterials[imageConfig.id];

  if (!imageConfig || (!image && !imageConfig.show)) {
    return;
  } else if (!image && imageConfig.show) {
    new StoredImageMaterial(imageConfig);
  }

  switch (property) {
    case "visibility":
      if (!imageConfig.show) {
        removeImage(imageConfig.id);
      } else if (image) {
        addImage(imageConfig.id);
      }
      break;
    case "imageLink":
      image.updateTexture(imageConfig.imageLink);
      break;
    case "emission":
      image.emissiveIntensity = imageConfig.emission;
      break;
    case "clickEvent":
      image.updateClickEvent(imageConfig.clickEvent);
      break;
    case "properties":
      image.updateTransparency(imageConfig.isTransparent);
      image.updateParent(imageConfig.parent);
      image.updateCustomId(imageConfig.customId);
      break;
  }
};

export const updateImageInstance = (
  instanceConfig: TImageInstanceConfig,
  property: string,
  id: string
) => {
  const instance = imageInstances[id],
    materialId = instance?.materialId,
    material = imageMaterials[materialId];

  if (!material) {
    return;
  } else if (!instance && instanceConfig.show) {
    material.createInstance(instanceConfig);
  }

  const { position, scale, rotation } = instanceConfig;

  switch (property) {
    case "visibility":
      if (!material.show || !instanceConfig.show) {
        material.removeInstance(instanceConfig.id);
      } else if (instance && instanceConfig.show) {
        material.addInstance(instanceConfig.id);
      }
      break;
    case "transform":
      instance.updateTransform(position, scale, rotation);
      break;
    case "clickEvent":
      instance.updateClickEvent(instanceConfig.clickEvent);
      break;
    case "properties":
      instance.updateCollider(instanceConfig);
      instance.updateParent(instanceConfig.parent);
      instance.updateCustomId(instanceConfig.customId);
      break;
  }
};

export const addImage = (id: string) => {
  imageMaterials[id]?.showAll();
};

export const deleteImage = (id: string) => {
  imageMaterials[id]?.delete();
};

export const removeImage = (id: string) => {
  imageMaterials[id]?.remove();
};

export const removeImageInstance = (instanceId: string) => {
  const materialId = imageInstances[instanceId]?.materialId;
  imageMaterials[materialId]?.removeInstance(instanceId);
};

export const deleteImageInstance = (instanceId: string) => {
  const materialId = imageInstances[instanceId]?.materialId;
  imageMaterials[materialId]?.deleteInstance(instanceId);
};
