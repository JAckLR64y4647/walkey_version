import { Filters, UpdateLocationParams } from "../types/type";

const SERVER_URL = "https://799d-93-200-239-96.ngrok-free.app";

export const createUser = async (userData: any) => {
  const response = await fetch(`${SERVER_URL}/api/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Неизвестная ошибка");
  }

  return await response.json();
};


export const updateLocation = async ({ latitude, longitude, clerkId }: UpdateLocationParams): Promise<void> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${SERVER_URL}/api/user/location`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId, latitude, longitude }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Ошибка обновления локации:", errorData);
      throw new Error(errorData.error || "Ошибка сервера");
    }

    console.log("Локация успешно обновлена!");
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.error("Запрос был прерван из-за тайм-аута.");
    } else {
      console.error("Ошибка обновления локации:", error);
    }
  }
};

export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = 5000
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const fetchOtherUsersLocations = async (clerkId: string, filters: Filters = {}): Promise<any[]> => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithTimeout(
      `${SERVER_URL}/api/users/locations?clerkId=${clerkId}&${queryParams}`,
      {}
    );

    if (!response.ok) {
      throw new Error("Ошибка получения данных пользователей");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Ошибка получения данных других пользователей:", error.message || error);
    return [];
  }
};