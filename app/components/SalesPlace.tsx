export default function SalesPlace({
  name,
  data = {},
}: {
  name: string;
  data: any;
}) {
  return (
    <div className='jokes-list'>
      <h3>{name}</h3>
      <hr></hr>
      <p>Total Orders: {data?.len}</p>
      <p>Total Sales: $ {data?.salesTotal}</p>
      <p>Total Cash $ {data?.cashTotal}</p>
      <p>Total electronics: $ {data?.salesTotal - data?.cashTotal}</p>
    </div>
  );
}
