import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { classNames } from '~/utils/classNames';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={classNames(
      'inline-flex h-10 items-center justify-center rounded-md bg-cosmiq-elements-background-depth-1 dark:bg-cosmiq-elements-background-depth-3-dark p-1 text-cosmiq-elements-textSecondary dark:text-cosmiq-elements-textSecondary-dark border border-cosmiq-elements-borderColor dark:border-cosmiq-elements-borderColor-dark',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={classNames(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-cosmiq-elements-background dark:ring-offset-cosmiq-elements-background-dark transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmiq-elements-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-cosmiq-elements-background-depth-0 dark:data-[state=active]:bg-cosmiq-elements-background-depth-2-dark data-[state=active]:text-cosmiq-elements-textPrimary dark:data-[state=active]:text-cosmiq-elements-textPrimary-dark data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={classNames(
      'mt-2 ring-offset-cosmiq-elements-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmiq-elements-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
