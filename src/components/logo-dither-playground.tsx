import { LogoDither } from "@/components/logo-dither";
import { useState, type ReactNode } from "react";

const DEFAULTS = {
  spinSpeed: 0.5,
  axisTilt: 30,
  axisDir: 90,
  depthScale: 0.4,
  ambient: 0.15,
  light: 0.6,
  brightness: 1.0,
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  decimals,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  decimals: number;
  unit?: string;
  onChange: (v: number) => void;
}): ReactNode {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center justify-between text-xs uppercase tracking-[0.15em] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground">
          {value.toFixed(decimals)}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-foreground"
      />
    </label>
  );
}

export function LogoDitherPlayground(): ReactNode {
  const [spinSpeed, setSpinSpeed] = useState(DEFAULTS.spinSpeed);
  const [axisTilt, setAxisTilt] = useState(DEFAULTS.axisTilt);
  const [axisDir, setAxisDir] = useState(DEFAULTS.axisDir);
  const [depthScale, setDepthScale] = useState(DEFAULTS.depthScale);
  const [ambient, setAmbient] = useState(DEFAULTS.ambient);
  const [light, setLight] = useState(DEFAULTS.light);
  const [brightness, setBrightness] = useState(DEFAULTS.brightness);
  const [copied, setCopied] = useState(false);

  const jsx =
    `<LogoDither spinSpeed={${spinSpeed.toFixed(2)}} ` +
    `axisTilt={${Math.round(axisTilt)}} axisDir={${Math.round(axisDir)}} ` +
    `depthScale={${depthScale.toFixed(2)}} ` +
    `ambient={${ambient.toFixed(2)}} light={${light.toFixed(2)}} brightness={${brightness.toFixed(2)}} />`;

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(jsx);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const reset = (): void => {
    setSpinSpeed(DEFAULTS.spinSpeed);
    setAxisTilt(DEFAULTS.axisTilt);
    setAxisDir(DEFAULTS.axisDir);
    setDepthScale(DEFAULTS.depthScale);
    setAmbient(DEFAULTS.ambient);
    setLight(DEFAULTS.light);
    setBrightness(DEFAULTS.brightness);
  };

  return (
    <div className="flex w-full max-w-150 flex-col gap-6">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
        <LogoDither
          spinSpeed={spinSpeed}
          axisTilt={axisTilt}
          axisDir={axisDir}
          depthScale={depthScale}
          ambient={ambient}
          light={light}
          brightness={brightness}
        />
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-border p-5">
        <div className="flex flex-col gap-5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Motion
          </span>
          <Slider label="Spin speed" value={spinSpeed} min={0} max={2} step={0.05} decimals={2} unit=" rad/s" onChange={setSpinSpeed} />
          <Slider label="Spin axis tilt" value={axisTilt} min={0} max={90} step={1} decimals={0} unit="°" onChange={setAxisTilt} />
          <Slider label="Spin axis direction" value={axisDir} min={0} max={360} step={1} decimals={0} unit="°" onChange={setAxisDir} />
          <Slider label="Depth" value={depthScale} min={0.05} max={1.5} step={0.05} decimals={2} unit="×" onChange={setDepthScale} />
        </div>

        <div className="flex flex-col gap-5 border-t border-border pt-5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Lighting
          </span>
          <Slider label="Ambient" value={ambient} min={0} max={1} step={0.01} decimals={2} onChange={setAmbient} />
          <Slider label="Light intensity" value={light} min={0} max={2} step={0.05} decimals={2} onChange={setLight} />
          <Slider label="Brightness" value={brightness} min={0} max={2} step={0.05} decimals={2} unit="×" onChange={setBrightness} />
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Parameters (copy &amp; share)
          </span>
          <div className="flex items-stretch gap-2">
            <code className="flex-1 overflow-x-auto rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed text-foreground">
              {jsx}
            </code>
            <div className="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                onClick={copy}
                className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-border"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
