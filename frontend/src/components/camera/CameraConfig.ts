// Camera configuration and image enhancement settings
export interface CameraEnhancementConfig {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  warmth: number;
  vignette: number;
  blur: number;
}

export interface CameraSettings {
  videoConstraints: {
    width: number;
    height: number;
    facingMode: string;
  };
  screenshotFormat: string;
  screenshotQuality: number;
  enhancements: CameraEnhancementConfig;
}

// Default camera settings optimized for square portrait photography
export const defaultCameraSettings: CameraSettings = {
  videoConstraints: {
    width: 480,
    height: 480,
    facingMode: "user"
  },
  screenshotFormat: "image/jpeg",
  screenshotQuality: 0.92,
  enhancements: {
    brightness: 1.1,      // Slightly brighter for better skin tone
    contrast: 1.15,       // Enhanced contrast for definition
    saturation: 1.2,      // More vibrant colors
    sharpness: 1.1,       // Subtle sharpening
    warmth: 1.05,         // Warmer tone for skin
    vignette: 0.1,        // Subtle vignette effect
    blur: 0               // No blur by default
  }
};

// Generate CSS filter string from enhancement config
export const generateFilterString = (enhancements: CameraEnhancementConfig): string => {
  const filters = [
    `brightness(${enhancements.brightness})`,
    `contrast(${enhancements.contrast})`,
    `saturate(${enhancements.saturation})`,
    enhancements.sharpness > 1 ? `contrast(${enhancements.sharpness * 0.1 + 0.9})` : '',
    enhancements.warmth !== 1 ? `sepia(${(enhancements.warmth - 1) * 0.3}) hue-rotate(${(enhancements.warmth - 1) * 10}deg)` : '',
    enhancements.blur > 0 ? `blur(${enhancements.blur}px)` : ''
  ].filter(Boolean);

  return filters.join(' ');
};

// Apply vignette effect using CSS
export const getVignetteStyle = (intensity: number) => {
  if (intensity === 0) return {};
  
  return {
    boxShadow: `inset 0 0 ${100 * intensity}px ${50 * intensity}px rgba(0,0,0,${intensity * 0.3})`
  };
};

// Enhanced camera settings for different scenarios - all with 1:1 aspect ratio
export const cameraPresets = {
  portrait: {
    ...defaultCameraSettings,
    videoConstraints: {
      width: 480,
      height: 480,
      facingMode: "user"
    },
    enhancements: {
      brightness: 1.15,
      contrast: 1.2,
      saturation: 1.1,
      sharpness: 1.2,
      warmth: 1.1,
      vignette: 0.15,
      blur: 0
    }
  },
  natural: {
    ...defaultCameraSettings,
    videoConstraints: {
      width: 480,
      height: 480,
      facingMode: "user"
    },
    enhancements: {
      brightness: 1.05,
      contrast: 1.1,
      saturation: 1.05,
      sharpness: 1.05,
      warmth: 1.02,
      vignette: 0.05,
      blur: 0
    }
  },
  vibrant: {
    ...defaultCameraSettings,
    videoConstraints: {
      width: 480,
      height: 480,
      facingMode: "user"
    },
    enhancements: {
      brightness: 1.2,
      contrast: 1.3,
      saturation: 1.4,
      sharpness: 1.3,
      warmth: 1.15,
      vignette: 0.2,
      blur: 0
    }
  }
};

export type CameraPreset = keyof typeof cameraPresets;
