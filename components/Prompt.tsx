import { useEffect, useState } from 'react';

export const Ps1 = () => {
  const [hostname, setHostname] = useState('');

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  return (
    <div className='mr-2'>
      <span
        style={{
          color: '#d79921',
        }}
      >
        guest
      </span>
      <span
        style={{
          color: '#928374',
        }}
      >
        @
      </span>
      <span
        style={{
          color: "#458588",
        }}
      >
        {hostname}
      </span>
      <span
        style={{
          color: '#928374',
        }}
      >
        :$~
      </span>
    </div>
  );
};

export default Ps1;
