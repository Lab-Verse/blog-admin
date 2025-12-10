'use client';

import React from 'react';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

const PRESET_COLORS = [
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Green
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F43F5E', // Rose
];

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onChange(color)}
                        className={`w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110 ${value === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                            }`}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Custom:</label>
                <input
                    type="color"
                    value={value || '#3B82F6'}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
}
