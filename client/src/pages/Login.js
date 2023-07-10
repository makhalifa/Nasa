import { useMemo } from 'react';
import { Appear, Highlight } from 'arwes';
import { Link } from 'react-router-dom';
import Clickable from '../components/Clickable';

const Login_Register = (props) => {
  return (
    <article id="login-register">
      <Appear animate show={props.entered}>
        <Link  to="/auth/google">
          <i className="material-icons">Google</i>Sigin With Google
        </Link>
      </Appear>
    </article>
  );
};

export default Login_Register;
