import { describe, expect, it, vi } from "vitest";
import axios from "@/utils/axiosConfig";
import { getSocialMediaContent } from "@/features/(dashboard)/Social/services/socialMediaService";

describe("getSocialMediaContent", () => {
  it("acepta respuesta sin wrapper data (statusCode/result)", async () => {
    axios.defaults.adapter = async (config: any) => {
      return {
        data: {
          statusCode: 200,
          result: {
            contentPieces: [
              {
                _id: "69b44572f748b259065d69f3",
                weeklyStrategy: "69b44567f748b259065d69cf",
                platform: "tiktok",
                day: "monday",
                dayTime: "morning",
                publishDate: "2026-03-17T17:12:01.239Z",
                status: "draft",
                strategy: {
                  intention: "authority",
                  narrative: "storytelling",
                  sceneStrategyId: "s1_v1",
                  tensionLevel: "high",
                  ctaType: "comment",
                  hookFunction: "contrarian",
                },
                narrativeDetails: {
                  message: "m",
                  proofType: "p",
                },
                blueprint: { scenes: [], sound: "" },
                script: [["a"]],
              },
            ],
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const res = await getSocialMediaContent({ startDate: "2026-03-17", endDate: "2026-03-17" });
    expect(res.contentPieces.length).toBe(1);
    expect(res.contentPieces[0].id).toBe("69b44572f748b259065d69f3");
  });

  it("acepta respuesta con wrapper data.data", async () => {
    axios.defaults.adapter = async (config: any) => {
      return {
        data: {
          data: {
            statusCode: 200,
            result: {
              contentPieces: [
                {
                  _id: "1",
                  weeklyStrategy: "w",
                  platform: "tiktok",
                  day: "monday",
                  dayTime: "morning",
                  publishDate: "2026-03-17T00:00:00.000Z",
                  status: "draft",
                  strategy: {
                    intention: "authority",
                    narrative: "storytelling",
                    sceneStrategyId: "s1_v1",
                    tensionLevel: "high",
                    ctaType: "comment",
                    hookFunction: "contrarian",
                  },
                  narrativeDetails: {
                    message: "m",
                    proofType: "p",
                  },
                  blueprint: { scenes: [], sound: "" },
                  script: [["a"]],
                },
              ],
            },
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const res = await getSocialMediaContent({ startDate: "2026-03-17", endDate: "2026-03-17" });
    expect(res.contentPieces.length).toBe(1);
    expect(res.contentPieces[0].id).toBe("1");
  });
});
