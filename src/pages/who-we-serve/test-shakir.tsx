import React, { useEffect } from 'react'
import Queries from '~/components/revamp/queries'

export default function TestShakir() {
  const queries = new Queries('dev-testdata')
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
    <div>test-shakir</div>
  )
}

