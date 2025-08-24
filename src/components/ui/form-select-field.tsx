import { Control, FieldPath } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface FormSelectFieldProps<T> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: Option[];
  disabled?: boolean;
}

export function FormSelectField<T>({ control, name, label, options, disabled }: FormSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <select
              {...field}
              className={cn(
                'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
              )}
              disabled={disabled}
            >
              <option value="">選択してください</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

