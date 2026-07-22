'use client';

import {useMemo, useState} from 'react';
import {generateTimeSlots} from '@/constants/consultation';
import type {DateTimePreference} from '@/types/consultation';

type Props = {
  label: string;
  required?: boolean;
  value?: DateTimePreference;
  error?: string;
  onChange: (value?: DateTimePreference) => void;
};

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDateLabel(value?: string) {
  if (!value) return '日付を選択';
  const [year, month, day] = value.split('-').map(Number);
  return `${year}年${month}月${day}日`;
}

function isPastDate(value: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${value}T00:00:00`).getTime() < today.getTime();
}

function isPastTime(date: string | undefined, time: string) {
  if (!date) return false;
  const now = new Date();
  if (date !== toDateKey(now)) return false;
  return new Date(`${date}T${time}:00`).getTime() < now.getTime();
}

export function CalendarPicker({value, onSelect, onClose}: {value?: string; onSelect: (date: string) => void; onClose: () => void}) {
  const initial = value ? new Date(`${value}T00:00:00`) : new Date();
  const [visibleMonth, setVisibleMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [draft, setDraft] = useState(value || toDateKey(new Date()));
  const todayKey = toDateKey(new Date());
  const monthLabel = `${visibleMonth.getFullYear()}年${visibleMonth.getMonth() + 1}月`;
  const cells = useMemo(() => {
    const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const mondayStartOffset = (first.getDay() + 6) % 7;
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - mondayStartOffset);
    return Array.from({length: 42}, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const key = toDateKey(date);
      return {date, key, currentMonth: date.getMonth() === visibleMonth.getMonth(), disabled: isPastDate(key)};
    });
  }, [visibleMonth]);

  function moveMonth(delta: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  return (
    <div className="picker-backdrop" role="presentation" onClick={onClose}>
      <div className="calendar-picker" role="dialog" aria-modal="true" aria-label="日付を選択" onClick={(event) => event.stopPropagation()}>
        <div className="picker-header"><strong>日付を選択</strong><button type="button" className="icon-button" onClick={onClose} aria-label="閉じる">×</button></div>
        <div className="calendar-month"><button type="button" className="icon-button" onClick={() => moveMonth(-1)} aria-label="前月">‹</button><strong>{monthLabel}</strong><button type="button" className="icon-button" onClick={() => moveMonth(1)} aria-label="翌月">›</button></div>
        <div className="calendar-weekdays" aria-hidden="true"><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span className="saturday">土</span><span className="sunday">日</span></div>
        <div className="calendar-grid">
          {cells.map((cell) => {
            const day = cell.date.getDay();
            const className = ['calendar-day', !cell.currentMonth ? 'outside' : '', cell.key === todayKey ? 'today' : '', cell.key === draft ? 'selected' : '', day === 6 ? 'saturday' : '', day === 0 ? 'sunday' : ''].filter(Boolean).join(' ');
            return <button type="button" key={cell.key} className={className} disabled={cell.disabled} onClick={() => setDraft(cell.key)}>{cell.date.getDate()}</button>;
          })}
        </div>
        <button type="button" className="btn" onClick={() => { onSelect(draft); onClose(); }}>選択する</button>
      </div>
    </div>
  );
}

export function TimeSlotPicker({date, value, onSelect, onClose}: {date?: string; value?: string; onSelect: (time: string) => void; onClose: () => void}) {
  const slots = generateTimeSlots();
  return (
    <div className="picker-backdrop" role="presentation" onClick={onClose}>
      <div className="time-picker" role="dialog" aria-modal="true" aria-label="時間を選択" onClick={(event) => event.stopPropagation()}>
        <div className="picker-header"><strong>時間を選択</strong><button type="button" className="icon-button" onClick={onClose} aria-label="閉じる">×</button></div>
        <div className="time-grid">
          {slots.map((slot) => <button type="button" key={slot} className={slot === value ? 'time-slot selected' : 'time-slot'} disabled={isPastTime(date, slot)} onClick={() => { onSelect(slot); onClose(); }}>{slot}</button>)}
        </div>
      </div>
    </div>
  );
}

export function DateTimePreferenceField({label, required, value, error, onChange}: Props) {
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);
  const current = value ?? {date: '', time: ''};
  return (
    <div className="preference-field">
      <div className="preference-label"><span>{label}</span>{required ? <span className="required">必須</span> : <button type="button" className="clear-button" onClick={() => onChange(undefined)}>未選択に戻す</button>}</div>
      <div className="preference-controls">
        <button type="button" className="picker-trigger" onClick={() => setPicker('date')}><span aria-hidden="true">□</span>{formatDateLabel(current.date)}</button>
        <button type="button" className="picker-trigger" onClick={() => setPicker('time')}><span aria-hidden="true">◷</span>{current.time || '時間を選択'}</button>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
      {picker === 'date' && <CalendarPicker value={current.date} onClose={() => setPicker(null)} onSelect={(date) => onChange({...current, date})} />}
      {picker === 'time' && <TimeSlotPicker date={current.date} value={current.time} onClose={() => setPicker(null)} onSelect={(time) => onChange({...current, time})} />}
    </div>
  );
}
