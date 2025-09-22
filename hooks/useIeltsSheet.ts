import { useEffect, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { createFormData } from "./useCreateSheet";

type mode = "view" | "edit" | "create";

export default function useIeltsSheet(
  // type?: ieltsAnswerSheet["type"] = "exercise",
  mode: mode = "create",
  setValue?: UseFormSetValue<createFormData>,
) {
  const [selectedMarkers, setSelectedMarkers] = useState<{
    [key: number]: string | null;
  }>({});
  const [numberInputs, setNumberInputs] = useState<{ [key: string]: string }>(
    {}
  );

  const handleMarkerChange = (questionNum: number, value: string) => {
    setSelectedMarkers((prev) => ({
      ...prev,
      [questionNum]: prev[questionNum] === value ? null : value,
    }));
    setValue && setValue(`answers.${questionNum - 1}.isCorrect`, value === "correct");
  };

  const handleNumberKeyDown =
    (fieldId: string) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;

      // Allow backspace, delete, tab, escape, enter, and left/right arrows
      // Note: ArrowUp and ArrowDown are handled globally for navigation
      if (
        [
          "Backspace",
          "Delete",
          "Tab",
          "Escape",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
        ].includes(key)
      ) {
        return;
      }

      // If it's a number, replace the current value
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        setNumberInputs((prev) => ({
          ...prev,
          [fieldId]: key,
        }));
      } else {
        // Block all other keys
        e.preventDefault();
      }
    };

  const calculateListeningTotal = () => {
    const allQuestionsAnswered = Array.from(
      { length: 40 },
      (_, i) => i + 1
    ).every(
      (questionNum) =>
        selectedMarkers[questionNum] === "correct" ||
        selectedMarkers[questionNum] === "incorrect"
    );

    if (!allQuestionsAnswered) {
      return "";
    }

    const correctCount = Object.entries(selectedMarkers).filter(
      ([_, value]) => value === "correct"
    ).length;

    return correctCount.toString().padStart(2, "0");
  };

  const pointTotal = calculateListeningTotal();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const focusableElements = document.querySelectorAll(
          'input:not([tabindex="-1"]):not([readonly]), button, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const currentIndex = Array.from(focusableElements).indexOf(
          document.activeElement as HTMLElement
        );
        if (currentIndex > 0) {
          focusableElements[currentIndex - 1].focus();
        } else if (currentIndex === 0) {
          focusableElements[focusableElements.length - 1].focus();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const focusableElements = document.querySelectorAll(
          'input:not([tabindex="-1"]):not([readonly]), button, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const currentIndex = Array.from(focusableElements).indexOf(
          document.activeElement as HTMLElement
        );
        if (currentIndex < focusableElements.length - 1) {
          focusableElements[currentIndex + 1].focus();
        } else if (currentIndex === focusableElements.length - 1) {
          focusableElements[0].focus();
        }
      }
      // Left and Right arrows now behave normally (no preventDefault, no custom handling)
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (mode === "create") {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
      const year = String(today.getFullYear());
      setNumberInputs((prev) => ({
        ...prev,
        ["day-0"]: day[0],
        ["day-1"]: day[1],
        ["month-0"]: month[0],
        ["month-1"]: month[1],
        ["year-0"]: year[0],
        ["year-1"]: year[1],
        ["year-2"]: year[2],
        ["year-3"]: year[3],
      }));
    }
  }, []);

  return {
    numberInputs,
    handleNumberKeyDown,
    selectedMarkers,
    handleMarkerChange,
    pointTotal,
  };
}
