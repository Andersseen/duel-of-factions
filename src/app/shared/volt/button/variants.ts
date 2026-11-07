import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed cursor-pointer select-none',
  {
    variants: {
      variant: {
        solid: '',
        destructive:
          'border border-destructive text-destructive',
        outline: 'border border-border',
        ghost: '',
        link: 'text-primary underline-offset-4 data-[hover]:underline',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
