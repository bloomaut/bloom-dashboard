import { describe, expect, it } from "vitest";
import { buildBusinessDashboardModel } from "@/features/(dashboard)/Home/components/BusinessDashboard/model";

describe("buildBusinessDashboardModel", () => {
  it("omite campos vacíos y arma basicFields solo con datos reales", () => {
    const model = buildBusinessDashboardModel({
      name: "  Mi negocio  ",
      category: "",
      description: null,
      address: "Calle 123",
      company_web: "https://example.com",
      palette: null,
      proposal_url: "",
    });

    expect(model.basicFields.map(f => f.key)).toEqual(["fields.business_name", "fields.address", "fields.website"]);
    expect(model.basicFields.find(f => f.key === "fields.business_name")?.value).toBe("Mi negocio");
    expect(model.branding.hasData).toBe(false);
    expect(model.proposalUrl).toBeNull();
  });

  it("activa branding si hay logo o palette", () => {
    const model = buildBusinessDashboardModel({
      logo: "https://img/logo.png",
      palette: "#fff, #000",
    });
    expect(model.branding.hasData).toBe(true);
    expect(model.branding.logo).toBe("https://img/logo.png");
    expect(model.branding.paletteArray.length).toBe(2);
  });
});
