import { BasicField } from '~shared/types/field'
import {
  LogicConditionState,
  LogicDto,
  LogicIfValue,
  LogicType,
  ShowFieldLogicDto,
} from '~shared/types/form'

export const isShowFieldsLogic = (
  formLogic: LogicDto,
): formLogic is ShowFieldLogicDto => {
  return formLogic.logicType === LogicType.ShowFields
}

export const getIfLogicType = ({
  fieldType,
  conditionState,
}: {
  fieldType: BasicField
  conditionState: LogicConditionState
}) => {
  // Default logic block type
  if (!fieldType) return LogicIfValue.SingleSelect

  switch (fieldType) {
    case BasicField.Dropdown:
    case BasicField.Radio: {
      return conditionState === LogicConditionState.Equal
        ? LogicIfValue.SingleSelect
        : LogicIfValue.MultiSelect
    }
    case BasicField.Rating:
    case BasicField.YesNo:
      return LogicIfValue.SingleSelect
    default:
      return LogicIfValue.Number
  }
}
