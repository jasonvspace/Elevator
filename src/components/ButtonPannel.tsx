import React from 'react';
import styled from 'styled-components';
import { ElevatorButtons } from './ElevatorButtons';
import { Wrapper } from './utils';
type Props = {};

const ButtonPannelWrapper = styled(Wrapper)`
  justify-content: space-between;
  width: 100%;
`;

export const ButtonPannel = (props: Props) => {
  return (
    <ButtonPannelWrapper>
      <ElevatorButtons />
    </ButtonPannelWrapper>
  );
};
