import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRout({ children }) {
  const navigate = useNavigate();
  //load authenticated user
  const { isLoading, isAuthenticated, isFetching } = useUser();

  //if there is no authenticated user then redirect to login page
  useEffect(() => {
    if (!isAuthenticated && !isLoading && !isFetching) navigate("/login");
  }, [isAuthenticated, isLoading, navigate, isFetching]);

  //while loading, show spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />;
      </FullPage>
    );

  //is there is a user, render the app
  if (isAuthenticated) return children;
}

export default ProtectedRout;
