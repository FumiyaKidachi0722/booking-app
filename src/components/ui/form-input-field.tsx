import { Control, FieldPath } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormInputFieldProps<T> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  min?: number;
}

export function FormInputField<T>({ control, name, label, type = 'text', min }: FormInputFieldProps<T>) {
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
              required
              onChange={
                type === 'number'
                  ? (e) => field.onChange(e.target.valueAsNumber)
                  : field.onChange
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
