import {
  CameraType,
  ContentBlueprint,
  ContentIntention,
  ContentNarrative,
  ContentStatus,
  CtaType,
  DayOfWeek,
  DayTime,
  IContentPiece,
  OverlayType,
  Platform,
  ShotType,
  TensionLevel,
} from "../types";

type RawContentPiece = {
  _id?: unknown;
  weeklyStrategy?: unknown;
  weekStrategyId?: unknown;
  platform?: unknown;
  title?: unknown;
  day?: unknown;
  dayTime?: unknown;
  publishDate?: unknown;
  status?: unknown;
  strategy?: unknown;
  narrativeDetails?: unknown;
  blueprint?: unknown;
  script?: unknown;
  caption?: unknown;
};

type LegacyContentItem = {
  _id?: unknown;
  socialMedia?: unknown;
  day?: unknown;
  dayTime?: unknown;
  status?: unknown;
  completed?: unknown;
  pillar?: unknown;
  content?: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function asString(v: unknown) {
  return typeof v === "string" ? v : null;
}

function asStringArray2D(v: unknown) {
  if (!Array.isArray(v)) return null;
  const out: string[][] = [];
  for (const row of v) {
    if (!Array.isArray(row)) return null;
    const line: string[] = [];
    for (const cell of row) {
      if (typeof cell !== "string") return null;
      line.push(cell);
    }
    out.push(line);
  }
  return out;
}

function isEnumValue<T extends Record<string, string>>(enm: T, v: unknown): v is T[keyof T] {
  return typeof v === "string" && Object.values(enm).includes(v);
}

function dayOfWeekFromIsoDate(dateIso: string): DayOfWeek | null {
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return null;
  const day = d.getDay();
  switch (day) {
    case 0:
      return DayOfWeek.SUNDAY;
    case 1:
      return DayOfWeek.MONDAY;
    case 2:
      return DayOfWeek.TUESDAY;
    case 3:
      return DayOfWeek.WEDNESDAY;
    case 4:
      return DayOfWeek.THURSDAY;
    case 5:
      return DayOfWeek.FRIDAY;
    case 6:
      return DayOfWeek.SATURDAY;
    default:
      return null;
  }
}

function mapStrategy(v: unknown) {
  const r = isRecord(v) ? v : {};
  return {
    intention: (isEnumValue(ContentIntention, r.intention)
      ? r.intention
      : ContentIntention.AUTHORITY) as ContentIntention,
    narrative: (isEnumValue(ContentNarrative, r.narrative)
      ? r.narrative
      : ContentNarrative.STORYTELLING) as ContentNarrative,
    sceneStrategyId: asString(r.sceneStrategyId) ?? "",
    tensionLevel: (isEnumValue(TensionLevel, r.tensionLevel) ? r.tensionLevel : TensionLevel.MEDIUM) as TensionLevel,
    ctaType: (isEnumValue(CtaType, r.ctaType) ? r.ctaType : CtaType.COMMENT) as CtaType,
    hookFunction: asString(r.hookFunction) ?? "",
  };
}

function mapNarrativeDetails(v: unknown) {
  const r = isRecord(v) ? v : {};
  return {
    message: asString(r.message) ?? "",
    proofType: asString(r.proofType) ?? "",
  };
}

function mapBlueprint(v: unknown): ContentBlueprint {
  const r = isRecord(v) ? v : {};
  const scenesRaw = Array.isArray(r.scenes) ? r.scenes : [];
  const scenes = scenesRaw
    .map(s => {
      const sr = isRecord(s) ? s : {};
      const overlaysRaw = Array.isArray(sr.overlays) ? sr.overlays : [];
      const overlays = overlaysRaw
        .map(o => {
          const or = isRecord(o) ? o : {};
          return {
            type: (isEnumValue(OverlayType, or.type) ? or.type : OverlayType.SUBTITLES) as OverlayType,
            value: asString(or.value) ?? "",
          };
        })
        .filter(o => o.value.length > 0);

      return {
        camera: (isEnumValue(CameraType, sr.camera) ? sr.camera : CameraType.SELFIE) as CameraType,
        shot: (isEnumValue(ShotType, sr.shot) ? sr.shot : ShotType.SHORT_PLANE) as ShotType,
        action: asString(sr.action) ?? "",
        instruction: asString(sr.instruction) ?? "",
        overlays,
      };
    })
    .filter(s => s.action.length > 0 || s.instruction.length > 0);

  return {
    scenes,
    sound: asString(r.sound) ?? "",
  };
}

export function mapRawContentPieceToContentPiece(raw: unknown): IContentPiece | null {
  const r = raw as RawContentPiece;
  const id = asString(r._id) ?? asString((raw as any)?.id);
  const weekStrategyId = asString(r.weeklyStrategy) ?? asString(r.weekStrategyId) ?? "";
  const publishDateValue = asString(r.publishDate) ?? asString((r.publishDate as any)?.date) ?? null;
  const day = isEnumValue(DayOfWeek, r.day)
    ? (r.day as DayOfWeek)
    : publishDateValue
      ? dayOfWeekFromIsoDate(publishDateValue)
      : null;
  const dayTime = isEnumValue(DayTime, r.dayTime) ? (r.dayTime as DayTime) : null;
  const status = isEnumValue(ContentStatus, r.status) ? (r.status as ContentStatus) : ContentStatus.DRAFT;
  const platform = isEnumValue(Platform, r.platform) ? (r.platform as Platform) : Platform.TIKTOK;
  const narrativeTitle =
    asString((r.narrativeDetails as any)?.title) ?? asString(((raw as any)?.narrativeDetails as any)?.title);
  const title = asString(r.title) ?? asString((raw as any)?.title) ?? narrativeTitle ?? null;

  const script = asStringArray2D(r.script) ?? [];

  if (!id || !day || !dayTime || !publishDateValue) return null;

  return {
    id,
    weekStrategyId,
    platform,
    title,
    day,
    dayTime,
    publishDate: { date: publishDateValue },
    status,
    strategy: mapStrategy(r.strategy),
    narrativeDetails: mapNarrativeDetails(r.narrativeDetails),
    blueprint: mapBlueprint(r.blueprint),
    script,
    caption: asString(r.caption) ?? undefined,
  };
}

export function mapLegacyContentItemToContentPiece(raw: unknown): IContentPiece | null {
  const r = raw as LegacyContentItem;
  const id = asString(r._id);
  const dayIso = asString(r.day);
  const day = dayIso ? dayOfWeekFromIsoDate(dayIso) : null;
  const dayTime = isEnumValue(DayTime, r.dayTime) ? (r.dayTime as DayTime) : null;
  const status = isEnumValue(ContentStatus, r.status)
    ? (r.status as ContentStatus)
    : r.completed === true
      ? ContentStatus.READY
      : ContentStatus.DRAFT;
  const platform = isEnumValue(Platform, r.socialMedia) ? (r.socialMedia as Platform) : Platform.TIKTOK;

  if (!id || !dayIso || !day || !dayTime) return null;

  const content = isRecord(r.content) ? r.content : {};
  const title = asString(content.title) ?? null;
  const caption = asString(content.copy) ?? asString(content.cta_copy) ?? undefined;

  return {
    id,
    weekStrategyId: "",
    platform,
    title,
    day,
    dayTime,
    publishDate: { date: dayIso },
    status,
    strategy: {
      intention: ContentIntention.AUTHORITY,
      narrative: ContentNarrative.STORYTELLING,
      sceneStrategyId: "",
      tensionLevel: TensionLevel.MEDIUM,
      ctaType: CtaType.COMMENT,
      hookFunction: "",
    },
    narrativeDetails: {
      message: asString(content.hook) ?? asString(content.body) ?? "",
      proofType: "",
    },
    blueprint: { scenes: [], sound: "" },
    script: [[asString(content.script) ?? ""]],
    caption,
  };
}
