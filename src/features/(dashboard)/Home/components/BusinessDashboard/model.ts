import { parsePaletteString } from "@/typescript/interfaces/business.interface";

function normalizeString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

function getClientString(clientData: unknown, key: string) {
  return normalizeString((clientData as any)?.[key]);
}

export function buildBusinessDashboardModel(clientData: unknown) {
  const businessName = getClientString(clientData, "name");
  const category = getClientString(clientData, "category");
  const description = getClientString(clientData, "description");
  const address = getClientString(clientData, "address");
  const companyWeb = getClientString(clientData, "company_web");
  const logo = getClientString(clientData, "logo");
  const proposalUrl = getClientString(clientData, "proposal_url");
  const paletteArray = parsePaletteString(getClientString(clientData, "palette"));

  const basicFields = [
    { key: "fields.business_name", value: businessName, href: null },
    { key: "fields.category", value: category, href: null },
    { key: "fields.description", value: description, href: null },
    { key: "fields.address", value: address, href: null },
    { key: "fields.website", value: companyWeb, href: companyWeb },
  ].filter(f => Boolean(f.value));

  return {
    basicFields,
    branding: {
      logo,
      paletteArray,
      hasData: Boolean(logo) || (paletteArray && paletteArray.length > 0),
    },
    proposalUrl,
  };
}
