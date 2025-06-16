# Implementación del Checkout - EcuaTicket

## Flujo de Checkout Implementado

### 1. Estructura de Archivos Creados

```
features/purchase/
├── api/
│   └── checkout-api.ts          # API para procesar ventas online y validar pagos
├── components/
│   └── CheckoutForm.tsx         # Formulario de checkout con selección de método de pago
├── containers/
│   ├── CheckoutContainer.tsx    # Container principal del checkout
│   ├── PaymentSuccessContainer.tsx   # Página de éxito del pago
│   └── PaymentValidationContainer.tsx # Validación de pagos PayPal
├── hooks/
│   └── useCheckout.ts          # Hooks para procesar y validar pagos
├── types/
│   └── checkout.interface.ts   # Interfaces TypeScript para el checkout
└── consts/
    └── checkout-query-keys.ts  # Keys para React Query

app/dashboard/purchase/
├── checkout/
│   └── page.tsx               # Página del checkout
├── success/
│   └── page.tsx              # Página de éxito del pago
└── validate/
    └── page.tsx             # Página de validación de pago PayPal
```

### 2. Flujo de Usuario

#### Flujo Principal:

1. **Selección de Ruta** → **Selección de Asientos** → **Información de Pasajeros** → **Checkout** → **Pago** → **Confirmación**

#### Flujo de Checkout:

1. El usuario llega a `/dashboard/purchase/checkout` con los datos de ruta, asientos y pasajeros
2. Ve un resumen detallado de la compra con:
   - Detalles del viaje (origen, destino, fecha, empresa)
   - Lista de pasajeros y asientos asignados
   - Resumen de precios
   - Selección de método de pago (PayPal o Transferencia)

#### Métodos de Pago:

**PayPal:**

1. Usuario selecciona PayPal
2. Al hacer clic en "Pagar", se llama a la API `/api/v1/ticket-sales/online`
3. Se abre automáticamente la URL de PayPal en una nueva ventana
4. Después del pago, se redirige a `/dashboard/purchase/validate`
5. Se valida automáticamente el pago con `/api/v1/ticket-sales/payments/{paymentId}/validate`
6. Se redirige a la página de éxito

**Transferencia Bancaria:**

1. Usuario selecciona Transferencia
2. Al hacer clic en "Crear reserva", se llama a la API `/api/v1/ticket-sales/online`
3. Se valida inmediatamente el pago (para transferencias)
4. Se redirige a la página de éxito

### 3. APIs Utilizadas

#### POST /api/v1/ticket-sales/online

**Request:**

```json
{
  "paymentMethod": "PAYPAL" | "TRANSFER",
  "paypalTransactionId": "string",
  "bankReference": "string",
  "receiptUrl": "string",
  "tickets": [
    {
      "frecuencySegmentPriceId": 1,
      "date": "2025-06-16T06:08:18.899Z",
      "physicalSeatId": 1,
      "passengerType": "NORMAL",
      "passengerId": 1,
      "passsengerDni": "1234567890",
      "passengerName": "John",
      "passengerSurname": "Doe",
      "passengerEmail": "john.doe@example.com",
      "passengerBirthDate": "1990-01-01"
    }
  ]
}
```

**Response para PayPal:**

```json
{
  "success": true,
  "message": {
    "content": ["Successful operation"],
    "displayable": false
  },
  "data": {
    "success": true,
    "message": "PayPal order created successfully",
    "paymentId": 1,
    "paypalOrderId": "9JF67475Y47005116",
    "approvalUrl": "https://www.sandbox.paypal.com/checkoutnow?token=9JF67475Y47005116"
  }
}
```

**Response para Transferencia:**

```json
{
  "success": true,
  "message": {
    "content": ["Successful operation"],
    "displayable": false
  },
  "data": {
    "success": true,
    "message": "Venta procesada correctamente",
    "paymentId": 2,
    "tickets": [...]
  }
}
```

#### PATCH /api/v1/ticket-sales/payments/{paymentId}/validate

**Request:**

```json
{
  "paypalOrderId": "9JF67475Y47005116" // Opcional, solo para PayPal
}
```

### 4. Componentes Principales

#### CheckoutForm

- Muestra resumen completo de la compra
- Permite seleccionar método de pago
- Maneja el procesamiento del pago
- Usa colores del tema: `primary`, `secondary`, `complementary-gray`

#### PaymentValidationContainer

- Valida automáticamente pagos PayPal después del redirect
- Muestra estados de carga y error
- Redirige al éxito o muestra errores

#### PaymentSuccessContainer

- Página de confirmación exitosa
- Muestra ID de pago
- Opciones para ver historial o nueva compra

### 5. Correcciones Implementadas

#### Datos de Pasajeros:

- **Problema original:** Los datos de pasajeros llegaban incompletos
- **Solución:** Validación completa en `PassengerFormContainer` antes de proceder al checkout
- **Validación:** Todos los campos obligatorios deben estar llenos

#### Flujo de Datos:

1. **Selección de Asientos** → datos codificados en URL
2. **Información de Pasajeros** → validación + datos codificados en URL
3. **Checkout** → transformación a formato API + procesamiento

### 6. Transformadores de Datos

#### `transformCheckoutToApiRequest()`

Convierte los datos del frontend al formato requerido por la API:

- Mapea pasajeros a tickets
- Asigna IDs de asientos físicos
- Establece tipos de pasajero y fechas

### 7. Gestión de Estados

#### React Query:

- `useProcessOnlineSale()`: Procesa venta online
- `useValidatePayment()`: Valida pagos pendientes
- Estados de loading, error y success manejados automáticamente

### 8. Seguridad y Validación

- Validación completa de datos de pasajeros
- Manejo de errores de API
- Estados de carga para prevenir doble submit
- Redirecciones seguras entre páginas

### 9. UX/UI

#### Diseño Visual:

- Interfaz basada en los colores del tema de la aplicación
- Componentes consistentes con shadcn/ui
- Responsive design
- Estados de carga visual
- Iconos y feedback claro

#### Flujo de Usuario:

- Navegación intuitiva con botón "Volver"
- Resumen claro de la compra
- Instrucciones claras para cada método de pago
- Confirmación visual del éxito

## Uso

1. **Instalación:** Los archivos ya están creados y configurados
2. **Navegación:** Ir a `/dashboard/purchase` y seguir el flujo normal
3. **Testing:** Usar datos de prueba para PayPal sandbox o transferencias

## Próximos Pasos

1. Integrar con datos reales de `frecuencySegmentPriceId`
2. Implementar webhooks de PayPal para validación automática
3. Agregar notificaciones por email
4. Implementar manejo de errores más específicos
5. Agregar analytics de conversión
