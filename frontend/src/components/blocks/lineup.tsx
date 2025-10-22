'use client';

import React, { useState, useEffect } from 'react';
import { ImExit } from 'react-icons/im';

export interface LineupSlot {
  start: string;
  end: string;
  dj: string;
  genre: string;
}

export interface LineupFloor {
  name: string;
  color: 'purple' | 'blue' | 'yellow';
  slots: LineupSlot[];
}

const PIXELS_PER_HOUR = 80;

// ========== Utility Functions ==========

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  let minutes = h * 60 + m;
  // Handle times after midnight (00:00 - 11:59) as next day
  if (h < 12) minutes += 24 * 60;
  return minutes;
}

function getCurrentMinutes(): number {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  let currentMinutes = currentHour * 60 + currentMinute;
  // Handle times after midnight
  if (currentHour < 12) currentMinutes += 24 * 60;
  return currentMinutes;
}

function findEarliestStart(data: LineupFloor[]): number {
  let earliest = Infinity;
  data.forEach(floor => {
    floor.slots.forEach(slot => {
      const minutes = timeToMinutes(slot.start);
      if (minutes < earliest) earliest = minutes;
    });
  });
  return earliest;
}

function findLatestEnd(data: LineupFloor[]): number {
  let latest = 0;
  data.forEach(floor => {
    floor.slots.forEach(slot => {
      const minutes = timeToMinutes(slot.end);
      if (minutes > latest) latest = minutes;
    });
  });
  return latest;
}

function calculateTopOffset(time: string, earliestStart: number, pixelsPerHour: number = PIXELS_PER_HOUR): number {
  const minutes = timeToMinutes(time);
  const diff = minutes - earliestStart;
  return (diff / 60) * pixelsPerHour;
}

function getDurationInMinutes(start: string, end: string): number {
  return timeToMinutes(end) - timeToMinutes(start);
}

function getSlotHeight(start: string, end: string, columnGap: number = 12, pixelsPerHour: number = PIXELS_PER_HOUR): number {
  const duration = getDurationInMinutes(start, end);
  const fullHeight = (duration / 60) * pixelsPerHour;
  // Subtract half gap from top and half from bottom for equal spacing
  return fullHeight - columnGap;
}

function isSlotActive(slot: LineupSlot): boolean {
  const now = getCurrentMinutes();
  const start = timeToMinutes(slot.start);
  const end = timeToMinutes(slot.end);
  return now >= start && now < end;
}

function getColorClasses(color: 'purple' | 'blue' | 'yellow', isActive: boolean = false) {
  const colors = {
    purple: {
      bg: isActive ? 'bg-purple-200' : 'bg-purple-100',
      bgActive: 'bg-purple-300',
      border: isActive ? 'border-purple-600' : 'border-purple-400',
      text: 'text-purple-700',
      gradient: 'from-purple-500 to-pink-500'
    },
    blue: {
      bg: isActive ? 'bg-blue-200' : 'bg-blue-100',
      bgActive: 'bg-blue-300',
      border: isActive ? 'border-blue-600' : 'border-blue-400',
      text: 'text-blue-700',
      gradient: 'from-blue-500 to-cyan-500'
    },
    yellow: {
      bg: isActive ? 'bg-yellow-200' : 'bg-yellow-100',
      bgActive: 'bg-yellow-300',
      border: isActive ? 'border-yellow-600' : 'border-yellow-400',
      text: 'text-yellow-800',
      gradient: 'from-yellow-500 to-orange-500'
    }
  };
  return colors[color];
}

function generateHourMarkers(earliestStart: number, latestEnd: number): number[] {
  const startHour = Math.floor(earliestStart / 60);
  const endHour = Math.ceil(latestEnd / 60);
  const hours: number[] = [];

  for (let h = startHour; h <= endHour; h++) {
    hours.push(h);
  }

  return hours;
}

function formatHourLabel(hour: number): string {
  const displayHour = hour >= 24 ? hour - 24 : hour;
  return `${displayHour.toString().padStart(2, '0')}:00`;
}

