import {
  TCustomizationConfig,
  TCustomizationConfigs,
} from "./types/Customization";

export const customizationConfigs: TCustomizationConfigs = {};

export const setCustomizationState = (configs: TCustomizationConfig[]) => {
  if (!configs) {
    return;
  }
  configs.forEach((config: TCustomizationConfig) => {
    customizationConfigs[config.id] = {
      id: config.id,
      value: config.value,
      update: (config: TCustomizationConfig) => {
        log(config);
      },
    };
  });
};

export const setCustomizationFunctions = (configs: TCustomizationConfig[]) => {
  configs.forEach((config: TCustomizationConfig) => {
    if (config.init) {
      customizationConfigs[config.id].init = config.init;
    }
    if (config.update) {
      customizationConfigs[config.id].update = config.update;
    }
    if (config.delete) {
      customizationConfigs[config.id].delete = config.delete;
    }
  });
  return initCustomizations();
};

export const initCustomizations = () => {
  Object.keys(customizationConfigs).forEach((customizationConfigId: string) => {
    const config = customizationConfigs[customizationConfigId];
    if (!customizationConfigs || !config) {
      return;
    }
    if (config?.init) {
      config.init(config);
    } else if (config?.update) {
      config.update(config);
    }
  });
  return customizationConfigs;
};

export const updateCustomization = (
  customization: TCustomizationConfig,
  customizationId: string
) => {
  if (!customizationConfigs[customizationId]) {
    customizationConfigs[customizationId] = {
      id: customization.id,
      value: customization.value,
      update: () => {},
    };
  }
  customizationConfigs[customizationId].value = customization.value;
  customizationConfigs[customizationId].update(customization);
};

export const deleteCustomization = (customizationId: string) => {
  const config = customizationConfigs[customizationId];
  if (!config) {
    return;
  }
  config.value = false;
  if (config?.delete) {
    config.delete(config);
  } else if (config?.update) {
    config.update(config);
  }
  delete customizationConfigs[customizationId];
};
