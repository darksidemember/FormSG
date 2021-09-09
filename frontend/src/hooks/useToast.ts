import React, { useMemo } from 'react'
import {
  RenderProps,
  useToast as useChakraToast,
  UseToastOptions as ChakraUseToastOptions,
} from '@chakra-ui/react'
import { SetRequired } from 'type-fest'

import { Toast, ToastProps, ToastStatus } from '~/components/Toast/Toast'

type ToastBehaviourProps = Pick<
  ChakraUseToastOptions,
  'duration' | 'position' | 'render'
>

// onClose is provided by the chakra hook and should not be exposed to clients
export type UseToastProps = Omit<
  ToastBehaviourProps & ToastProps,
  'onClose' | 'status'
> & { status?: ToastStatus }

export type UseToastOptions = SetRequired<UseToastProps, 'status'>

export type UseToastReturn = {
  (options: UseToastOptions): string | number | undefined
  close: ReturnType<typeof useChakraToast>['close']
  closeAll: ReturnType<typeof useChakraToast>['closeAll']
  isActive: ReturnType<typeof useChakraToast>['isActive']
  update: ReturnType<typeof useChakraToast>['update']
}

export const useToast = ({
  status,
  ...initialProps
}: UseToastProps = {}): UseToastReturn => {
  const toast = useChakraToast(initialProps)

  const customToastImpl = useMemo(() => {
    const impl = ({
      duration = 6000,
      position = 'top',
      render,
      status,
      ...rest
    }: UseToastOptions) =>
      toast({
        duration,
        position,
        ...rest,
        render: (props: RenderProps) =>
          // NOTE: Because chakra expects this to be JSX, this has to be called with createElement.
          // Omitting the createElement causes a visual bug, where our own theme providers are not used.
          // Using createElement also allows the file to be pure ts rather than tsx.
          render ??
          React.createElement(() => Toast({ status, ...rest, ...props })),
      })

    impl.close = toast.close
    impl.closeAll = toast.closeAll
    impl.isActive = toast.isActive
    impl.update = toast.update

    return impl
  }, [toast])

  return customToastImpl
}
