import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'react-use'
import {
  Box,
  Divider,
  FormControl,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { extend } from 'lodash'

import { RadioFieldBase } from '~shared/types/field'

import { RadioFieldSchema } from '~/templates/Field/Radio/RadioField'

import { createBaseValidationRules } from '~utils/fieldValidation'
import FormErrorMessage from '~components/FormControl/FormErrorMessage'
import FormLabel from '~components/FormControl/FormLabel'
import Input from '~components/Input'
import { Tab } from '~components/Tabs'
import Textarea from '~components/Textarea'
import Toggle from '~components/Toggle'

import { useEditFieldStore } from '../../../editFieldStore'
import { useMutateFormFields } from '../../../mutations'
import { isPendingFormField } from '../../../utils'

import { DrawerContentContainer } from './DrawerContentContainer'
import { FormFieldDrawerActions } from './FormFieldDrawerActions'

export interface IEditRadioProps {
  field: RadioFieldSchema
}

interface IEditRadioInputs
  extends Pick<
    RadioFieldBase,
    'title' | 'description' | 'required' | 'othersRadioButton'
  > {
  fieldOptions: string
}

const transformRadioOpts = {
  toArray: (input?: string) =>
    input
      ?.split('\n')
      .map((opt) => opt.trim())
      .filter(Boolean) ?? [],
  toString: (output?: string[]) => output?.filter(Boolean).join('\n'),
}

const transformToFormField = ({
  fieldOptions,
  ...rest
}: IEditRadioInputs): Partial<RadioFieldSchema> => {
  return {
    ...rest,
    fieldOptions: transformRadioOpts.toArray(fieldOptions),
  }
}

const requiredValidationRule = createBaseValidationRules({ required: true })

const fieldOptionsValidationRule = {
  ...requiredValidationRule,
  validate: {
    duplicate: (opts: string) => {
      const optsArray = transformRadioOpts.toArray(opts)
      return (
        new Set(optsArray).size === optsArray.length ||
        'Please remove duplicate options.'
      )
    },
  },
}

export const EditRadio = ({ field }: IEditRadioProps): JSX.Element => {
  const { updateActiveField, clearActiveField } = useEditFieldStore()

  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<IEditRadioInputs>({
    defaultValues: {
      title: field.title,
      description: field.description,
      fieldOptions: transformRadioOpts.toString(field.fieldOptions),
      required: field.required,
      othersRadioButton: field.othersRadioButton,
    },
  })

  const watchedInputs = watch()

  useDebounce(
    () => {
      if (!watchedInputs) return
      return updateActiveField(transformToFormField(watchedInputs))
    },
    300,
    [
      transformRadioOpts,
      // Required destructure to prevent debounce firing infinitely.
      watchedInputs.description,
      watchedInputs.fieldOptions,
      watchedInputs.required,
      watchedInputs.title,
      watchedInputs.othersRadioButton,
    ],
  )

  const { mutateFormField } = useMutateFormFields()

  const saveButtonText = useMemo(
    () => (isPendingFormField(field) ? 'Create' : 'Save'),
    [field],
  )

  const isSaveDisabled = useMemo(
    () => isDirty || isPendingFormField(field),
    [field, isDirty],
  )

  const handleUpdateField = handleSubmit((inputs) => {
    const updatedField = extend({}, field, transformToFormField(inputs))
    return mutateFormField.mutate(updatedField, {
      onSuccess: () => {
        reset(inputs)
      },
    })
  })

  const [tabIndex, setTabIndex] = useState(0)

  // Effect to move to second tab to show error message.
  useEffect(() => {
    if (isSubmitting && tabIndex === 0) {
      setTabIndex(1)
    }
  }, [isSubmitting, tabIndex])

  return (
    <Tabs
      variant="line-light"
      display="flex"
      flexDir="column"
      flex={1}
      overflow="hidden"
      index={tabIndex}
      onChange={setTabIndex}
    >
      <Box
        px="1rem"
        pt="1.5rem"
        borderBottom="1px solid"
        borderBottomColor="neutral.300"
      >
        <TabList
          overflowX="initial"
          display="inline-flex"
          w="max-content"
          mb="-1px"
        >
          <Tab>General</Tab>
          <Tab>Options</Tab>
        </TabList>
      </Box>
      <DrawerContentContainer>
        <TabPanels mb="2rem">
          <TabPanel>
            <Stack spacing="2rem" divider={<Divider />}>
              <FormControl
                isRequired
                isReadOnly={mutateFormField.isLoading}
                isInvalid={!!errors.title}
              >
                <FormLabel>Question</FormLabel>
                <Input
                  autoFocus
                  {...register('title', requiredValidationRule)}
                />
                <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isReadOnly={mutateFormField.isLoading}
                isInvalid={!!errors.description}
              >
                <FormLabel>Description</FormLabel>
                <Textarea {...register('description')} />
                <FormErrorMessage>
                  {errors?.description?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isReadOnly={mutateFormField.isLoading}
                isInvalid={!!errors.fieldOptions}
              >
                <FormLabel>Options</FormLabel>
                <Textarea
                  {...register('fieldOptions', fieldOptionsValidationRule)}
                />
                <FormErrorMessage>
                  {errors?.fieldOptions?.message}
                </FormErrorMessage>
              </FormControl>
              <Toggle
                isLoading={mutateFormField.isLoading}
                label="Required"
                {...register('required')}
              />
            </Stack>
          </TabPanel>
          <TabPanel>
            <Stack spacing="2rem" divider={<Divider />}>
              <Toggle
                isLoading={mutateFormField.isLoading}
                label="Others"
                {...register('othersRadioButton')}
              />
            </Stack>
          </TabPanel>
        </TabPanels>

        <FormFieldDrawerActions
          isLoading={mutateFormField.isLoading}
          isDirty={isSaveDisabled}
          buttonText={saveButtonText}
          handleClick={handleUpdateField}
          handleCancel={clearActiveField}
        />
      </DrawerContentContainer>
    </Tabs>
  )
}