// ========== Components ==========

function TimeGrid({
  earliestStart,
  latestEnd,
  showLabels = true,
  labelOffset = '-left-10',
  pixelsPerHour = PIXELS_PER_HOUR
}: {
  earliestStart: number;
  latestEnd: number;
  showLabels?: boolean;
  labelOffset?: string;
  pixelsPerHour?: number;
}) {
  const hours = generateHourMarkers(earliestStart, latestEnd);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {hours.map((hour) => {
        const top = calculateTopOffset(formatHourLabel(hour), earliestStart, pixelsPerHour);

        return (
          <div
            key={hour}
            className="absolute left-0 right-0 flex items-center"
            style={{ top: `${top}px` }}
          >
            {showLabels && (
              <span className={`absolute ${labelOffset} text-xs font-medium text-gray-500 w-10 text-right pr-6 pointer-events-auto`}>
                {formatHourLabel(hour)}
              </span>
            )}
            <div className="w-full h-0.5 bg-gray-300" />
          </div>
        );
      })}
    </div>
  );
}

function CurrentTimeLine({ earliestStart, pixelsPerHour = PIXELS_PER_HOUR }: { earliestStart: number; pixelsPerHour?: number }) {
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const now = getCurrentMinutes();
      if (now < earliestStart) {
        setPosition(null);
        return;
      }

      const diff = now - earliestStart;
      const pos = (diff / 60) * pixelsPerHour;
      setPosition(pos);
    };

    updatePosition();
    const interval = setInterval(updatePosition, 60000);

    return () => clearInterval(interval);
  }, [earliestStart, pixelsPerHour]);

  if (position === null) return null;

  return (
    <div
      className="absolute left-0 right-0 h-0.5 bg-red-500 pointer-events-none z-20 mix-blend-multiply opacity-40"
      style={{ top: `${position}px` }}
    >
      <div className="absolute left-0 -top-1.5 w-1.5 h-3 bg-red-500 rounded-r-full shadow-md"></div>
      <div className="absolute right-0 -top-1.5 w-1.5 h-3 bg-red-500 rounded-l-full shadow-md"></div>
    </div>
  );
}

function TimelineLayer({
  earliestStart,
  latestEnd,
  pixelsPerHour = PIXELS_PER_HOUR,
  labelOffset = '-left-10'
}: {
  earliestStart: number;
  latestEnd: number;
  pixelsPerHour?: number;
  labelOffset?: string;
}) {
  const totalHeight = ((latestEnd - earliestStart) / 60) * pixelsPerHour + 40;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ minHeight: `${totalHeight}px` }}>
      <TimeGrid earliestStart={earliestStart} latestEnd={latestEnd} pixelsPerHour={pixelsPerHour} labelOffset={labelOffset} />
      <CurrentTimeLine earliestStart={earliestStart} pixelsPerHour={pixelsPerHour} />
    </div>
  );
}

function DesktopCard({
  slot,
  color,
  columnGap = 12,
  horizontalInfo = false
}: {
  slot: LineupSlot;
  color: 'purple' | 'blue' | 'yellow';
  columnGap?: number;
  horizontalInfo?: boolean;
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkActive = () => setIsActive(isSlotActive(slot));
    checkActive();
    const interval = setInterval(checkActive, 60000);
    return () => clearInterval(interval);
  }, [slot]);

  const colors = getColorClasses(color, isActive);
  const height = getSlotHeight(slot.start, slot.end, columnGap);

  return (
    <div
      className={`${colors.bg} rounded-lg shadow-sm transition-all duration-300 border-l-4 ${colors.border} overflow-hidden flex flex-col relative z-10`}
      style={{ height, minHeight: '50px' }}
    >
      <div className="px-3 pt-2 pb-0.5">
        <div className={`text-xs font-semibold ${colors.text} text-right leading-none`}>{slot.start}</div>
      </div>
      <div className="px-3 flex-1 flex flex-col justify-center min-h-0 py-1">
        {horizontalInfo ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 break-words text-sm leading-tight">{slot.dj}</h3>
            <p className="text-gray-700 text-xs break-words leading-tight">{slot.genre}</p>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-gray-900 break-words text-sm leading-tight">{slot.dj}</h3>
            <p className="text-gray-700 text-xs mt-0.5 break-words leading-tight">{slot.genre}</p>
          </>
        )}
      </div>
      <div className="px-3 pb-2 pt-0.5">
        <div className={`text-xs font-semibold ${colors.text} text-right leading-none`}>{slot.end}</div>
      </div>
    </div>
  );
}

