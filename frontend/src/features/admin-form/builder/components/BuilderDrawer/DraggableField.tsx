import { useMemo } from 'react'
import {
  BiAlignLeft,
  BiBuilding,
  BiCalculator,
  BiCalendarEvent,
  BiCaretDownSquare,
  BiCloudUpload,
  BiHash,
  BiHeading,
  BiImage,
  BiMailSend,
  BiMobile,
  BiPhone,
  BiRadioCircleMarked,
  BiRename,
  BiSelectMultiple,
  BiStar,
  BiTable,
  BiText,
  BiToggleLeft,
  BiUser,
} from 'react-icons/bi'
import { As, Box, forwardRef, Icon, Stack, Text } from '@chakra-ui/react'
import { useDraggable } from '@dnd-kit/core'

import { BasicField } from '~shared/types/field'

interface DraggableFieldOptionProps extends FieldOptionProps {
  id: string
}

const FIELDS_TO_META: Record<BasicField, { label: string; icon: As }> = {
  [BasicField.Image]: {
    label: 'Image',
    icon: BiImage,
  },

  [BasicField.Statement]: {
    label: 'Paragraph',
    icon: BiText,
  },
  [BasicField.Section]: {
    label: 'Header',
    icon: BiHeading,
  },
  [BasicField.Attachment]: {
    label: 'Attachment',
    icon: BiCloudUpload,
  },
  [BasicField.Checkbox]: {
    label: 'Checkbox',
    icon: BiSelectMultiple,
  },
  [BasicField.Date]: {
    label: 'Date',
    icon: BiCalendarEvent,
  },
  [BasicField.Decimal]: {
    label: 'Decimal',
    icon: BiCalculator,
  },
  [BasicField.Dropdown]: {
    label: 'Dropdown',
    icon: BiCaretDownSquare,
  },
  [BasicField.Email]: {
    label: 'Email',
    icon: BiMailSend,
  },
  [BasicField.HomeNo]: {
    label: 'Home Number',
    icon: BiPhone,
  },
  [BasicField.LongText]: {
    label: 'Long answer',
    icon: BiAlignLeft,
  },
  [BasicField.Mobile]: {
    label: 'Mobile number',
    icon: BiMobile,
  },
  [BasicField.Nric]: {
    label: 'NRIC',
    icon: BiUser,
  },
  [BasicField.Number]: {
    label: 'Number',
    icon: BiHash,
  },
  [BasicField.Radio]: {
    label: 'Radio',
    icon: BiRadioCircleMarked,
  },
  [BasicField.Rating]: {
    label: 'Rating',
    icon: BiStar,
  },
  [BasicField.ShortText]: {
    label: 'Short answer',
    icon: BiRename,
  },
  [BasicField.Table]: {
    label: 'Table',
    icon: BiTable,
  },
  [BasicField.Uen]: {
    label: 'UEN',
    icon: BiBuilding,
  },
  [BasicField.YesNo]: {
    label: 'Yes/No',
    icon: BiToggleLeft,
  },
}

export const DraggableFieldOption = ({
  fieldType,
  id,
}: DraggableFieldOptionProps): JSX.Element => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: {
      fieldType,
    },
  })

  return (
    <FieldOption
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      fieldType={fieldType}
    />
  )
}

interface FieldOptionProps {
  fieldType: BasicField
}

export const FieldOption = forwardRef<FieldOptionProps, 'div'>(
  ({ fieldType, ...props }, ref) => {
    const meta = useMemo(() => FIELDS_TO_META[fieldType], [fieldType])

    return (
      <Box ref={ref} {...props}>
        <Stack
          py="1rem"
          spacing="1.5rem"
          direction="row"
          align="center"
          color="secondary.500"
        >
          <Icon fontSize="1.5rem" as={meta.icon} />
          <Text textStyle="body-1">{meta.label}</Text>
        </Stack>
      </Box>
    )
  },
)
