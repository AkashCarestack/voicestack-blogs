import React, { useEffect } from 'react'
import Queries from '~/components/revamp/queries'

export default function TestShakir() {
  const queries = new Queries('dev-adolf-h')
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await queries.getData();
      setData(result);
    };
    fetchData();
  }, []);
  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <div className='text-red-500 h-screen w-20'>test-shakir</div>
  )
}

