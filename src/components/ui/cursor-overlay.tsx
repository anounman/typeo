import React, { useEffect, useState } from "react";
import { UserCursor } from "@/hooks/useCursorTracking";
import Cursor from "./cursor";

interface CursorOverlayProps {
  cursors: UserCursor[];
}

export const CursorOverlay: React.FC<CursorOverlayProps> = ({ cursors }) => {
  const [cursorPositions, setCursorPositions] = useState<{
    [key: string]: { left: string; top: string };
  }>({});

  // Calculate cursor positions based on character spans
  useEffect(() => {
    const calculatePositions = () => {
      // Get all character spans from the parent component
      const charSpans = document.querySelectorAll("span[id]");
      if (!charSpans.length) return;

      const newPositions: { [key: string]: { left: string; top: string } } = {};

      // Calculate position for each cursor
      cursors.forEach((cursor) => {
        const position = Math.min(
          Math.floor(cursor.position),
          charSpans.length - 1
        );

        // If position is valid and we have a span for it
        if (position >= 0 && position < charSpans.length) {
          const targetSpan = charSpans[position];
          const rect = targetSpan.getBoundingClientRect();
          const parentRect =
            targetSpan.closest(".typing-container")?.getBoundingClientRect() ||
            document.body.getBoundingClientRect();

          // Calculate position relative to parent
          newPositions[cursor.id] = {
            left: `${rect.left - parentRect.left}px`,
            top: `${rect.top - parentRect.top}px`,
          };
        }
      });

      setCursorPositions(newPositions);
    };

    // Calculate initially and on window resize
    calculatePositions();
    window.addEventListener("resize", calculatePositions);

    // Use requestAnimationFrame for smoother updates
    let rafId: number;
    const updateLoop = () => {
      calculatePositions();
      rafId = requestAnimationFrame(updateLoop);
    };
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("resize", calculatePositions);
      cancelAnimationFrame(rafId);
    };
  }, [cursors]);

  return (
    <>
      {cursors.map((cursor) => {
        const position = cursorPositions[cursor.id];
        if (!position) return null;

        return <Cursor color={cursor.color} />;
      })}
    </>
  );
};
