# Virtual Land Manager - Decentraland SDK 6

### Installation

Via VS Code Extension:
- From the Decentraland SDK 6 extension for VS Code, find the "Dependencies" panel and click the '+' to add a new dependency. 
- Type "dcl-vlm" and hit enter.
- Choose "Yes" when asked if this is a Decentraland library.

Via CLI:

`dcl install dcl-vlm`


### Setup

```
import { connectCMS } from 'dcl-vlm';

connectCMS();
```

Contact Unknower#0677 with your scene's base parcel to have your scene set up on the server.


### Advanced SDK Features: 

Using Customization Widgets:

```
import { connectCMS, setCustomizationFunctions, TCustomizationConfig } from 'dcl-vlm';

const initWidget = (config: TCustomizationConfig) => {
// INIT FUNCTION
//
// runs on scene load to initialize elements based on current value
//
// config.id represents the customization's id. Can be used to have one function that processes different customizations dynamically. 
// config.value represents the customization's value. Either true,false, a text string, or the id of a selection in a dropdown menu. 
}

const updateWidget = (config: TCustomizationConfig) => {
// UPDATE FUNCTION
//
// runs each time a customization's value is changed and passes in the new value in the config argument
// will also run on scene load if no init function is specified
//
// config.id represents the customization's id. Can be used to have one function that processes different customizations dynamically. 
// config.value represents the customization's value. Either true,false, a text string, or the id of a selection in a dropdown menu. 
}


const deleteWidget = (config: TCustomizationConfig) => {
// DELETE FUNCTION
//
// only runs once a customization is deleted entirely. 
// not usually needed because a lot can be done with the update function. 
// But it's here for those weird cases.
//
// config.id represents the customization's id. Can be used to have one function that processes different customizations dynamically. 
// config.value represents the customization's value. Either true,false, a text string, or the id of a selection in a dropdown menu. 
}

const vlmWidgetConfig: TCustomizationConfig[] = [
{id: "customization-1", init: initWidget, update: updateWidget, delete: deleteWidget },
//{id: "customization-2", init: initWidget2, update: updateWidget2, delete: deleteWidget2 }
//{id: "customization-3", init: initWidget3, update: updateWidget3, delete: deleteWidget3 }

]

const init = async () => {
await connectCMS();
setCustomizationFunctions(vlmWidgetConfig);
}

init();
```
