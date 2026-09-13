import { apiClient } from "@/api/client";

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  mobile: string;
  role: string;
  is_active?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Flat {
  id: number;
  flat_number: string;
  resident_id: number;
}

export async function login(
  mobile: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    {
      mobile,
      password,
    }
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>(
    "/auth/me"
  );

  return response.data;
}

export async function getMyFlats(): Promise<Flat[]> {
  const response = await apiClient.get<Flat[]>(
    "/flats/my"
  );

  return response.data;
}