import { Control, FieldPath } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface FormOptionListFieldProps<T> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: Option[];
  disabled?: boolean;
}

export function FormOptionListField<T>({
  control,
  name,
  label,
  options,
  disabled,
}: FormOptionListFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {options.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    'flex items-center space-x-2 rounded-md border p-2',
                    field.value === o.value && 'border-primary',
                    disabled && 'pointer-events-none opacity-50',
                  )}
                >
                  <input
                    type="radio"
                    value={o.value}
                    checked={field.value === o.value}
                    onChange={field.onChange}
                    disabled={disabled}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{o.label}</span>
                </label>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

