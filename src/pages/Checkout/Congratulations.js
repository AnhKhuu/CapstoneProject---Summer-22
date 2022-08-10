import React from 'react';
import Confetti from 'react-confetti';
import MainLayout from '../../layout/MainLayout';

const Congratulations = () => {
  return (
    <MainLayout>
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <div className="">
        <img src="./images/congratulations.png" className="w-3/4 mx-auto" />
      </div>
    </MainLayout>
  );
};

export default Congratulations;
