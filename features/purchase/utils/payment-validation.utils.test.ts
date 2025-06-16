// Test simple para las utilidades de validación de pagos
// Este archivo puede ser ejecutado con Node.js para verificar el funcionamiento

import {
  isPaymentAlreadyValidatedError,
  isValidationSuccessful,
  extractErrorInfo,
} from "./payment-validation.utils";

// Test cases
const testCases = [
  {
    name: "Error típico de PayPal - pago ya validado",
    error: {
      response: {
        data: {
          message: {
            content: ["Error al verificar el pago de PayPal"],
          },
        },
      },
    },
    expectedAlreadyValidated: false, // Este mensaje no indica que ya fue validado
  },
  {
    name: "Error que indica pago ya validado",
    error: {
      response: {
        data: {
          message: "El pago ya ha sido validado anteriormente",
        },
      },
    },
    expectedAlreadyValidated: true,
  },
  {
    name: "Respuesta exitosa",
    response: {
      success: true,
      message: "Pago validado exitosamente",
    },
    expectedSuccessful: true,
  },
  {
    name: "Respuesta fallida",
    response: {
      success: false,
      message: "El pago aún no ha sido confirmado",
    },
    expectedSuccessful: false,
  },
];

console.log("🧪 Testing payment validation utilities...\n");

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);

  if (testCase.error) {
    const isAlreadyValidated = isPaymentAlreadyValidatedError(testCase.error);
    const errorInfo = extractErrorInfo(testCase.error);

    console.log(
      `  - Already validated: ${isAlreadyValidated} (expected: ${testCase.expectedAlreadyValidated})`
    );
    console.log(`  - Error info:`, errorInfo);
    console.log(
      `  - ✅ ${
        isAlreadyValidated === testCase.expectedAlreadyValidated
          ? "PASS"
          : "FAIL"
      }`
    );
  }

  if (testCase.response) {
    const isSuccessful = isValidationSuccessful(testCase.response);

    console.log(
      `  - Is successful: ${isSuccessful} (expected: ${testCase.expectedSuccessful})`
    );
    console.log(
      `  - ✅ ${isSuccessful === testCase.expectedSuccessful ? "PASS" : "FAIL"}`
    );
  }

  console.log("");
});

export {};
