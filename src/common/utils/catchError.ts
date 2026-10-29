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
      let message = error.message;

      if (typeof errorData === "string") {
        message = errorData;
      } else if (typeof errorData.detail === "string") {
        message = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        // Array validation errors (422)
        const fieldErrors = errorData.detail
          .map((d: any) => {
            const loc = Array.isArray(d.loc)
              ? d.loc.filter((l: any) => l !== "body").join(".")
              : "";
            return loc ? `${loc}: ${d.msg}` : d.msg;
          })
          .filter(Boolean)
          .join(", ");
        message = fieldErrors || errorData.message || "Validation Error";
      } else if (errorData.detail && typeof errorData.detail === "object") {
        if (typeof errorData.detail.message === "string") {
          message = errorData.detail.message;
        } else {
          message = errorData.message || error.message;
        }
      } else if (typeof errorData.message === "string") {
        message = errorData.message;
      }

      const err = new Error(message);
      (err as any).response = error.response;
      throw err;
    }
    throw error;
  }
}
