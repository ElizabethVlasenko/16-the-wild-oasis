import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;
const StyledSpinnerFullPage = styled.div`
  background-color: var(--color-grey-0);
  position: absolute;
  width: 100%;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  margin: 4.8rem auto;
  width: 6.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(farthest-side, var(--color-brand-600) 94%, #0000)
      top/10px 10px no-repeat,
    conic-gradient(#0000 30%, var(--color-brand-600));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0);
  animation: ${rotate} 1.5s infinite linear;
`;

function SpinnerFullPage() {
  return (
    <StyledSpinnerFullPage>
      <Spinner />
    </StyledSpinnerFullPage>
  );
}

export default SpinnerFullPage;
