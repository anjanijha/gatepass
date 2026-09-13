import { apiClient } from "@/api/client";

export interface Visitor {
  id: number;
  flat_id: number;
  visitor_name: string;
  visitor_mobile: string;
  purpose: string;
  status: string;
}

export async function getVisitors(
  flatId: number
): Promise<Visitor[]> {
  const response = await apiClient.get<Visitor[]>(
    `/visitors/flat/${flatId}`
  );

  return response.data;
}

export async function approveVisitor(
  visitorId: number
): Promise<Visitor> {
  const response = await apiClient.put<Visitor>(
    `/visitors/${visitorId}/approve`
  );

  return response.data;
}

export async function declineVisitor(
  visitorId: number
): Promise<Visitor> {
  const response = await apiClient.put<Visitor>(
    `/visitors/${visitorId}/decline`
  );

  return response.data;
}