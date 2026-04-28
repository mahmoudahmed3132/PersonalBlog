"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

const edgePadding = 16;
const petWidth = 42;
const petHeight = 30;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ScreenDog() {
  const runnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runner = runnerRef.current;

    if (!runner) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrame = 0;
    let facing: 1 | -1 = 1;
    let position: Point = {
      x: clamp(window.innerWidth - 92, edgePadding, window.innerWidth - petWidth - edgePadding),
      y: clamp(window.innerHeight - 86, 78, window.innerHeight - petHeight - edgePadding),
    };
    let target: Point = { ...position };

    const bounds = () => ({
      minX: edgePadding,
      maxX: Math.max(edgePadding, window.innerWidth - petWidth - edgePadding),
      minY: 72,
      maxY: Math.max(72, window.innerHeight - petHeight - edgePadding),
    });

    const placeRunner = () => {
      runner.style.transform = `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, 0) scaleX(${facing})`;
    };

    const setTarget = (event: MouseEvent | PointerEvent) => {
      const { minX, maxX, minY, maxY } = bounds();

      target = {
        x: clamp(event.clientX - petWidth / 2, minX, maxX),
        y: clamp(event.clientY + 18, minY, maxY),
      };
      runner.dataset.state = "run";
    };

    const keepInBounds = () => {
      const { minX, maxX, minY, maxY } = bounds();

      position = {
        x: clamp(position.x, minX, maxX),
        y: clamp(position.y, minY, maxY),
      };
      target = {
        x: clamp(target.x, minX, maxX),
        y: clamp(target.y, minY, maxY),
      };
      placeRunner();
    };

    const move = () => {
      const dx = target.x - position.x;
      const dy = target.y - position.y;
      const distance = Math.hypot(dx, dy);
      const ease = prefersReducedMotion ? 0.032 : 0.045;

      if (distance > 0.8) {
        position = {
          x: position.x + dx * ease,
          y: position.y + dy * ease,
        };
      } else {
        runner.dataset.state = "rest";
      }

      if (Math.abs(dx) > 0.5) {
        facing = dx > 0 ? 1 : -1;
      }

      placeRunner();
      animationFrame = window.requestAnimationFrame(move);
    };

    runner.dataset.state = "rest";
    placeRunner();
    animationFrame = window.requestAnimationFrame(move);

    window.addEventListener("pointermove", setTarget, { passive: true });
    window.addEventListener("pointerdown", setTarget, { passive: true });
    window.addEventListener("mousemove", setTarget, { passive: true });
    window.addEventListener("mousedown", setTarget, { passive: true });
    window.addEventListener("resize", keepInBounds);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", setTarget);
      window.removeEventListener("pointerdown", setTarget);
      window.removeEventListener("mousemove", setTarget);
      window.removeEventListener("mousedown", setTarget);
      window.removeEventListener("resize", keepInBounds);
      runner.removeAttribute("data-state");
      runner.style.removeProperty("transform");
    };
  }, []);

  return (
    <div className="screen-pet-layer" aria-hidden="true">
      <div ref={runnerRef} className="screen-pet-runner">
        <Image
          src="/screen-dog.svg"
          alt=""
          width={64}
          height={44}
          className="screen-pet"
          priority
        />
      </div>
    </div>
  );
}
