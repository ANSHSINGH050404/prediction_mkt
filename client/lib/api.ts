export const API_BASE_URL = "http://localhost:5000/api";

export const login = async (email: string, password: string) => {

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();

};