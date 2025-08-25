import type { Control, FieldPath } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormInputFieldProps<T> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  min?: number;
  disabled?: boolean;
}

export function FormInputField<T>({
  control,
  name,
  label,
  type = 'text',
  min,
  disabled,
}: FormInputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              min={min}
              disabled={disabled}
              required
              onChange={
                type === 'number' ? (e) => field.onChange(e.target.valueAsNumber) : field.onChange
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
