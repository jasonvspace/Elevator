import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useElevatorSystem } from '../hooks';
import { Elevator } from './Elevator';

type Props = {};

const ElevatorsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  gap: 20px;
  justify-content: center;
  box-sizing: border-box;
  width: 100vw;
  height: 35vh;
  padding: 20px;
`;

const ElevatorsLogPanel = styled.div`
  text-align: center;
  padding: 20px;
  margin-top: -50px;
  background: 'red';
  width: 100vw;
  height: 35vh;
`;

const ElevatorLabel = styled.div`
   text-align: center;
   margin-top: -30px;
`;

const LogPan = styled.div`
  text-align: center;
  justify-content: center;
  padding: 20px;
  background: 'red'; 
  height: 20px;
  display: flex;
`;

const LogHPan = styled.div`
  text-align: center;
  justify-content: center;
  padding: 10px;
  background: 'red';
  width: 20px;
  height: 20px;
  flex-flow: column wrap;
`;

const MAX_ELEVATORS = 3;

export const ElevatorContainer = (props: Props) => {
  const { floorCount, elevators, requestDropoff, addElevator, removeElevator } =
    useElevatorSystem();
  // TODO: rename
  const children = useMemo(() => {
    const Elevators = elevators.map(elevator => (
      <div>
        <Elevator
          key={elevator.id}
          model={elevator}
          floorCount={floorCount}
          removeHandler={() => removeElevator(elevator.id)}
          addNewStop={targetFloor => requestDropoff(elevator.id, targetFloor)}
        />
        <ElevatorLabel>{ `Bank ${elevator.id}` }</ElevatorLabel>
      </div>
      
    ));

    return Elevators;
  }, [elevators, floorCount, removeElevator, requestDropoff, addElevator]);

  return (
    <>
      <ElevatorsContainer>{children}</ElevatorsContainer>
      <ElevatorsLogPanel>
        {[...Array(floorCount)].map((el, index) => (
            <LogPan>
              <LogHPan>{floorCount - index - 1}</LogHPan>
              <LogHPan>|</LogHPan>
              {elevators.map(elevator=> (
                <>
                  <LogHPan>{elevator.currentFloor == floorCount - index - 1 ? floorCount - index - 1 : '-'}</LogHPan> 
                </>
              ))}
              
            </LogPan>
        ))}          
      </ElevatorsLogPanel>
    </>
    
  )
};
