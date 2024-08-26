import { useTranslations } from "next-intl";
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
  const dict = useTranslations("dict.catalog");

  return useMemo(() => {
    const days: DayData[] = [
      { day: dict("days_letter.monday"), from: mondayFrom, to: mondayTo },
      { day: dict("days_letter.tuesday"), from: tuesdayFrom, to: tuesdayTo },
      { day: dict("days_letter.wednesday"), from: wednesdayFrom, to: wednesdayTo },
      { day: dict("days_letter.thursday"), from: thursdayFrom, to: thursdayTo },
      { day: dict("days_letter.friday"), from: fridayFrom, to: fridayTo },
      { day: dict("days_letter.saturday"), from: saturdayFrom, to: saturdayTo },
      { day: dict("days_letter.sunday"), from: sundayFrom, to: sundayTo },
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
    dict,
  ]);
};
