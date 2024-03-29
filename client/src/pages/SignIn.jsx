import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
// import AxiosJWT from "../axios";
const Container = styled.div`
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
`;
const Wrapper = styled.div`
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 60px;
  border-radius: 3px;
`;
const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
`;
const SubTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 20px;
`;
const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  margin-bottom: 20px;
  padding: 10px 0;
  color: ${({ theme }) => theme.text};
`;
const Button = styled.button`
  background: transparent;
  border: none;
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  padding: 10px 20px;
  border-radius: 3px;
`;
const More = styled.div`
  font-size: 0.875rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  color: ${({ theme }) => theme.textSoft};
`;
const Hr = styled.hr`
  margin: 15px 0;
  border: 1px solid ${({ theme }) => theme.soft};
  width: 100%;
`;
const Links = styled.div`
  margin-left: auto;
`;
const Link = styled.span`
  margin-left: 50px;
  font-size: 0.875rem;
`;

const SignIn = () => {
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/v1/auth/signIn",
        {
          name,
          password,
        }
      );
      dispatch(loginSuccess(res.data));
      window.localStorage.setItem(
        "token",
        JSON.stringify(res.data.tokenActive)
      );
      navigate("/");
    } catch (error) {
      dispatch(loginFailure());
    }
  };
  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post(process.env.REACT_APP_BASE_URL + "/api/v1/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data));
            window.localStorage.setItem(
              "token",
              JSON.stringify(res.data.tokenActive)
            );
            navigate("/");
          });
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/v1/auth/signup",
        {
          name,
          email,
          password,
        }
      );
      dispatch(loginSuccess(res.data));
      window.localStorage.setItem(
        "token",
        JSON.stringify(res.data.tokenActive)
      );
      navigate("/");
    } catch (error) {
      dispatch(loginFailure());
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <SubTitle>to continue to PetsTube</SubTitle>
        <Input
          placeholder='username'
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type='password'
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Sign in</Button>
        <Hr />
        <SubTitle>or</SubTitle>
        <Button onClick={signInWithGoogle}> Sign In with Google</Button>
        <SubTitle>or</SubTitle>
        <Input
          type='text'
          placeholder='user name'
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type='email'
          placeholder='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type='password'
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleRegister}>Sign up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
