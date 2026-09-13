import { apiClient } from "./client";

export interface Visitor {
  id: number;
  flat_id: number;
  flat_number: string;
  visitor_name: string;
  visitor_mobile: string;
  purpose: string;
  status: string;

  approved_at?: string | null;
  checked_in_at?: string | null;
  checked_out_at?: string | null;
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

export type CreateVisitorRequest = {
  visitor_name: string;
  visitor_mobile: string;
  purpose: string;
  flat_id: number;
};

export async function createVisitor(
  data: CreateVisitorRequest
): Promise<Visitor> {
  const response = await apiClient.post<Visitor>(
    "/visitors",
    data
  );

  return response.data;
}

export type Flat = {
  id: number;
  flat_number: string;
  resident_id: number;
};

export async function getFlatsForVisitor(): Promise<Flat[]> {
  const response = await apiClient.get<Flat[]>(
    "/flats/for-visitor"
  );

  return response.data;
}

export async function checkInVisitor(
  visitorId: number
): Promise<Visitor> {
  const response = await apiClient.put<Visitor>(
    `/visitors/${visitorId}/check-in`
  );

  return response.data;
}

export async function checkOutVisitor(
  visitorId: number
): Promise<Visitor> {
  const response = await apiClient.put<Visitor>(
    `/visitors/${visitorId}/check-out`
  );

  return response.data;
}

export async function getSecurityVisitors(): Promise<Visitor[]> {
  const response = await apiClient.get<Visitor[]>(
    "/visitors/security"
  );

  return response.data;
}