export async function catchError<T>(promise: Promise<any>): Promise<T> {
  try {
    const response = await promise;
    // Axios wraps response in { data, status, ... }
    if (response && typeof response === "object" && "data" in response) {
      return response.data as T;
    }
    return response as T;
  } catch (error: any) {
    if (error && error.response && error.response.data) {
      const errorData = error.response.data;
      const message =
        typeof errorData === "string"
          ? errorData
          : errorData.message || errorData.detail || error.message;
      throw new Error(message);
    }
    throw error;
  }
}
