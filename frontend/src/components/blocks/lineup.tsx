'use client';

import React, { useState, useEffect } from 'react';
import { ImExit } from 'react-icons/im';
import Link from 'next/link';

export interface LineupSlot {
  start: string;
  end: string;
  dj: string;
  genre: string;
  link?: string;
  links?: string[];
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

function detectLinkType(url: string): 'soundcloud' | 'instagram' | 'youtube' | 'spotify' | 'bandcamp' | 'website' {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('soundcloud.com')) return 'soundcloud';
  if (lowerUrl.includes('instagram.com')) return 'instagram';
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.includes('spotify.com')) return 'spotify';
  if (lowerUrl.includes('bandcamp.com')) return 'bandcamp';

  return 'website';
}

function getLinkIcon(type: string) {
  switch (type) {
    case 'soundcloud':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-1.714-1.304-3.106-2.911-3.106h-.21z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
      );
    case 'spotify':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      );
    case 'bandcamp':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z"/>
        </svg>
      );
    case 'website':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    default:
      return null;
  }
}

function DJInfoModal({
  slot,
  color,
  onClose
}: {
  slot: LineupSlot | null;
  color: 'purple' | 'blue' | 'yellow';
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (slot) {
      setShouldRender(true);
      // Trigger animation after render using requestAnimationFrame for reliable timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      // Check if slot is active
      const checkActive = () => setIsActive(isSlotActive(slot));
      checkActive();
      const interval = setInterval(checkActive, 60000);
      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
      // Remove from DOM after animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [slot]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  if (!shouldRender || !slot) return null;

  const colors = getColorClasses(color);

  return (
    <div
      className={`fixed inset-0 h-lvh bg-black/10 backdrop-blur-md backdrop-saturate-150 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div className="max-w-7xl w-full px-5">
        <div
          className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md mx-auto w-full overflow-hidden transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Gradient */}
          <div className={`relative bg-gradient-to-br ${colors.gradient} p-8 text-white overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              {isActive && (
                <div className="flex items-center gap-2 mb-3 opacity-90">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                  <span className="text-sm font-medium uppercase tracking-wider">Now Playing</span>
                </div>
              )}
              <h2 className="text-3xl font-black mb-2 leading-tight">{slot.dj}</h2>
              <p className="text-lg font-medium opacity-95">{slot.genre}</p>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Time Slot */}
            <div className={`${colors.bg} rounded-2xl p-4 border-2 ${colors.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${colors.bgActive} rounded-full p-2`}>
                    <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${colors.text} uppercase tracking-wide opacity-70`}>Time Slot</p>
                    <p className={`text-lg font-bold ${colors.text} leading-tight`}>{slot.start} - {slot.end}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            {(slot.links || (slot.link ? [slot.link] : [])).length > 0 && (
              <div className="space-y-2">
                {(slot.links || [slot.link!]).map((linkUrl, idx) => {
                  const linkType = detectLinkType(linkUrl);
                  return (
                    <Link
                      key={idx}
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 bg-gradient-to-r ${colors.gradient} text-white rounded-2xl p-3.5 font-bold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
                    >
                      {getLinkIcon(linkType)}
                      <span className="capitalize">{linkType}</span>
                      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl transition-all duration-150 hover:shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeGrid({
  earliestStart,
  latestEnd,
  showLabels = true,
  labelOffset = '-left-10',
  pixelsPerHour = PIXELS_PER_HOUR,
  lineThickness = 'h-0.5'
}: {
  earliestStart: number;
  latestEnd: number;
  showLabels?: boolean;
  labelOffset?: string;
  pixelsPerHour?: number;
  lineThickness?: string;
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
            <div className={`w-full ${lineThickness} bg-gray-300`} />
          </div>
        );
      })}
    </div>
  );
}

function CurrentTimeLine({ earliestStart, latestEnd, pixelsPerHour = PIXELS_PER_HOUR }: { earliestStart: number; latestEnd: number; pixelsPerHour?: number }) {
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const now = getCurrentMinutes();
      if (now < earliestStart || now > latestEnd) {
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
  }, [earliestStart, latestEnd, pixelsPerHour]);

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
  labelOffset = '-left-10',
  lineThickness = 'h-0.5'
}: {
  earliestStart: number;
  latestEnd: number;
  pixelsPerHour?: number;
  labelOffset?: string;
  lineThickness?: string;
}) {
  const totalHeight = ((latestEnd - earliestStart) / 60) * pixelsPerHour + 40;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ minHeight: `${totalHeight}px` }}>
      <TimeGrid earliestStart={earliestStart} latestEnd={latestEnd} pixelsPerHour={pixelsPerHour} labelOffset={labelOffset} lineThickness={lineThickness} />
      <CurrentTimeLine earliestStart={earliestStart} latestEnd={latestEnd} pixelsPerHour={pixelsPerHour} />
    </div>
  );
}

function DesktopCard({
  slot,
  color,
  columnGap = 12,
  horizontalInfo = false,
  onClick
}: {
  slot: LineupSlot;
  color: 'purple' | 'blue' | 'yellow';
  columnGap?: number;
  horizontalInfo?: boolean;
  onClick?: () => void;
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
      className={`${colors.bg} rounded-lg shadow-sm transition-all duration-300 border-l-4 ${colors.border} overflow-hidden flex flex-col relative z-10 cursor-pointer hover:shadow-md select-none`}
      style={{ height, minHeight: '50px' }}
      onClick={onClick}
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
  pixelsPerHour = 50,
  onClick
}: {
  slot: LineupSlot;
  color: 'purple' | 'blue' | 'yellow';
  columnGap?: number;
  pixelsPerHour?: number;
  onClick?: () => void;
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
      className={`${colors.bg} rounded-lg shadow-sm transition-all duration-300 border-l-4 ${colors.border} overflow-hidden flex flex-col relative z-10 cursor-pointer hover:shadow-md select-none`}
      style={{ height }}
      onClick={onClick}
    >
      <div className={`${paddingClass} flex-1 flex gap-3 min-h-0`}>
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-gray-900 text-sm leading-none break-words">{slot.dj}</h3>
          <p className="text-gray-700 text-xs leading-none break-words">{slot.genre}</p>
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

function EndMarker({ time, compact = false, columnGap = 0, pixelsPerHour = PIXELS_PER_HOUR }: { time: string; compact?: boolean; columnGap?: number; pixelsPerHour?: number }) {
  const halfGap = columnGap / 2;

  return (
    <div
      style={{ height: `${pixelsPerHour}px` }}
      className="flex items-center justify-center"
    >
      <div
        className={`flex items-center justify-center gap-2 bg-green-500 text-white rounded-full font-bold shadow-md ${compact ? 'py-2 px-3 text-xs' : 'py-2.5 px-4 text-sm'}`}
        style={{
          marginTop: `${halfGap}px`,
          marginBottom: `${halfGap}px`
        }}
      >
        <span>Ende {time}</span>
        <ImExit className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
      </div>
    </div>
  );
}

function MobileFloorSection({
  floor,
  earliestStart,
  latestEnd,
  onSlotClick
}: {
  floor: LineupFloor;
  earliestStart: number;
  latestEnd: number;
  onSlotClick: (slot: LineupSlot, color: 'purple' | 'blue' | 'yellow') => void;
}) {
  const pixelsPerHour = 35;
  const columnGap = 6;
  const halfGap = columnGap / 2;
  const totalHeight = ((latestEnd - earliestStart) / 60) * pixelsPerHour + 40;
  const lastSlot = floor.slots[floor.slots.length - 1];

  return (
    <div className="relative">
      <div className="flex justify-start pb-4 pl-4">
        <FloorBadge name={floor.name} color={floor.color} compact />
      </div>

      <div className="relative pl-10 pb-6">
        <div className="relative" style={{ paddingLeft: `${columnGap}px`, paddingRight: `${columnGap}px` }}>
          <TimelineLayer earliestStart={earliestStart} latestEnd={latestEnd} pixelsPerHour={pixelsPerHour} lineThickness="h-px" />

          <div className="relative" style={{ minHeight: `${totalHeight}px` }}>
            {floor.slots.map((slot, idx) => (
              <div key={idx} className="absolute w-full left-0" style={{ top: `${calculateTopOffset(slot.start, earliestStart, pixelsPerHour) + halfGap}px` }}>
                <MobileCard slot={slot} color={floor.color} columnGap={columnGap} pixelsPerHour={pixelsPerHour} onClick={() => onSlotClick(slot, floor.color)} />
              </div>
            ))}

            <div className="absolute w-full left-0 flex justify-center" style={{ top: `${calculateTopOffset(lastSlot.end, earliestStart, pixelsPerHour)}px` }}>
              <EndMarker time={lastSlot.end} compact columnGap={columnGap} pixelsPerHour={pixelsPerHour} />
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
  columnGap = 12,
  onSlotClick
}: {
  floor: LineupFloor;
  earliestStart: number;
  columnGap?: number;
  onSlotClick: (slot: LineupSlot, color: 'purple' | 'blue' | 'yellow') => void;
}) {
  const halfGap = columnGap / 2;
  const lastSlot = floor.slots[floor.slots.length - 1];

  return (
    <div className="relative">
      {floor.slots.map((slot, idx) => (
        <div key={idx} className="absolute w-full" style={{ top: `${calculateTopOffset(slot.start, earliestStart) + halfGap}px` }}>
          <DesktopCard slot={slot} color={floor.color} columnGap={columnGap} onClick={() => onSlotClick(slot, floor.color)} />
        </div>
      ))}

      <div className="absolute w-full flex justify-center" style={{ top: `${calculateTopOffset(lastSlot.end, earliestStart)}px` }}>
        <EndMarker time={lastSlot.end} columnGap={columnGap} pixelsPerHour={PIXELS_PER_HOUR} />
      </div>
    </div>
  );
}

function DesktopView({ floors, onSlotClick }: { floors: LineupFloor[]; onSlotClick: (slot: LineupSlot, color: 'purple' | 'blue' | 'yellow') => void }) {
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
              <DesktopFloorColumn key={idx} floor={floor} earliestStart={earliestStart} columnGap={gap} onSlotClick={onSlotClick} />
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

  const [selectedSlot, setSelectedSlot] = useState<LineupSlot | null>(null);
  const [selectedColor, setSelectedColor] = useState<'purple' | 'blue' | 'yellow'>('purple');

  const handleSlotClick = (slot: LineupSlot, color: 'purple' | 'blue' | 'yellow') => {
    setSelectedSlot(slot);
    setSelectedColor(color);
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
  };

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
              onSlotClick={handleSlotClick}
            />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block py-10">
          <DesktopView floors={floors} onSlotClick={handleSlotClick} />
        </div>
      </div>

      <DJInfoModal slot={selectedSlot} color={selectedColor} onClose={handleCloseModal} />
    </div>
  );
}
