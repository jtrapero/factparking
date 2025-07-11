"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define el esquema de validación para el formulario
const formSchema = z.object({
  cifNif: z
    .string()
    .min(1, { message: "El CIF/NIF es obligatorio." })
    .max(20, { message: "El CIF/NIF es demasiado largo." }),
  street: z
    .string()
    .min(1, { message: "La calle es obligatoria." })
    .max(100, { message: "La calle es demasiado larga." }),
  city: z
    .string()
    .min(1, { message: "La ciudad es obligatoria." })
    .max(50, { message: "La ciudad es demasiado larga." }),
  postalCode: z
    .string()
    .min(1, { message: "El código postal es obligatorio." })
    .max(10, { message: "El código postal es demasiado largo." }),
})

export default function CompanyForm() {
  // 1. Define tu formulario.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cifNif: "",
      street: "",
      city: "",
      postalCode: "",
    },
  })

  // 2. Define una función de envío.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Haz algo con los valores del formulario.
    // Esto se ejecutará cuando el formulario sea válido.
    console.log(values)
    alert("Formulario enviado con éxito. Revisa la consola para ver los datos.")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Información de la Empresa</CardTitle>
        <CardDescription>Introduce los datos de CIF/NIF y dirección.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cifNif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIF/NIF</FormLabel>
                  <FormControl>
                    <Input placeholder="A12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calle</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle Mayor, 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="Madrid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Postal</FormLabel>
                  <FormControl>
                    <Input placeholder="28001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Enviar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
