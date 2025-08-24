'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

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
import { Input } from '@/components/ui/input';
import { schemas } from '@/shared/types/generated/openapi.zod';

const formSchema = schemas.CreateReservationRequest;

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
    { name: 'durationMin', label: 'Duration (min)' },
    { name: 'people', label: 'People' },
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
              <FormField
                key={f.name}
                control={form.control}
                name={f.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{f.label}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                key={f.name}
                control={form.control}
                name={f.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{f.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
