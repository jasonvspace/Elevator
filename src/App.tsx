import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Building from './Building';
import { ElevatorSystemProvider } from './ElevatorSystem';
import { ButtonPannel } from './components';
import styled from 'styled-components'
import { Outlet } from 'react-router'

// NOTE: env vars are always string, must be converted to number
const BANKS = process.env.BANKS || '3';
const FLOORS = process.env.FLOORS || '5';
// const TICK_DELAY = process.env.TICK_DELAY || '1000';

const Container = styled.div`
  widht: 100vw;
  height: 100vh
`

function App() {
  const banks = parseInt(BANKS, 10);
  const floors = parseInt(FLOORS, 10);
  return (
    <ElevatorSystemProvider>
      <Container>
        <Building banks={banks} floors={floors} buttons={3}/>
        <ButtonPannel />
        <Outlet />
      </Container>
    </ElevatorSystemProvider>
  );
}

export default App;
