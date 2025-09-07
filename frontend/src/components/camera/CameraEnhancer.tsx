import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Sun, 
  Contrast, 
  Sparkles, 
  Focus,
  Thermometer,
  Circle
} from "lucide-react";
import {
  CameraSettings,
  CameraEnhancementConfig,
  CameraPreset,
  cameraPresets,
  defaultCameraSettings,
  generateFilterString,
  getVignetteStyle
} from "./CameraConfig";

interface CameraEnhancerProps {
  settings: CameraSettings;
  onSettingsChange: (settings: CameraSettings) => void;
  isCompact?: boolean;
}

export function CameraEnhancer({ 
  settings, 
  onSettingsChange, 
  isCompact = false 
}: CameraEnhancerProps) {
  const [selectedPreset, setSelectedPreset] = useState<CameraPreset>("portrait");

  const handlePresetChange = (preset: CameraPreset) => {
    setSelectedPreset(preset);
    onSettingsChange(cameraPresets[preset]);
  };

  const handleEnhancementChange = (
    key: keyof CameraEnhancementConfig,
    value: number
  ) => {
    const newSettings = {
      ...settings,
      enhancements: {
        ...settings.enhancements,
        [key]: value
      }
    };
    onSettingsChange(newSettings);
  };

  const resetToDefaults = () => {
    onSettingsChange(defaultCameraSettings);
    setSelectedPreset("portrait");
  };

  if (isCompact) {
    return (
      <div className="flex items-center space-x-2">
        <Select value={selectedPreset} onValueChange={handlePresetChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="portrait">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Portrait</span>
              </div>
            </SelectItem>
            <SelectItem value="natural">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <span>Natural</span>
              </div>
            </SelectItem>
            <SelectItem value="vibrant">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Vibrant</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="text-xs">
          Enhanced
        </Badge>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Sparkles className="h-4 w-4" />
          <span>Photo Enhancement</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Quick Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(cameraPresets).map((preset) => (
              <Button
                key={preset}
                variant={selectedPreset === preset ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetChange(preset as CameraPreset)}
                className="text-xs"
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Manual Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground flex items-center space-x-1">
              <Sun className="h-3 w-3" />
              <span>Brightness</span>
            </label>
            <span className="text-xs text-muted-foreground">
              {settings.enhancements.brightness.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[settings.enhancements.brightness]}
            onValueChange={([value]) => handleEnhancementChange("brightness", value)}
            min={0.5}
            max={2}
            step={0.05}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground flex items-center space-x-1">
              <Contrast className="h-3 w-3" />
              <span>Contrast</span>
            </label>
            <span className="text-xs text-muted-foreground">
              {settings.enhancements.contrast.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[settings.enhancements.contrast]}
            onValueChange={([value]) => handleEnhancementChange("contrast", value)}
            min={0.5}
            max={2}
            step={0.05}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground flex items-center space-x-1">
              <Palette className="h-3 w-3" />
              <span>Saturation</span>
            </label>
            <span className="text-xs text-muted-foreground">
              {settings.enhancements.saturation.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[settings.enhancements.saturation]}
            onValueChange={([value]) => handleEnhancementChange("saturation", value)}
            min={0}
            max={2}
            step={0.05}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground flex items-center space-x-1">
              <Thermometer className="h-3 w-3" />
              <span>Warmth</span>
            </label>
            <span className="text-xs text-muted-foreground">
              {settings.enhancements.warmth.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[settings.enhancements.warmth]}
            onValueChange={([value]) => handleEnhancementChange("warmth", value)}
            min={0.8}
            max={1.5}
            step={0.02}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground flex items-center space-x-1">
              <Circle className="h-3 w-3" />
              <span>Vignette</span>
            </label>
            <span className="text-xs text-muted-foreground">
              {settings.enhancements.vignette.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[settings.enhancements.vignette]}
            onValueChange={([value]) => handleEnhancementChange("vignette", value)}
            min={0}
            max={0.5}
            step={0.02}
            className="w-full"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="w-full text-xs"
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
}

export { generateFilterString, getVignetteStyle };
