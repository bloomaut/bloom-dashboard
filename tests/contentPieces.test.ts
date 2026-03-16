import { describe, expect, it } from "vitest";
import { mapRawContentPieceToContentPiece } from "@/features/(dashboard)/Social/utils/contentPieces";
import {
  CameraType,
  ContentIntention,
  ContentNarrative,
  ContentStatus,
  CtaType,
  DayOfWeek,
  DayTime,
  OverlayType,
  Platform,
  ShotType,
  TensionLevel,
} from "@/features/(dashboard)/Social/types";

describe("mapRawContentPieceToContentPiece", () => {
  it("mapea el formato nuevo a IContentPiece", () => {
    const raw = {
      _id: "69b44572f748b259065d69f3",
      weeklyStrategy: "69b44567f748b259065d69cf",
      day: "monday",
      dayTime: "morning",
      publishDate: "2026-03-17T17:12:01.239Z",
      status: "draft",
      platform: "tiktok",
      strategy: {
        intention: "authority",
        narrative: "storytelling",
        sceneStrategyId: "s1_v1",
        tensionLevel: "high",
        ctaType: "comment",
        hookFunction: "contrarian",
      },
      narrativeDetails: {
        message: "msg",
        proofType: "proof",
      },
      blueprint: {
        scenes: [
          {
            camera: "selfie",
            shot: "short_plane",
            action: "A",
            instruction: "I",
            overlays: [{ type: "subtitles", value: "auto" }],
          },
        ],
        sound: "s",
      },
      script: [["L1", "L2"]],
      caption: "cap",
    };

    const mapped = mapRawContentPieceToContentPiece(raw);
    expect(mapped).not.toBeNull();
    expect(mapped).toEqual({
      id: "69b44572f748b259065d69f3",
      weekStrategyId: "69b44567f748b259065d69cf",
      platform: Platform.TIKTOK,
      day: DayOfWeek.MONDAY,
      dayTime: DayTime.MORNING,
      publishDate: { date: "2026-03-17T17:12:01.239Z" },
      status: ContentStatus.DRAFT,
      strategy: {
        intention: ContentIntention.AUTHORITY,
        narrative: ContentNarrative.STORYTELLING,
        sceneStrategyId: "s1_v1",
        tensionLevel: TensionLevel.HIGH,
        ctaType: CtaType.COMMENT,
        hookFunction: "contrarian",
      },
      narrativeDetails: { message: "msg", proofType: "proof" },
      blueprint: {
        scenes: [
          {
            camera: CameraType.SELFIE,
            shot: ShotType.SHORT_PLANE,
            action: "A",
            instruction: "I",
            overlays: [{ type: OverlayType.SUBTITLES, value: "auto" }],
          },
        ],
        sound: "s",
      },
      script: [["L1", "L2"]],
      caption: "cap",
    });
  });
});
