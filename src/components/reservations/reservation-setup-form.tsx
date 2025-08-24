'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormOptionListField } from '@/components/ui/form-option-list-field';
import { locations, resources, services, tenants } from '@/lib/mockData';

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

  const tenantId = form.watch('tenantId');
  const locationId = form.watch('locationId');

  useEffect(() => {
    form.setValue('locationId', '');
    form.setValue('resourceId', '');
    form.setValue('serviceId', '');
  }, [tenantId, form]);

  useEffect(() => {
    form.setValue('resourceId', '');
  }, [locationId, form]);

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
            <FormOptionListField
              control={form.control}
              name="tenantId"
              label="Tenant"
              options={tenants.map((t) => ({ value: t.id, label: t.name }))}
            />
            <FormOptionListField
              control={form.control}
              name="locationId"
              label="Location"
              options={locations
                .filter((l) => l.tenantId === tenantId)
                .map((l) => ({ value: l.id, label: l.name }))}
              disabled={!tenantId}
            />
            <FormOptionListField
              control={form.control}
              name="resourceId"
              label="Resource"
              options={resources
                .filter(
                  (r) => r.tenantId === tenantId && (!locationId || r.locationId === locationId),
                )
                .map((r) => ({ value: r.id, label: r.name }))}
              disabled={!tenantId}
            />
            <FormOptionListField
              control={form.control}
              name="serviceId"
              label="Service"
              options={services
                .filter((s) => s.tenantId === tenantId)
                .map((s) => ({ value: s.id, label: s.name }))}
              disabled={!tenantId}
            />
            <Button type="submit" className="w-full">
              次へ
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
