import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icons, PanelSection, Tooltip, TooltipContent, TooltipTrigger } from '../../index';
import { InputFilter } from '../InputFilter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../Select';
import DataRow from '../DataRow/DataRow';
import { createContext } from '../../lib/createContext';

interface MeasurementTableContext {
  data?: any[];
  onAction?: (e, command: string | string[], uid: string) => void;
  disableEditing?: boolean;
  isExpanded: boolean;
}

const [MeasurementTableProvider, useMeasurementTableContext] =
  createContext<MeasurementTableContext>('MeasurementTable', { data: [], isExpanded: true });

interface MeasurementDataProps extends MeasurementTableContext {
  title: string;
  children: React.ReactNode;
}

const MeasurementTable = ({
  data = [],
  onAction,
  isExpanded = true,
  title,
  children,
  disableEditing = false,
}: MeasurementDataProps) => {
  const { t } = useTranslation('MeasurementTable');
  const amount = data.length;

  return (
    <MeasurementTableProvider
      data={data}
      onAction={onAction}
      isExpanded={isExpanded}
      disableEditing={disableEditing}
    >
      <PanelSection defaultOpen={true}>
        <PanelSection.Header
          key="measurementTableHeader"
          className="bg-secondary-dark"
        >
          <span>{`${t(title)} (${amount})`}</span>
        </PanelSection.Header>
        <PanelSection.Content key="measurementTableContent">{children}</PanelSection.Content>
      </PanelSection>
    </MeasurementTableProvider>
  );
};

const Header = ({ children }: { children: React.ReactNode }) => {
  return <div className="measurement-table-header">{children}</div>;
};

type SortOption = 'default' | 'label-asc' | 'label-desc' | 'tool-asc' | 'tool-desc' | 'value-asc' | 'value-desc';

