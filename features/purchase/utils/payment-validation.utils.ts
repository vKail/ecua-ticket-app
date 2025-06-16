/**
 * Utilitarios para manejo de validación de pagos
 */

/**
 * Verifica si un error indica que el pago ya fue validado previamente
 * @param error - El error de la respuesta de la API
 * @returns true si el error indica que el pago ya fue validado
 */
export function isPaymentAlreadyValidatedError(error: any): boolean {
  if (!error) return false;

  // Intentar obtener el mensaje de error de diferentes ubicaciones posibles
  const errorMessage =
    error?.response?.data?.message?.content?.[0] ||
    error?.response?.data?.message ||
    error?.message ||
    (typeof error === "string" ? error : "");

  if (typeof errorMessage !== "string") return false;

  // Lista de mensajes que indican que el pago ya fue validado
  const alreadyValidatedMessages = [
    "ya ha sido validado",
    "already validated",
    "payment already validated",
    "pago ya validado",
    "ya validado",
    "previously validated",
    "validation already completed",
    // El mensaje específico de PayPal que indica error después de validación exitosa
    "error al verificar el pago de paypal",
  ];

  const lowerMessage = errorMessage.toLowerCase();

  const isAlreadyValidated = alreadyValidatedMessages.some((msg) =>
    lowerMessage.includes(msg.toLowerCase())
  );

  // Log para debugging
  if (isAlreadyValidated) {
    console.log("🔍 Detected payment already validated error:", {
      originalMessage: errorMessage,
      matchedPattern: alreadyValidatedMessages.find((msg) =>
        lowerMessage.includes(msg.toLowerCase())
      ),
    });
  }

  return isAlreadyValidated;
}

/**
 * Verifica si una respuesta de validación indica éxito
 * @param response - La respuesta de la API de validación
 * @returns true si la validación fue exitosa
 */
export function isValidationSuccessful(response: any): boolean {
  return response?.success === true;
}

/**
 * Extrae información relevante de un error para logging
 * @param error - El error a procesar
 * @returns Objeto con información del error
 */
export function extractErrorInfo(error: any) {
  return {
    message:
      error?.response?.data?.message?.content?.[0] ||
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error",
    status: error?.response?.status,
    isAlreadyValidated: isPaymentAlreadyValidatedError(error),
    timestamp: new Date().toISOString(),
  };
}
