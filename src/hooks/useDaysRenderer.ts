import { useMemo } from "react";

interface DayData {
  day: string;
  from: string | null;
  to: string | null;
}

interface UseDaysRendererProps {
  mondayFrom: string | null;
  mondayTo: string | null;
  tuesdayFrom: string | null;
  tuesdayTo: string | null;
  wednesdayFrom: string | null;
  wednesdayTo: string | null;
  thursdayFrom: string | null;
  thursdayTo: string | null;
  fridayFrom: string | null;
  fridayTo: string | null;
  saturdayFrom: string | null;
  saturdayTo: string | null;
  sundayFrom: string | null;
  sundayTo: string | null;
}

export const useDaysRenderer = ({
  mondayFrom,
  mondayTo,
  tuesdayFrom,
  tuesdayTo,
  wednesdayFrom,
  wednesdayTo,
  thursdayFrom,
  thursdayTo,
  fridayFrom,
  fridayTo,
  saturdayFrom,
  saturdayTo,
  sundayFrom,
  sundayTo,
}: UseDaysRendererProps) => {
  return useMemo(() => {
    const days: DayData[] = [
      { day: "L", from: mondayFrom, to: mondayTo },
      { day: "M", from: tuesdayFrom, to: tuesdayTo },
      { day: "X", from: wednesdayFrom, to: wednesdayTo },
      { day: "J", from: thursdayFrom, to: thursdayTo },
      { day: "V", from: fridayFrom, to: fridayTo },
      { day: "S", from: saturdayFrom, to: saturdayTo },
      { day: "D", from: sundayFrom, to: sundayTo },
    ];

    return days;
  }, [
    mondayFrom,
    mondayTo,
    tuesdayFrom,
    tuesdayTo,
    wednesdayFrom,
    wednesdayTo,
    thursdayFrom,
    thursdayTo,
    fridayFrom,
    fridayTo,
    saturdayFrom,
    saturdayTo,
    sundayFrom,
    sundayTo,
  ]);
};
