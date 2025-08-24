'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input-field';

const schema = z.object({
  tenantId: z.string().min(1, { message: 'Tenant IDは必須です' }),
  locationId: z.string().optional(),
  resourceId: z.string().min(1, { message: 'Resource IDは必須です' }),
  serviceId: z.string().optional(),
});

export function ReservationSetupForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenantId: '',
      locationId: '',
      resourceId: '',
      serviceId: '',
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    const params = new URLSearchParams();
    (Object.entries(values) as [string, string][]).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    router.push(`/reserve/create?${params.toString()}`);
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">予約対象の選択</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInputField control={form.control} name="tenantId" label="Tenant ID" />
            <FormInputField control={form.control} name="locationId" label="Location ID" />
            <FormInputField control={form.control} name="resourceId" label="Resource ID" />
            <FormInputField control={form.control} name="serviceId" label="Service ID" />
            <Button type="submit" className="w-full">
              次へ
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
