// import React, { useState } from "react";
// import LoginApiService from "../../data/services/login/login_api_service";
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Snackbar } from "@mui/material";
// import MuiAlert from '@mui/material/Alert';
// import { saveLoginDetailsAction } from "../State/loginAction";
// import "./login.css";

// const Login = () => {

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [usernameError, setUsernameError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [loginStatus, setLoginStatus] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [userFirstName, setUserFirstName] = useState("");
//   const [isSuccessOpen, setIsSuccessOpen] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isErrorOpen, setIsErrorOpen] = useState(false);
//   const loginApiService = new LoginApiService();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const dispatchUserDetails = () => {
//     const firstName = 'Hello Redux';
//     const action = {
//       type: 'SAVE_USER_DETAILS',
//       payload: { firstName: firstName },
//     };
//     dispatch(action);
//   }

//   const showSuccessMessage = (message: string) => {
//     setSuccessMessage(message);
//     setIsSuccessOpen(true);
//   };

//   const showErrorMessage = (message: string) => {
//     setErrorMessage(message);
//     setIsErrorOpen(true);
//   };

//   const handleSubmit = async () => {
//     setUsernameError("");
//     setPasswordError("");
//     if (username.trim() === "") {
//       setUsernameError("Please enter your email");
//     } else if (!validateEmail(username)) {
//       setUsernameError("Please enter a valid email");
//     }
//     if (password.trim() === "") {
//       setPasswordError("Please enter your password");
//     }
//     if (username.trim() !== "" && password.trim() !== "" && validateEmail(username)) {
//       try {
//         const loginResult = await loginApiService.login({ email: username, password });
//         if (typeof loginResult === 'string') {
//           setLoginStatus(loginResult);
//         } else {
//           try {
//             const {userId,accessLevel} = loginResult;
//             setLoginStatus("Login successful!");
//             const accessPermissionData = await loginApiService.accessPermission(userId);
//             console.log("aa:",accessPermissionData)
//             navigate('/header', { state: { accessPermissionData } });
//             dispatch(saveLoginDetailsAction(username, password, userId,accessLevel));
//           } catch (error) {
//             console.error("Error extracting userId:", error);
//             setLoginStatus("An error occurred during login");
//           }
//         }
//       } catch (error) {
//         console.error("Error during login:", error);
//         setLoginStatus("An error occurred during login");
//       }
//     }
//   };

//   const handleSubmitClick = () => {
//     handleSubmit();
//   };

//   const handleKeyPress = (e: { key: string; }) => {
//     if (e.key === 'Enter') {
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="body-style">
//       <div className="container-style login-container">
//         <h2 className="login-head">Login</h2>
//         <div className="form-groups">
//           <label className="label-style">Email id :</label>
//           <input
//             type="text"
//             className="form-control login-input"
//             value={username}
//             onChange={(e) => {
//               setUsername(e.target.value);
//               setUsernameError("");
//             }}
//           />
//           <span className="error-message">{usernameError}</span>
//         </div>
//         <div className="form-groups">
//           <label className="label-style">Password :</label>
//           <div className="password-input">
//             <input
//               type={showPassword ? "text" : "password"}
//               className="form-control login-input"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 setPasswordError("");
//               }}
//               onKeyPress={handleKeyPress}
//             />
//             <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>
//           </div>
//           <span className="error-message">{passwordError}</span>
//         </div>
//         <button type="button" className="btn-submit login-button" onClick={handleSubmitClick}>
//           Sign In
//         </button>
//         {loginStatus && (
//           <div
//             className={`alert ${loginStatus === 'Login successful!' ? 'alert-success' : 'alert-danger'}`}
//             role="alert"
//             style={{ marginTop: '10%' }}
//           >
//             {loginStatus}
//           </div>
//         )}
//       </div>
//       <Snackbar
//         open={isSuccessOpen}
//         autoHideDuration={5000}
//         onClose={() => setIsSuccessOpen(false)}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <MuiAlert
//           elevation={6}
//           variant="filled"
//           severity="success"
//           onClose={() => setIsSuccessOpen(false)}
//         >
//           {successMessage}
//         </MuiAlert>
//       </Snackbar>
//       <Snackbar
//         open={isErrorOpen}
//         autoHideDuration={5000}
//         onClose={() => setIsErrorOpen(false)}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <MuiAlert
//           elevation={6}
//           variant="filled"
//           severity="error"
//           onClose={() => setIsErrorOpen(false)}
//         >
//           {errorMessage}
//         </MuiAlert>
//       </Snackbar>
//       <Snackbar
//         open={isErrorOpen}
//         autoHideDuration={5000}
//         onClose={() => setIsErrorOpen(false)}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <MuiAlert
//           elevation={6}
//           variant="filled"
//           severity="error"
//           onClose={() => setIsErrorOpen(false)}
//         >
//           {errorMessage}
//         </MuiAlert>
//       </Snackbar>

//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { saveLoginDetailsAction } from "../State/loginAction";
import "./login.css";
import LoginApiService from "../../data/services/login/login_api_service";

const Login = () => {

  const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const loginApiService = new LoginApiService();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const dispatchUserDetails = () => {
    const firstName = 'Hello Redux';
    const action = {
      type: 'SAVE_USER_DETAILS',
      payload: { firstName: firstName },
    };
    dispatch(action);
  }

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessOpen(true);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsErrorOpen(true);
  };

  const handleSubmit = async () => {
    setUsernameError("");
    setPasswordError("");
  
    if (email.trim() !== "" && password.trim() !== "" && validateEmail(email)) {
      try {
        const loginResult = await loginApiService.login({ email: email, password });
        console.log('loginResult:', loginResult); // Add this log to debug
        if (typeof loginResult === 'string') {
          setLoginStatus(loginResult);
        } else {
          const { userId, fullName, accessLevel } = loginResult;
          console.log('accessLevel:', accessLevel);  // Log accessLevel to debug
          setLoginStatus("Login successful!");
          const accessPermissionData = await loginApiService.accessPermission(userId);
          navigate('/dashboard', { state: { accessPermissionData } });
          dispatch(saveLoginDetailsAction(fullName, email, password, userId, accessLevel));
        }
      } catch (error) {
        console.error("Error during login:", error);
        setLoginStatus("An error occurred during login");
      }
    }
  };
  

  const handleSubmitClick = () => {
    handleSubmit();
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="body-style">
      <div className="container-style login-container">
        <h2 className="login-head">Login</h2>
        <div className="form-groups">
          <label className="label-style">Email</label>
          <input
            type="text"
            className="form-control login-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setUsernameError("");
            }}
          />
          <span className="error-message">{usernameError}</span>
        </div>
        <div className="form-groups">
          <label className="label-style">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control login-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              onKeyPress={handleKeyPress}
            />
            <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <span className="error-message">{passwordError}</span>
        </div>
        <button type="button" className="btn-submit login-button" onClick={handleSubmitClick}>
          Sign In
        </button>
        {loginStatus && (
          <div
            className={`alert ${loginStatus === 'Login successful!' ? 'alert-success' : 'alert-danger'}`}
            role="alert"
            style={{ marginTop: '10%' }}
          >
            {loginStatus}
          </div>
        )}
      </div>
      <Snackbar
        open={isSuccessOpen}
        autoHideDuration={5000}
        onClose={() => setIsSuccessOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={() => setIsSuccessOpen(false)}
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isErrorOpen}
        autoHideDuration={5000}
        onClose={() => setIsErrorOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setIsErrorOpen(false)}
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isErrorOpen}
        autoHideDuration={5000}
        onClose={() => setIsErrorOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setIsErrorOpen(false)}
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>

    </div>
  );
};

export default Login;

