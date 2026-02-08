import React, { ReactNode, useState, useCallback } from 'react';
import classNames from 'classnames';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Icons,
  Button,
  ToolButton,
} from '../';
import { IconPresentationProvider } from '@ohif/ui-next';

import NavBar from '../NavBar';
import DentalThemeToggleButton from './DentalThemeToggle';

// ─── Tooth Numbering Data ───────────────────────────────────────────────────

const UNIVERSAL_TEETH = Array.from({ length: 32 }, (_, i) => i + 1);

// FDI mapping: quadrant (1-4) x tooth (1-8)
const FDI_QUADRANTS = [
  { label: 'UR', teeth: [18, 17, 16, 15, 14, 13, 12, 11] },
  { label: 'UL', teeth: [21, 22, 23, 24, 25, 26, 27, 28] },
  { label: 'LR', teeth: [48, 47, 46, 45, 44, 43, 42, 41] },
  { label: 'LL', teeth: [31, 32, 33, 34, 35, 36, 37, 38] },
];

// Universal → FDI lookup
const UNIVERSAL_TO_FDI: Record<number, number> = {};
// Upper right: Universal 1-8 → FDI 18-11
[18, 17, 16, 15, 14, 13, 12, 11].forEach((fdi, i) => {
  UNIVERSAL_TO_FDI[i + 1] = fdi;
});
// Upper left: Universal 9-16 → FDI 21-28
[21, 22, 23, 24, 25, 26, 27, 28].forEach((fdi, i) => {
  UNIVERSAL_TO_FDI[i + 9] = fdi;
});
// Lower left: Universal 17-24 → FDI 31-38 (reversed)
[38, 37, 36, 35, 34, 33, 32, 31].forEach((fdi, i) => {
  UNIVERSAL_TO_FDI[i + 17] = fdi;
});
// Lower right: Universal 25-32 → FDI 48-41
[48, 47, 46, 45, 44, 43, 42, 41].forEach((fdi, i) => {
  UNIVERSAL_TO_FDI[i + 25] = fdi;
});

// ─── Dental Measurement Presets ─────────────────────────────────────────────

interface MeasurementPreset {
  id: string;
  label: string;
  toolType: 'distance' | 'angle';
  autoLabel: string;
  unit: string;
  icon: string;
}

const MEASUREMENT_PRESETS: MeasurementPreset[] = [
  {
    id: 'periapical-length',
    label: 'Periapical Length',
    toolType: 'distance',
    autoLabel: 'PA length',
    unit: 'mm',
    icon: 'PeriapicalLength',
  },
  {
    id: 'canal-angle',
    label: 'Canal Angle',
    toolType: 'angle',
    autoLabel: 'Canal angle',
    unit: '°',
    icon: 'CanalAngle',
  },
  {
    id: 'crown-width',
    label: 'Crown Width',
    toolType: 'distance',
    autoLabel: 'Crown width',
    unit: 'mm',
    icon: 'CrownWidth',
  },
  {
    id: 'root-length',
    label: 'Root Length',
    toolType: 'distance',
    autoLabel: 'Root length',
    unit: 'mm',
    icon: 'RootLength',
  },
];

// ─── Types ──────────────────────────────────────────────────────────────────

type NumberingSystem = 'FDI' | 'Universal';

interface DentalMeasurement {
  id: string;
  presetId: string;
  label: string;
  value: number | null;
  unit: string;
  toothNumber: number | null;
  timestamp: number;
}

