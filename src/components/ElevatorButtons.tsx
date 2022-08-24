import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCurrentFloor, useElevatorSystem } from '../hooks';
import { ElevatorDirection } from '../models';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type ButtonActiveState = { [key in ElevatorDirection]: boolean };

const ContainerWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  font-size: 18pt;

  background-color: transparent;

  color: dimgray;
  textAlign: center;
  width: 100%;
  justify-content : center;
  margin-top: 17px;

  .active {
    color: red;
  }

  .pointer {
    cursor: pointer;
  }
`;

const ElevatorButtonsWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  font-size: 30pt;

  background-color: transparent;

  color: dimgray;

  .active {
    color: red;
  }

  .pointer {
    cursor: pointer;
  }
`;

const PlayWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  font-size: 30pt;
  background-color: transparent;
  color: dimgray;
 
`;

const faPlayIcon = faPlay as IconProp;

export const ElevatorButtons = () => {
  const [active, setActive] = useState<ButtonActiveState>({ up: false, down: false });
  const { elevators, requestPickup, floorCount } = useElevatorSystem();
  const currentFloor = useCurrentFloor();
  const [requestFloor, setRequestFloor] = useState(currentFloor);

  const activate = (key: ElevatorDirection) => {
    active[key] = true;
    setActive({ ...active });
  };

  const setFlowFunc = (value: String) => {
    let floor = Number(value);
    if(floor <= 4){
      setRequestFloor(Number(value));
    } else {
      setRequestFloor(4)
    }
    
  }

  useEffect(() => {
    // TODO: ugly solution, may not always work
    const arrived =
      elevators.find((elevator: { currentFloor: number; }) => elevator.currentFloor === currentFloor) ?? false;

    if (arrived) setActive({ up: false, down: false });
  }, [elevators, currentFloor]);

  const clickHandler = (key: ElevatorDirection) => {
    requestPickup(requestFloor, key);
    activate(key);
  };

  const upClass = classNames({ pointer: true, active: active.up });
  const downClass = classNames({ pointer: true, active: active.down });
  return (
    <ContainerWrapper>
      <ElevatorButtonsWrapper>
        <PlayWrapper>
          <label style={{ textAlign: 'center', width: '150px', color: 'black', fontSize: '25pt' }}>UP</label>
          <FontAwesomeIcon
            icon={faPlayIcon}
            rotation={270}
            className={upClass}
            onClick={() => clickHandler('up')}
            fixedWidth
            style={{ marginTop: '5px'}}
            />
        </PlayWrapper>

        <PlayWrapper>
          <label style={{ textAlign: 'center', width: '150px', color: 'black', fontSize: '25pt' }}>DOWN</label>
          <FontAwesomeIcon
            icon={faPlayIcon}
            rotation={90}
            className={downClass}
            onClick={() => clickHandler('down')}
            style={{ marginTop: '5px'}}
            fixedWidth
          />
        </PlayWrapper>
      </ElevatorButtonsWrapper>
      <label 
        htmlFor="requestFloor" 
        style={{ 
          textAlign: 'center', 
          width: '350px', 
          marginLeft: '50px',
          marginRight: '20px',
          color: 'black', 
          fontSize: '22pt', 
          justifyContent:'center',
          alignSelf: 'center', 
          }}
        >
          Select floor :
        </label>
        <input
          name="requestFloor"
          min={0}
          max={floorCount}
          value={requestFloor}
          onChange={event => setFlowFunc(event.target.value)}
          style={{ 
            textAlign: 'center', 
            width: '100px',    
            alignSelf: 'center', 
            height: '40px'
            }}
        />
    </ContainerWrapper>
  );
};
