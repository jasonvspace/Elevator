import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ElevatorDirection, ElevatorStatus, ElevatorSystem, Floor } from './models';

type ElevatorSystemProviderProps = {
  children: ReactNode;
};

export interface IElevatorSystemContext {
  floorCount: number;
  elevators: ElevatorStatus[];
  paused: boolean;
  delay: number;
  setFloorCount: (floorCount: number) => void;
  togglePaused: () => void;
  requestPickup: (sourceFloor: Floor, direction: ElevatorDirection) => void;
  requestDropoff: (elevatorID: number, targetFloor: Floor) => void;
  step: () => void;
  addElevator: () => void;
  removeElevator: (id: number) => void;
  reset: () => void;
  setDelay: (newvall: number) => void;
}

const initValues = {
  floorCount: 5,
  startingElevators: 3,
  paused: false,
  delay: 1000,
};

export const ElevatorSystemContext = React.createContext<IElevatorSystemContext | null>(null);

export const ElevatorSystemProvider = ({ children }: ElevatorSystemProviderProps) => {
  const {
    elevatorSystem,
    elevators,
    update,
    requestPickup,
    requestDropoff,
    step,
    addElevator,
    removeElevator,
    reset,
  } = useElevSystemProxy();

  const { floorCount, setFloorCount } = useFloorCount(elevatorSystem, update);
  const { paused, togglePaused, delay, setDelay } = useInterval(
    elevatorSystem,
    floorCount,
    step
  );

  const data: IElevatorSystemContext = {
    elevators,
    paused,
    floorCount,
    setFloorCount,
    togglePaused,
    requestPickup,
    requestDropoff,
    step,
    addElevator,
    removeElevator,
    reset,
    setDelay,
    delay,
  };

  return (
    <ElevatorSystemContext.Provider value={data}>{children}</ElevatorSystemContext.Provider>
  );
};

// helper hooks to debloat provider
function useElevSystemProxy() {
  const elevatorSystem = useMemo(() => new ElevatorSystem(initValues.startingElevators), []);
  const [elevators, setElevators] = useState([...elevatorSystem.status()]);

  const update = useCallback(
    () => setElevators([...elevatorSystem.status()]),
    [elevatorSystem]
  );

  const requestPickup = useCallback(
    (sourceFloor: Floor, direction: ElevatorDirection) => {
      elevatorSystem.pickup(sourceFloor, direction);
      update();
    },
    [elevatorSystem, update]
  );

  const requestDropoff = useCallback(
    (elevatorID: number, targetFloor: Floor) => {
      elevatorSystem.dropoff(elevatorID, targetFloor);
      update();
    },
    [elevatorSystem, update]
  );

  const step = useCallback(() => {
    elevatorSystem.step();
    update();
  }, [elevatorSystem, update]);

  const addElevator = useCallback(() => {
    elevatorSystem.addElevator();
    update();
  }, [elevatorSystem, update]);

  const removeElevator = useCallback(
    (id: number) => {
      elevatorSystem.removeElevator(id);
      update();
    },
    [elevatorSystem, update]
  );

  const reset = useCallback(() => {
    elevatorSystem.resetElevators();
    update();
  }, [elevatorSystem, update]);

  return useMemo(
    () => ({
      elevatorSystem,
      elevators,
      update,
      requestPickup,
      requestDropoff,
      step,
      addElevator,
      removeElevator,
      reset,
    }),
    [
      elevatorSystem,
      elevators,
      update,
      requestPickup,
      requestDropoff,
      step,
      addElevator,
      removeElevator,
      reset,
    ]
  );
} 

function useInterval(
  elevatorSystem: ElevatorSystem,
  floorCount: number,
  step: () => void
) {
  const [delay, setDelay] = useState(initValues.delay);
  const [paused, setPaused] = useState(initValues.paused);
  const intervalID = useRef(-1);

  const nextStep = useCallback(() => {
    step();
    console.log(new Date());
  }, [step, elevatorSystem, floorCount]);

  useEffect(() => {
    clearInterval(intervalID.current);
    intervalID.current = window.setInterval(nextStep, delay);
  }, [nextStep, delay]);

  const togglePaused = useCallback(() => {
    clearInterval(intervalID.current);
    if (paused) intervalID.current = window.setInterval(nextStep, delay);

    setPaused(!paused);
  }, [nextStep, paused, intervalID, delay]);

  return useMemo(
    () => ({ togglePaused, paused, delay, setDelay }),
    [paused, togglePaused, delay]
  );
}

function useFloorCount(elevatorSystem: ElevatorSystem, update: () => void) {
  const [floorCount, _setFloorCount] = useState(initValues.floorCount);

  const setFloorCount = useCallback(
    (newValue: number) => {
      if (newValue > 1 && window.confirm('Are you sure?\nThis will reset all elevators.')) {
        _setFloorCount(newValue);
        elevatorSystem.resetElevators();
        update();
      }
    },
    [elevatorSystem, _setFloorCount, update]
  );

  return useMemo(() => ({ floorCount, setFloorCount }), [floorCount, setFloorCount]);
}
