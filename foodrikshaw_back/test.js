import jwt from "jsonwebtoken";


const generateToken = (payload) => {
    const token = jwt.sign(payload, 'MY_SECRET_KEY');
    return token;
  };

  
  
  const validateToken = (token) => {
    try {
      const verified = jwt.verify(token, 'MY_SECRET_KEY');
      console.log("Token validation successful:", verified); 
    } catch (error) {
      console.error("Invalid or expired JWT: ", error);
    }
  };

  const use = ()=>{
   const tocken =  generateToken('66ebd117e469d767ffaa393c');
   console.log('66ebd117e469d767ffaa393c')
   console.log('token:', tocken)
   validateToken(tocken);
  }
  use();