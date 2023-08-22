import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {

return (
  <div>
    <Link to="/dashboard" style={{textDecoration: 'none', color: "white"}}>See my dashboard</Link>
  </div>
);
};

export default Home;
