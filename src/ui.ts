import { TMessageConfig } from "./types/Message";

const uiCanvas = new UICanvas();

export class UIMessageSystem implements ISystem {
  static alertText: UIMessage;
  static timer: number = 0;
  static delay: number = 3;

  update(dt: number) {
    if (UIMessageSystem.timer < UIMessageSystem.delay) {
      UIMessageSystem.timer += dt;
      return;
    } else {
      UIMessageSystem.timer = 0;
    }

    if (UIMessageSystem.alertText) {
      UIMessageSystem.alertText.visible = false;
    }
  }

  static show: CallableFunction = (
    value: string,
    messageOptions: TMessageConfig
  ) => {
    if (!this.alertText) {
      this.timer = 0;
      this.alertText = new UIMessage(value, messageOptions);
    } else {
      this.timer = 0;
      this.alertText.visible = false;
      this.alertText = new UIMessage(value, messageOptions);
    }
  };
}

engine.addSystem(new UIMessageSystem());

class UIMessage extends UIText {
  vAlign: string = "center";
  hAlign: string = "center";
  fontSize: number;
  color: Color4 = Color4.White();
  outlineColor: Color4 = Color4.Black();
  outlineWidth: number = 0.125;
  adaptWidth: boolean = true;
  adaptHeight: boolean = true;
  static visible = true;

  constructor(value: string, _messageOptions: TMessageConfig) {
    super(uiCanvas);

    const { color, fontSize } = _messageOptions;
    this.value = value;
    this.fontSize = fontSize || 16;
    if (!color) {
      return;
    }
    switch (color.toLowerCase()) {
      case "black":
        this.outlineColor = Color4.White();
      case "blue":
      case "gray":
      case "green":
      case "magenta":
      case "purple":
      case "red":
      case "teal":
      case "yellow":
        this.color = Color4[color.charAt(0).toUpperCase()]();
        break;
      default:
        this.color = Color4.White();
    }
  }
}
