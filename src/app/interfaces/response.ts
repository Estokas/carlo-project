interface FirebaseSignUpRequest {
  email: string;
  password: string;
  returnSecureToken: boolean;
}

interface FirebaseSignUpResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface FirebaseError {
  error?: {
    error?: {
      message?: string;
    };
    message?: string;
  };
}