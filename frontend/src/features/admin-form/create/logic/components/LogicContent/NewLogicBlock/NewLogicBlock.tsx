import { useCallback, useLayoutEffect, useRef } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Stack } from '@chakra-ui/react'

import { useAdminLogicStore } from '../../../adminLogicStore'
import {
  AddConditionDivider,
  EditConditionBlock,
  EditConditionBlockDivider,
  EditConditionWrapper,
  EditLogicInputs,
  LOGIC_FIELD_ARRAY_NAME,
  SaveActionGroup,
  ThenShowBlock,
} from '../EditCondition'

export const NewLogicBlock = () => {
  const setToInactive = useAdminLogicStore(
    useCallback((state) => state.setToInactive, []),
  )

  const formMethods = useForm<EditLogicInputs>({
    defaultValues: {
      [LOGIC_FIELD_ARRAY_NAME]: [{}],
    },
  })

  const { fields, append } = useFieldArray({
    control: formMethods.control,
    name: LOGIC_FIELD_ARRAY_NAME,
  })

  const ref = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleCreateLogic = formMethods.handleSubmit((inputs) => {
    console.log(inputs)
  })

  return (
    <FormProvider {...formMethods}>
      <EditConditionWrapper ref={ref}>
        <Stack
          divider={<EditConditionBlockDivider />}
          direction="column"
          py="1.5rem"
          px={{ base: '1.5rem', md: '2rem' }}
        >
          {fields.map((field, index) => {
            return <EditConditionBlock key={field.id} index={index} />
          })}
        </Stack>
        <AddConditionDivider handleAddCondition={() => append({})} />
        <ThenShowBlock />
        <SaveActionGroup
          handleDelete={setToInactive}
          handleSubmit={handleCreateLogic}
          handleCancel={setToInactive}
          submitButtonLabel="Add logic"
        />
      </EditConditionWrapper>
    </FormProvider>
  )
}
