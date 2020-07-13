import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectBills,
  makeSelectAmountMoney,
  makeSelectSenderBill,
} from 'containers/PaymentPage/selectors';
import { changeInputNumberAction } from 'containers/App/actions';
import { intlShape, injectIntl } from 'react-intl';
import { StyledFormItem, StyledInputNumber } from 'components/Form/Form.style';
import messages from './messages';
import { disabledSpacesInput, trimInput } from '../../../../helpers';

const stateSelector = createStructuredSelector({
  amountMoney: makeSelectAmountMoney(),
  senderBill: makeSelectSenderBill(),
  bills: makeSelectBills(),
});

function AmountMoney({ intl }) {
  const { amountMoney, senderBill } = useSelector(stateSelector);
  const dispatch = useDispatch();

  const onChangeAmountMoney = (name, value) =>
    dispatch(changeInputNumberAction({ name, value }));

  const checkCorrectAmountMoney = (_, value) => {
    if (!value && value !== 0) {
      return Promise.reject(
        new Error(intl.formatMessage(messages.requiredValidation)),
      );
    }

    if (value && value > Number(senderBill.amountMoney)) {
      return Promise.reject(
        new Error(intl.formatMessage(messages.valueValidation)),
      );
    }

    if (value === 0 || value < 0) {
      return Promise.reject(
        new Error(intl.formatMessage(messages.zeroLessValidation)),
      );
    }

    return Promise.resolve();
  };

  return (
    <StyledFormItem
      label={intl.formatMessage(messages.label)}
      name="amountMoney"
      rules={[
        {
          validator: checkCorrectAmountMoney,
        },
      ]}
    >
      <StyledInputNumber
        type="number"
        onKeyPress={disabledSpacesInput}
        onPaste={trimInput}
        onChange={(value) => onChangeAmountMoney('amountMoney', value)}
        name="amountMoney"
        value={amountMoney}
        placeholder={intl.formatMessage(messages.placeholder)}
      />
    </StyledFormItem>
  );
}

AmountMoney.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AmountMoney);