interface DentalHeaderProps {
  theme: 'DENTAL' | 'RADIOLOGY';
  children?: ReactNode;
  menuOptions: Array<{
    title: string;
    icon?: string;
    onClick: () => void;
  }>;
  isReturnEnabled?: boolean;
  onClickReturnButton?: () => void;
  isSticky?: boolean;
  WhiteLabeling?: {
    createLogoComponentFn?: (React: any, props: any) => ReactNode;
  };
  PatientInfo?: ReactNode;
  UndoRedo?: ReactNode;
  // Dental-specific props
  practiceName?: string;
  patientName?: string;
  patientId?: string;
  onToggleRadiologyTheme?: () => void;
  onToothSelect?: (toothNumber: number, system: NumberingSystem) => void;
  onMeasurementSelect?: (preset: MeasurementPreset) => void;
  onExportMeasurements?: (measurements: DentalMeasurement[]) => void;
  measurements?: DentalMeasurement[];
  selectedTooth?: number | null;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Practice Info Badge */
function PracticeInfoBadge({
  practiceName,
  patientName,
  patientId,
}: {
  practiceName: string;
  patientName?: string;
  patientId?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="bg-primary/20 flex h-7 w-7 items-center justify-center rounded-md">
          <Icons.Tooth className="text-primary h-4 w-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-primary text-sm font-semibold">{practiceName}</span>
          {patientName && (
            <span className="text-muted-foreground text-xs">
              {patientName}
              {patientId && <span className="ml-1 opacity-60">({patientId})</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Tooth Selector Dropdown */
function ToothSelector({
  numberingSystem,
  onNumberingSystemChange,
  selectedTooth,
  onToothSelect,
}: {
  numberingSystem: NumberingSystem;
  onNumberingSystemChange: (system: NumberingSystem) => void;
  selectedTooth: number | null;
  onToothSelect: (toothNumber: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary-dark flex items-center gap-1.5 px-2 py-1"
        >
          <Icons.DentalArch className="h-5 w-5" />
          <span className="text-xs font-medium">
            {selectedTooth != null
              ? `#${numberingSystem === 'Universal' ? selectedTooth : UNIVERSAL_TO_FDI[selectedTooth] || selectedTooth}`
              : 'Tooth'}
          </span>
          <Icons.ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[320px] p-3"
      >
        {/* Numbering System Toggle */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Numbering
          </span>
          <div className="bg-secondary flex rounded-md">
            <button
              className={classNames(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                numberingSystem === 'FDI'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-primary'
              )}
              onClick={() => onNumberingSystemChange('FDI')}
            >
              FDI
            </button>
            <button
              className={classNames(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                numberingSystem === 'Universal'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-primary'
              )}
              onClick={() => onNumberingSystemChange('Universal')}
            >
              Universal
            </button>
          </div>
        </div>

        {numberingSystem === 'Universal' ? (
          /* Universal grid: 4 rows × 8 cols */
          <div className="space-y-1">
            {/* Upper row: 1-8 */}
            <div className="flex justify-center gap-0.5">
              {UNIVERSAL_TEETH.slice(0, 8).map(t => (
                <ToothButton
                  key={t}
                  number={t}
                  selected={selectedTooth === t}
                  onClick={() => onToothSelect(t)}
                />
              ))}
            </div>
            {/* Upper row: 9-16 */}
            <div className="flex justify-center gap-0.5">
              {UNIVERSAL_TEETH.slice(8, 16).map(t => (
                <ToothButton
                  key={t}
                  number={t}
                  selected={selectedTooth === t}
                  onClick={() => onToothSelect(t)}
                />
              ))}
            </div>
            <div className="border-secondary-dark my-1 border-t" />
            {/* Lower row: 17-24 */}
            <div className="flex justify-center gap-0.5">
              {UNIVERSAL_TEETH.slice(16, 24).map(t => (
                <ToothButton
                  key={t}
                  number={t}
                  selected={selectedTooth === t}
                  onClick={() => onToothSelect(t)}
                />
              ))}
            </div>
            {/* Lower row: 25-32 */}
            <div className="flex justify-center gap-0.5">
              {UNIVERSAL_TEETH.slice(24, 32).map(t => (
                <ToothButton
                  key={t}
                  number={t}
                  selected={selectedTooth === t}
                  onClick={() => onToothSelect(t)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* FDI grid: quadrant-based */
          <div className="space-y-1">
            {FDI_QUADRANTS.map((quad, qi) => (
              <React.Fragment key={quad.label}>
                {qi === 2 && <div className="border-secondary-dark my-1 border-t" />}
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground w-6 text-center text-[10px] font-medium">
                    {quad.label}
                  </span>
                  <div className="flex gap-0.5">
                    {quad.teeth.map(t => {
                      const universalKey = Object.entries(UNIVERSAL_TO_FDI).find(
                        ([, fdi]) => fdi === t
                      );
                      const uNum = universalKey ? Number(universalKey[0]) : null;
                      return (
                        <ToothButton
                          key={t}
                          number={t}
                          selected={uNum != null && selectedTooth === uNum}
                          onClick={() => uNum != null && onToothSelect(uNum)}
                        />
                      );
                    })}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ToothButton({
  number,
  selected,
  onClick,
}: {
  number: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={classNames(
        'flex h-7 w-7 items-center justify-center rounded text-xs font-medium transition-colors',
        selected
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary hover:bg-secondary-dark text-primary'
      )}
      onClick={onClick}
    >
      {number}
    </button>
  );
}

/** Dental Measurements Palette Dropdown */
function MeasurementsPalette({
  measurements,
  onMeasurementSelect,
  onExportMeasurements,
}: {
  measurements: DentalMeasurement[];
  onMeasurementSelect: (preset: MeasurementPreset) => void;
  onExportMeasurements: (measurements: DentalMeasurement[]) => void;
}) {
  const [sortBy, setSortBy] = useState<'time' | 'label'>('time');
  const [filterPreset, setFilterPreset] = useState<string | null>(null);

  const sortedMeasurements = [...measurements].sort((a, b) => {
    if (sortBy === 'time') {
      return b.timestamp - a.timestamp;
    }
    return a.label.localeCompare(b.label);
  });

  const filteredMeasurements = filterPreset
    ? sortedMeasurements.filter(m => m.presetId === filterPreset)
    : sortedMeasurements;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary-dark flex items-center gap-1.5 px-2 py-1"
        >
          <Icons.ToolLength className="h-5 w-5" />
          <span className="text-xs font-medium">Measurements</span>
          {measurements.length > 0 && (
            <span className="bg-primary text-primary-foreground ml-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold">
              {measurements.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0"
      >
        {/* Preset Buttons */}
        <div className="border-b p-3">
          <span className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wide">
            Measurement Presets
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {MEASUREMENT_PRESETS.map(preset => {
              const PresetIcon = Icons[preset.icon as keyof typeof Icons] as
                | React.FC<any>
                | undefined;
              return (
                <button
                  key={preset.id}
                  className="bg-secondary hover:bg-secondary-dark flex items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors"
                  onClick={() => onMeasurementSelect(preset)}
                >
                  {PresetIcon && <PresetIcon className="text-primary h-4 w-4 flex-shrink-0" />}
                  <div className="min-w-0">
                    <div className="text-primary truncate text-xs font-medium">{preset.label}</div>
                    <div className="text-muted-foreground text-[10px]">
                      {preset.toolType === 'distance' ? 'Distance' : 'Angle'} · {preset.unit}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Measurements List */}
        <div className="max-h-[250px] overflow-y-auto p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Results ({filteredMeasurements.length})
            </span>
            <div className="flex gap-1">
              {/* Sort toggle */}
              <button
                className={classNames(
                  'rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                  sortBy === 'time'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-primary'
                )}
                onClick={() => setSortBy('time')}
              >
                Recent
              </button>
              <button
                className={classNames(
                  'rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                  sortBy === 'label'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-primary'
                )}
                onClick={() => setSortBy('label')}
              >
                A-Z
              </button>
              <div className="border-secondary-dark mx-1 border-l" />
              {/* Filter buttons */}
              <button
                className={classNames(
                  'rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                  filterPreset === null
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-primary'
                )}
                onClick={() => setFilterPreset(null)}
              >
                All
              </button>
              {MEASUREMENT_PRESETS.map(p => (
                <button
                  key={p.id}
                  className={classNames(
                    'rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                    filterPreset === p.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                  onClick={() => setFilterPreset(p.id)}
                  title={p.label}
                >
                  {p.autoLabel.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {filteredMeasurements.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center text-xs">
              No measurements yet. Select a preset above to start measuring.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredMeasurements.map(m => (
                <div
                  key={m.id}
                  className="bg-secondary flex items-center justify-between rounded-md px-2.5 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-medium">{m.label}</span>
                    {m.toothNumber && (
                      <span className="bg-secondary-dark text-muted-foreground rounded px-1 text-[10px]">
                        #{m.toothNumber}
                      </span>
                    )}
                  </div>
                  <span className="text-primary text-xs font-semibold">
                    {m.value != null ? `${m.value.toFixed(1)} ${m.unit}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="border-t p-2">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors"
            onClick={() => onExportMeasurements(measurements)}
          >
            <Icons.Export className="h-3.5 w-3.5" />
            Export JSON
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Main DentalHeader Component ────────────────────────────────────────────

function DentalHeader({
  children,
  menuOptions,
  isReturnEnabled = true,
  onClickReturnButton,
  isSticky = false,
  WhiteLabeling,
  PatientInfo,
  UndoRedo,
  // Secondary,
  // Dental-specific
  practiceName = 'Dental Practice',
  patientName,
  patientId,
  theme,
  onToggleRadiologyTheme,
  onToothSelect,
  onMeasurementSelect,
  onExportMeasurements,
  measurements = [],
  selectedTooth = null,
  ...props
}: DentalHeaderProps): ReactNode {
  if (theme === 'RADIOLOGY') return;

  const [numberingSystem, setNumberingSystem] = useState<NumberingSystem>('Universal');
  const [localSelectedTooth, setLocalSelectedTooth] = useState<number | null>(selectedTooth);

  const handleToothSelect = useCallback(
    (toothNumber: number) => {
      setLocalSelectedTooth(toothNumber);
      onToothSelect?.(toothNumber, numberingSystem);
    },
    [numberingSystem, onToothSelect]
  );

  const onClickReturn = () => {
    if (isReturnEnabled && onClickReturnButton) {
      onClickReturnButton();
    }
  };

  const activeTooth = selectedTooth ?? localSelectedTooth;

  return (
    <IconPresentationProvider
      size="large"
      IconContainer={ToolButton}
    >
      <NavBar
        isSticky={isSticky}
        {...props}
      >
        <div className="relative h-[48px] items-center">
          {/* Left Section: Back button + Practice Info */}
          <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
            <div
              className={classNames(
                'inline-flex items-center',
                isReturnEnabled && 'cursor-pointer'
              )}
              onClick={onClickReturn}
              data-cy="return-to-work-list"
            >
              {isReturnEnabled && <Icons.ArrowLeft className="text-primary ml-1 h-7 w-7" />}
              <div className="ml-1">
                {WhiteLabeling?.createLogoComponentFn?.(React, props) || <Icons.OHIFLogo />}
              </div>
            </div>
            <div className="border-primary-dark mx-1 h-[25px] border-r" />
            <PracticeInfoBadge
              practiceName={practiceName}
              patientName={patientName}
              patientId={patientId}
            />
          </div>

          {/* Secondary slot */}
          {/* <div className="absolute top-1/2 left-[420px] h-8 -translate-y-1/2">{Secondary}</div> */}

          {/* Center: Toolbar children */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="flex items-center justify-center space-x-2">{children}</div>
          </div>

          {/* Right Section: Tooth Selector, Measurements, Theme Toggle, Patient Info, Settings */}
          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 select-none items-center gap-0.5">
            <ToothSelector
              numberingSystem={numberingSystem}
              onNumberingSystemChange={setNumberingSystem}
              selectedTooth={activeTooth}
              onToothSelect={handleToothSelect}
            />

            <div className="border-primary-dark mx-1 h-[25px] border-r" />

            {UndoRedo}
            {UndoRedo && <div className="border-primary-dark mx-1 h-[25px] border-r" />}

            <DentalThemeToggleButton
              isDentalTheme={false}
              onToggle={onToggleRadiologyTheme || (() => {})}
            />

            <div className="border-primary-dark mx-1 h-[25px] border-r" />

            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:bg-primary-dark mt-2 h-full w-full"
                  >
                    <Icons.GearSettings />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {menuOptions.map((option, index) => {
                    const IconComponent = option.icon
                      ? Icons[option.icon as keyof typeof Icons]
                      : null;
                    return (
                      <DropdownMenuItem
                        key={index}
                        onSelect={option.onClick}
                        className="flex items-center gap-2 py-2"
                      >
                        {IconComponent && (
                          <span className="flex h-4 w-4 items-center justify-center">
                            <Icons.ByName name={option.icon} />
                          </span>
                        )}
                        <span className="flex-1">{option.title}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </NavBar>
    </IconPresentationProvider>
  );
}

export default DentalHeader;
