import { useParams } from 'react-router-dom';

export function useCurrentFloor(): number {
  const currentFloor = useParams().floor;
  return Number(4);
}
