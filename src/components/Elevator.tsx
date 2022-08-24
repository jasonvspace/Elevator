import React from 'react';
import styled from 'styled-components';
import { ElevatorStatus, Floor } from '../models';
import { FloorButtons, ElevatorDoors, ElevatorScreen, Wrapper } from '.';
import { useCurrentFloor, useSetClass } from '../hooks';

type ElevatorProps = {
  model: ElevatorStatus;
  floorCount: number;
  removeHandler: () => void;
  addNewStop: (targetFloor: Floor) => void;
};

const ElevatorWrapper = styled(Wrapper)`
  width: 12em;
  height: 15em;

  position: relative;
  background-color: transparent;

  transition: all 0.5s;
  justify-content: center;

  &.deleted {
    transform: translate(0, -100%);
    opacity: 0;
  }
`;

export const Elevator = ({ model, floorCount, removeHandler, addNewStop }: ElevatorProps) => {
  const currentFloor = useCurrentFloor();

  const { className, activateClass } = useSetClass('deleted', 500);

  return (
    <ElevatorWrapper className={className}>
      <Wrapper>
        <ElevatorScreen elevatorState={model.state} currentFloor={model.currentFloor} />
        <ElevatorDoors open={model.currentFloor === currentFloor} />
        <FloorButtons
          clickedFloors={model.stops}
          floorCount={floorCount}
          clickHandler={addNewStop}
        />
      </Wrapper>
    </ElevatorWrapper>
  );
};
