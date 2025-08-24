'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input-field';

const idSchema = (label: string) =>
  z
    .string()
    .min(1, { message: `${label}は必須です` })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message: `${label}は英数字と-_のみ使用できます`,
    });

const formSchema = z.object({
  tenantId: idSchema('Tenant ID'),
  locationId: idSchema('Location ID'),
  resourceId: idSchema('Resource ID'),
  serviceId: idSchema('Service ID'),
  customerId: idSchema('Customer ID'),
  startAtUTC: z
    .string()
    .min(1, { message: '開始日時を選択してください' })
    .refine((v) => !Number.isNaN(Date.parse(v)), {
      message: '有効な日時を選択してください',
    }),
  durationMin: z
    .number({ invalid_type_error: '数値を入力してください' })
    .int()
    .min(15, { message: '15分以上で入力してください' }),
  people: z
    .number({ invalid_type_error: '数値を入力してください' })
    .int()
    .min(1, { message: '1人以上を入力してください' }),
});

export function ReservationForm() {
  const [result, setResult] = useState<string>('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: '',
      locationId: '',
      resourceId: '',
      serviceId: '',
      customerId: '',
      startAtUTC: '',
      durationMin: 60,
      people: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setResult('');
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      const data = await res.json();
      setResult(`予約ID: ${data.reservationId}`);
    } else {
      const err = await res.json().catch(() => ({}));
      setResult(`エラー: ${err.message ?? res.status}`);
    }
  }

  const textFields = [
    { name: 'tenantId', label: 'Tenant ID' },
    { name: 'locationId', label: 'Location ID' },
    { name: 'resourceId', label: 'Resource ID' },
    { name: 'serviceId', label: 'Service ID' },
    { name: 'customerId', label: 'Customer ID' },
  ] as const;

  const numberFields = [
    { name: 'durationMin', label: 'Duration (min)', min: 15 },
    { name: 'people', label: 'People', min: 1 },
  ] as const;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">予約フォーム</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {textFields.map((f) => (
              <FormInputField key={f.name} control={form.control} name={f.name} label={f.label} />
            ))}

            <FormField
              control={form.control}
              name="startAtUTC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開始日時</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(d) => field.onChange(d ? d.toISOString() : '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {numberFields.map((f) => (
              <FormInputField
                key={f.name}
                control={form.control}
                name={f.name}
                label={f.label}
                type="number"
                min={f.min}
              />
            ))}

            <Button type="submit" className="w-full">
              予約する
            </Button>
          </form>
        </Form>
        {result && <p className="mt-4 text-sm">{result}</p>}
      </CardContent>
    </Card>
  );
}