function MobileCard({
  slot,
  color,
  columnGap = 12,
  pixelsPerHour = 50
}: {
  slot: LineupSlot;
  color: 'purple' | 'blue' | 'yellow';
  columnGap?: number;
  pixelsPerHour?: number;
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkActive = () => setIsActive(isSlotActive(slot));
    checkActive();
    const interval = setInterval(checkActive, 60000);
    return () => clearInterval(interval);
  }, [slot]);

  const colors = getColorClasses(color, isActive);
  const height = getSlotHeight(slot.start, slot.end, columnGap, pixelsPerHour);
  const duration = getDurationInMinutes(slot.start, slot.end);
  const isShortSlot = duration <= 60;
  const paddingClass = isShortSlot ? 'px-3 py-1' : 'px-3 py-2';

  return (
    <div
      className={`${colors.bg} rounded-lg shadow-sm transition-all duration-300 border-l-4 ${colors.border} overflow-hidden flex flex-col relative z-10`}
      style={{ height }}
    >
      <div className={`${paddingClass} flex-1 flex gap-3 min-h-0`}>
        <div className="flex-1 min-w-0 flex items-baseline gap-2 flex-wrap">
          <h3 className="font-bold text-gray-900 text-sm leading-tight break-words">{slot.dj}</h3>
          <p className="text-gray-700 text-xs leading-tight break-words">{slot.genre}</p>
        </div>
        {isShortSlot ? (
          <div className="flex items-center flex-shrink-0">
            <div className={`text-xs font-semibold ${colors.text} leading-none whitespace-nowrap`}>{slot.start}-{slot.end}</div>
          </div>
        ) : (
          <div className="flex flex-col items-end justify-between flex-shrink-0">
            <div className={`text-xs font-semibold ${colors.text} leading-none`}>{slot.start}</div>
            <div className={`text-xs font-semibold ${colors.text} leading-none`}>{slot.end}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function FloorBadge({ name, color, compact = false }: { name: string; color: 'purple' | 'blue' | 'yellow'; compact?: boolean }) {
  const colors = getColorClasses(color);
  return (
    <div className={`inline-flex items-center rounded-full bg-gradient-to-r ${colors.gradient} text-white font-bold shadow-md ${compact ? 'px-4 py-1.5 text-base' : 'px-6 py-2 text-lg'}`}>
      <span>{name}</span>
    </div>
  );
}

function EndMarker({ time, compact = false, columnGap = 0 }: { time: string; compact?: boolean; columnGap?: number }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 bg-green-500 text-white rounded-full font-bold shadow-md ${compact ? 'py-2 px-3 text-xs' : 'py-2.5 px-4 text-sm'}`}
      style={columnGap > 0 ? { marginTop: `${columnGap / 2}px` } : {}}
    >
      <span>Ende {time}</span>
      <ImExit className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
    </div>
  );
}

function MobileFloorSection({
  floor,
  earliestStart,
  latestEnd
}: {
  floor: LineupFloor;
  earliestStart: number;
  latestEnd: number;
}) {
  const pixelsPerHour = 50;
  const columnGap = 12;
  const halfGap = columnGap / 2;
  const totalHeight = ((latestEnd - earliestStart) / 60) * pixelsPerHour + 40;
  const lastSlot = floor.slots[floor.slots.length - 1];

  return (
    <div className="relative">
      <div className="flex justify-start pb-4 pl-4">
        <FloorBadge name={floor.name} color={floor.color} compact />
      </div>

      <div className="relative pl-10 pb-12">
        <div className="relative" style={{ paddingLeft: `${columnGap}px`, paddingRight: `${columnGap}px` }}>
          <TimelineLayer earliestStart={earliestStart} latestEnd={latestEnd} pixelsPerHour={pixelsPerHour} />

          <div className="relative" style={{ minHeight: `${totalHeight}px` }}>
            {floor.slots.map((slot, idx) => (
              <div key={idx} className="absolute w-full left-0" style={{ top: `${calculateTopOffset(slot.start, earliestStart, pixelsPerHour) + halfGap}px` }}>
                <MobileCard slot={slot} color={floor.color} columnGap={columnGap} pixelsPerHour={pixelsPerHour} />
              </div>
            ))}

            <div className="absolute w-full left-0 flex justify-center" style={{ top: `${calculateTopOffset(lastSlot.end, earliestStart, pixelsPerHour)}px` }}>
              <EndMarker time={lastSlot.end} compact columnGap={columnGap} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopFloorColumn({
  floor,
  earliestStart,
  columnGap = 12
}: {
  floor: LineupFloor;
  earliestStart: number;
  columnGap?: number;
}) {
  const halfGap = columnGap / 2;
  const lastSlot = floor.slots[floor.slots.length - 1];

  return (
    <div className="relative">
      {floor.slots.map((slot, idx) => (
        <div key={idx} className="absolute w-full" style={{ top: `${calculateTopOffset(slot.start, earliestStart) + halfGap}px` }}>
          <DesktopCard slot={slot} color={floor.color} columnGap={columnGap} />
        </div>
      ))}

      <div className="absolute w-full flex justify-center" style={{ top: `${calculateTopOffset(lastSlot.end, earliestStart)}px` }}>
        <EndMarker time={lastSlot.end} columnGap={columnGap} />
      </div>
    </div>
  );
}

function DesktopView({ floors }: { floors: LineupFloor[] }) {
  const earliestStart = findEarliestStart(floors);
  const latestEnd = findLatestEnd(floors);
  const totalHeight = ((latestEnd - earliestStart) / 60) * PIXELS_PER_HOUR + 40;
  const gap = 12;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative pl-10 mb-6">
        <div className="relative" style={{ paddingLeft: `${gap}px`, paddingRight: `${gap}px` }}>
          <div className="grid grid-cols-3 relative" style={{ gap: `${gap}px` }}>
            {floors.map((floor, idx) => (
              <div key={idx} className="flex justify-center">
                <FloorBadge name={floor.name} color={floor.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative pl-10">
        <div className="relative" style={{ paddingLeft: `${gap}px`, paddingRight: `${gap}px` }}>
          <TimelineLayer earliestStart={earliestStart} latestEnd={latestEnd} />

          <div className="grid grid-cols-3 relative" style={{ gap: `${gap}px`, minHeight: `${totalHeight}px` }}>
            {floors.map((floor, idx) => (
              <DesktopFloorColumn key={idx} floor={floor} earliestStart={earliestStart} columnGap={gap} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Main Component ==========

interface LineupProps {
  data: LineupFloor[];
}

export default function Lineup({ data }: LineupProps) {
  if (!data || data.length === 0) {
    throw new Error('Lineup component requires data prop with at least one floor');
  }

  const floors = data;
  const earliestStart = findEarliestStart(floors);
  const latestEnd = findLatestEnd(floors);

  return (
    <div className="bg-white min-h-screen isolate">
      <div className="max-w-7xl mx-auto">
        {/* Mobile View */}
        <div className="md:hidden">
          {floors.map((floor, idx) => (
            <MobileFloorSection
              key={idx}
              floor={floor}
              earliestStart={earliestStart}
              latestEnd={latestEnd}
            />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block py-10">
          <DesktopView floors={floors} />
        </div>
      </div>
    </div>
  );
}
