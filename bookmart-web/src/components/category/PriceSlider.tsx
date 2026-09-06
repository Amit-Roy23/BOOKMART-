"use client";

import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";

interface PriceSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
}

export default function PriceSlider({
  min = 0,
  max = 5000,
  step = 50,
  defaultValue = [500, 2500],
  onValueChange,
}: PriceSliderProps) {
  const [value, setValue] = useState<[number, number]>(defaultValue);

  function handleChange(values: number[]) {
    const range = values as [number, number];

    setValue(range);

    onValueChange?.(range);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-emerald-50 px-4 py-2">
          <p className="text-xs text-gray-500">Min</p>

          <p className="font-semibold text-emerald-700">
            ₹{value[0]}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 px-4 py-2">
          <p className="text-xs text-gray-500">Max</p>

          <p className="font-semibold text-emerald-700">
            ₹{value[1]}
          </p>
        </div>
      </div>

      <Slider.Root
        value={value}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
        onValueChange={handleChange}
        className="
          relative
          flex
          h-6
          w-full
          touch-none
          select-none
          items-center
        "
      >
        <Slider.Track
          className="
            relative
            h-2
            grow
            rounded-full
            bg-gray-200
          "
        >
          <Slider.Range
            className="
              absolute
              h-full
              rounded-full
              bg-emerald-600
            "
          />
        </Slider.Track>

        <Slider.Thumb
          className="
            block
            h-5
            w-5
            rounded-full
            border-4
            border-emerald-600
            bg-white
            shadow-lg
            outline-none
            transition
            hover:scale-110
            focus:ring-4
            focus:ring-emerald-200
          "
        />

        <Slider.Thumb
          className="
            block
            h-5
            w-5
            rounded-full
            border-4
            border-emerald-600
            bg-white
            shadow-lg
            outline-none
            transition
            hover:scale-110
            focus:ring-4
            focus:ring-emerald-200
          "
        />
      </Slider.Root>

      <div className="flex justify-between text-xs text-gray-400">
        <span>₹{min}</span>

        <span>₹{max}</span>
      </div>
    </div>
  );
}
