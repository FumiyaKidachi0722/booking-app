'use client';

import { use, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
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

const formSchema = z.object({
  startAtUTC: z
    .string()
    .min(1, { message: '開始日時を選択してください' })
    .refine((v) => !Number.isNaN(Date.parse(v)), {
      message: '有効な日時を選択してください',
    }),
  amount: z.number({ invalid_type_error: '数値を入力してください' }).int().nonnegative(),
  cancelFeePreview: z.number({ invalid_type_error: '数値を入力してください' }).int().nonnegative(),
});

export default function ReservationEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { startAtUTC: '', amount: 0, cancelFeePreview: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reservations/${id}`)
      .then((res) => res.json())
      .then((data) =>
        form.reset({
          startAtUTC: data.startAtUTC,
          amount: data.amount,
          cancelFeePreview: data.cancelFeePreview,
        }),
      )
      .finally(() => setLoading(false));
  }, [id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    router.push(`/reservations/${id}`);
  }

  if (loading) return <p className="p-8">読み込み中...</p>;

  return (
    <>
      <PageHeader title="予約の編集" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4 p-8">
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

          <FormInputField control={form.control} name="amount" label="金額" type="number" min={0} />
          <FormInputField
            control={form.control}
            name="cancelFeePreview"
            label="キャンセル料見込み"
            type="number"
            min={0}
          />

          <Button type="submit" className="w-full">
            保存
          </Button>
        </form>
      </Form>
    </>
  );
}
