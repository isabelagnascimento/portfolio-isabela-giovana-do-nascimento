import { Options as QRStylingOptions, DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel, Mode, TypeNumber } from 'qr-code-styling';

export type QRStyleOptions = QRStylingOptions;

export interface AppState {
  options: QRStyleOptions;
  setOptions: (options: Partial<QRStyleOptions>) => void;
  resetOptions: () => void;
}

export const defaultOptions: QRStyleOptions = {
  width: 300,
  height: 300,
  data: "https://google.com",
  margin: 10,
  qrOptions: {
    typeNumber: 0 as TypeNumber,
    mode: 'Byte' as Mode,
    errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 10
  },
  dotsOptions: {
    type: 'rounded' as DotType,
    color: '#000000',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
    type: 'extra-rounded' as CornerSquareType,
    color: '#000000',
  },
  cornersDotOptions: {
    type: 'dot' as CornerDotType,
    color: '#000000',
  }
};
