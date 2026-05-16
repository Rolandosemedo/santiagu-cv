"use client";

import * as Slider from "@radix-ui/react-slider";
import { Star } from "lucide-react";

interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
}

function ratingLabel(v: number) {
  if (v === 0) return "Qualquer avaliação";
  if (v === 5) return "Apenas 5 estrelas";
  return `${v}★ ou mais`;
}

export function RatingSlider({ value, onChange }: RatingSliderProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      {/* Label */}
      <div className="flex items-center gap-1 shrink-0 min-w-[120px]">
        <Star className="w-3.5 h-3.5 fill-sand text-sand" />
        <span className="text-xs font-body font-medium text-ocean-dark">
          {ratingLabel(value)}
        </span>
      </div>

      {/* Track */}
      <Slider.Root
        min={0}
        max={5}
        step={0.5}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="relative flex items-center select-none touch-none flex-1 h-5"
        aria-label="Avaliação mínima"
      >
        <Slider.Track className="relative bg-ocean/10 grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-ocean rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 bg-white rounded-full border-2 border-ocean shadow-card
                     hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ocean/30
                     transition-transform cursor-pointer"
        />
      </Slider.Root>

      {/* Max label */}
      <div className="flex items-center gap-0.5 shrink-0 text-muted">
        <Star className="w-3 h-3 fill-muted text-muted" />
        <span className="text-xs font-body">5</span>
      </div>

      {/* Reset */}
      {value > 0 && (
        <button
          onClick={() => onChange(0)}
          className="shrink-0 text-xs font-body text-ocean hover:text-ocean-dark transition-colors"
          aria-label="Limpar filtro de avaliação"
        >
          Limpar
        </button>
      )}
    </div>
  );
}