function extractNumericValue(item: MeasurementItem): number {
  const primary = item.displayText?.primary;
  if (!primary || primary.length === 0) {
    return 0;
  }
  const match = primary[0]?.match?.(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function getToolDisplayName(toolName: string): string {
  const names: Record<string, string> = {
    Length: 'Length',
    Bidirectional: 'Bidirectional',
    EllipticalROI: 'Elliptical ROI',
    CircleROI: 'Circle ROI',
    ArrowAnnotate: 'Arrow',
    Angle: 'Angle',
    CobbAngle: 'Cobb Angle',
    RectangleROI: 'Rectangle ROI',
    PlanarFreehandROI: 'Freehand ROI',
    Probe: 'Probe',
    SplineROI: 'Spline ROI',
    LivewireContour: 'Livewire',
    CalibrationLine: 'Calibration',
  };
  return names[toolName] || toolName || 'Unknown';
}

const Body = () => {
  const { data } = useMeasurementTableContext('MeasurementTable.Body');
  const { t } = useTranslation('MeasurementTable');

  const [searchText, setSearchText] = useState('');
  const [toolFilter, setToolFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const toolNames = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    const names = new Set<string>();
    data.forEach(item => {
      if (item.toolName) {
        names.add(item.toolName);
      }
    });
    return Array.from(names).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    let result = [...data];

    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(item => {
        const label = (item.label || '').toLowerCase();
        const primaryText = (item.displayText?.primary || []).join(' ').toLowerCase();
        const toolName = (item.toolName || '').toLowerCase();
        return label.includes(lower) || primaryText.includes(lower) || toolName.includes(lower);
      });
    }

    if (toolFilter !== 'all') {
      result = result.filter(item => item.toolName === toolFilter);
    }

    if (sortBy !== 'default') {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'label-asc':
            return (a.label || '').localeCompare(b.label || '');
          case 'label-desc':
            return (b.label || '').localeCompare(a.label || '');
          case 'tool-asc':
            return (a.toolName || '').localeCompare(b.toolName || '');
          case 'tool-desc':
            return (b.toolName || '').localeCompare(a.toolName || '');
          case 'value-asc':
            return extractNumericValue(a) - extractNumericValue(b);
          case 'value-desc':
            return extractNumericValue(b) - extractNumericValue(a);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [data, searchText, toolFilter, sortBy]);

  if (!data || data.length === 0) {
    return (
      <div className="text-primary-light mb-1 flex flex-1 items-center px-2 py-2 text-base">
        {t('No tracked measurements')}
      </div>
    );
  }

  const hasActiveFilters = searchText || toolFilter !== 'all';

  return (
    <div className="measurement-table-body">
      {/* Filter & Sort Controls */}
      <div className="bg-popover space-y-1.5 px-2 py-2">
        <InputFilter
          placeholder="Search measurements..."
          onChange={setSearchText}
          className="w-full"
        />

        <div className="flex gap-1.5">
          <Select
            value={toolFilter}
            onValueChange={setToolFilter}
          >
            <SelectTrigger className="bg-background h-7 flex-1 text-xs">
              <SelectValue placeholder="All tools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tools</SelectItem>
              {toolNames.map(name => (
                <SelectItem
                  key={name}
                  value={name}
                >
                  {getToolDisplayName(name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortOption)}
          >
            <SelectTrigger className="bg-background h-7 flex-1 text-xs">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default order</SelectItem>
              <SelectItem value="label-asc">Label A-Z</SelectItem>
              <SelectItem value="label-desc">Label Z-A</SelectItem>
              <SelectItem value="tool-asc">Tool A-Z</SelectItem>
              <SelectItem value="tool-desc">Tool Z-A</SelectItem>
              <SelectItem value="value-asc">Value low-high</SelectItem>
              <SelectItem value="value-desc">Value high-low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              Showing {filteredData.length} of {data.length}
            </span>
            <button
              className="text-primary hover:underline"
              onClick={() => {
                setSearchText('');
                setToolFilter('all');
                setSortBy('default');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Measurement rows */}
      <div className="space-y-px">
        {filteredData.length === 0 ? (
          <div className="text-muted-foreground px-2 py-3 text-center text-sm">
            No measurements match the current filters
          </div>
        ) : (
          filteredData.map((item, index) => (
            <Row
              key={item.uid}
              item={item}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="measurement-table-footer">{children}</div>;
};

interface MeasurementItem {
  uid: string;
  label: string;
  colorHex: string;
  isSelected: boolean;
  displayText: { primary: string[]; secondary: string[] };
  isVisible: boolean;
  isLocked: boolean;
  toolName: string;
  isExpanded: boolean;
  isUnmapped?: boolean;
  statusTooltip?: string;
}

interface RowProps {
  item: MeasurementItem;
  index: number;
}

const Row = ({ item, index }: RowProps) => {
  const { onAction, isExpanded, disableEditing } =
    useMeasurementTableContext('MeasurementTable.Row');

  const { uid } = item;
  return (
    <DataRow
      key={item.uid}
      description={item.label}
      number={index + 1}
      title={item.label}
      colorHex={item.colorHex}
      isSelected={item.isSelected}
      details={item.displayText}
      onDelete={e => onAction(e, 'removeMeasurement', uid)}
      onSelect={e => onAction(e, 'jumpToMeasurement', uid)}
      onRename={e => onAction(e, 'renameMeasurement', uid)}
      onToggleVisibility={e => onAction(e, 'toggleVisibilityMeasurement', uid)}
      onToggleLocked={e => onAction(e, 'toggleLockMeasurement', uid)}
      onColor={e => onAction(e, 'changeMeasurementColor', uid)}
      disableEditing={disableEditing}
      isVisible={item.isVisible}
      isLocked={item.isLocked}
    >
      {item.isUnmapped && (
        <DataRow.Status.Warning tooltip={item.statusTooltip} />
      )}
    </DataRow>
  );
};

MeasurementTable.Header = Header;
MeasurementTable.Body = Body;
MeasurementTable.Footer = Footer;
MeasurementTable.Row = Row;

export default MeasurementTable;
