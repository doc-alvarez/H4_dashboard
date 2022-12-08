import { useTransition } from "@remix-run/react";
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function SalesPlace({
  data = {},
  localName = "",
  isLoading,
}: {
  data: any;
  localName: string;
  isLoading: boolean;
}) {
  const transition = useTransition();
  return (
    <>
      <div
        style={transition.state !== "idle" ? { opacity: "0.5" } : {}}
        className='jokes-list'
      >
        <p>
          Total Orders: <b>{data?.len}</b>
        </p>
        <p>Total Sales: {formatter.format(data?.salesTotal)}</p>
        <p>Total Cash: {formatter.format(data?.cashTotal)}</p>
        <p>
          Total Electronics:{" "}
          {formatter.format(data?.salesTotal - data?.cashTotal)}
        </p>
        <p
          style={
            transition.state === "idle"
              ? { boxShadow: "0 0 10px 0px white" }
              : {}
          }
        >
          You are viewing:
          <span
            style={{
              paddingLeft: "10px",
              color: "black",
              backgroundColor: "transparent",
            }}
          >
            {transition.state === "idle"
              ? data?.localName?.toUpperCase()
              : "Loading... "}
          </span>
        </p>
      </div>
    </>
  );
}
