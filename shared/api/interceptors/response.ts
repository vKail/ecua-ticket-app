import { toast } from "sonner";
import type { AxiosResponse, AxiosError } from "axios";

type ErrorResponse = {
  message: {
    displayable: boolean;
    content: string[];
  };
};

export function responseInterceptor(response: AxiosResponse) {
  return response;
}
export function responseErrorInterceptor(error: AxiosError<ErrorResponse>) {
  const message = error.response?.data?.message;
  const status = error.response?.status;

  if (message?.displayable && Array.isArray(message.content)) {
    const description = message.content.join("\n");
    toast.error("Error al realizar la solicitud", { description });

    const customError = new Error(description);
    customError.name = "APIError";
    (customError as AxiosError).status = status;
    (customError as AxiosError).response = error.response;
    return Promise.reject(customError);
  }

  if (message && Array.isArray(message.content) && !message.displayable) {
    const description = message.content.join("\n");

    const customError = new Error(description);
    customError.name = status === 404 ? "NotFoundError" : "APIError";
    (customError as AxiosError).status = status;
    (customError as AxiosError).response = error.response;
    return Promise.reject(customError);
  }

  if (Array.isArray(message?.content)) {
    toast.error("Error al realizar la solicitud", {
      description: message.content.join("\n"),
    });
  } else {
    toast.error(
      typeof message === "string" ? message : "Error al realizar la solicitud"
    );
  }

  return Promise.reject(error);
}
