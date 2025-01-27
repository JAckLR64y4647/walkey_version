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
