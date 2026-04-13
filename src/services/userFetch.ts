import axios from "@/utils/axiosConfig";

type ListParams = {
  page?: number;
  limit?: number;
  wish_list?: boolean | "true" | "false";
  proposal_url?: "null" | "notnull";
  proposal_status?: "pending" | "approved" | "rejected";
  [key: string]: unknown;
};

async function request(url: string) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err: any) {
    // normalize error message similar to previous behavior
    const message = err?.response
      ? `${err.response.status} ${err.response.statusText}`
      : err?.message ?? "Network Error";
    throw new Error(message);
  }
}

function buildUrl(params: ListParams) {
  const base = "/api/back-office/list";
  const q: string[] = [];
  if (params.page !== null) q.push(`page=${encodeURIComponent(String(params.page))}`);
  if (params.limit !== null) q.push(`limit=${encodeURIComponent(String(params.limit))}`);
  if (params.wish_list !== undefined) q.push(`wish_list=${encodeURIComponent(String(params.wish_list))}`);
  if (params.proposal_url !== undefined) q.push(`proposal_url=${encodeURIComponent(String(params.proposal_url))}`);
  if (params.proposal_status !== undefined)
    q.push(`proposal_status=${encodeURIComponent(String(params.proposal_status))}`);

  Object.keys(params).forEach(k => {
    if (["page", "limit", "wish_list", "proposal_url", "proposal_status"].includes(k)) return;
    const v = params[k];
    if (v !== null) q.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  });
  return q.length ? `${base}?${q.join("&")}` : base;
}

export async function listUsers(params: ListParams = {}) {
  const url = buildUrl(params);
  return request(url);
}

export const getAllUsers = (page = 1, limit = 10) => listUsers({ page, limit });

export const getWishListUsers = (page = 1, limit = 10) => listUsers({ page, limit, wish_list: true });

export const getInProgressUsers = (page = 1, limit = 10) =>
  listUsers({ page, limit, wish_list: false, proposal_url: "null" });

export const getProposalPendingUsers = (page = 1, limit = 10) =>
  listUsers({ page, limit, proposal_url: "notnull", proposal_status: "pending" });

export const getProposalApprovedUsers = (page = 1, limit = 10) =>
  listUsers({ page, limit, proposal_url: "notnull", proposal_status: "approved" });

export const getProposalRejectedUsers = (page = 1, limit = 10) =>
  listUsers({ page, limit, proposal_url: "notnull", proposal_status: "rejected" });

export async function getUsersStats() {
  const url = "/api/back-office/users";
  return request(url);
}

export async function removeFromWishlist(userId: string) {
  const url = `/api/pipeline/wishlist/${userId}`;
  try {
    const res = await axios.put(url, { wish_list: false });
    return res.data;
  } catch (err: any) {
    const message = err?.response
      ? `${err.response.status} ${err.response.statusText}`
      : err?.message ?? "Network Error";
    throw new Error(message);
  }
}

export default {
  listUsers,
  getAllUsers,
  getWishListUsers,
  getInProgressUsers,
  getProposalPendingUsers,
  getProposalApprovedUsers,
  getProposalRejectedUsers,
  getUsersStats,
  removeFromWishlist,
};
