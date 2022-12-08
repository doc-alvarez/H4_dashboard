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
        <p>
          Total Sales: <b>{formatter.format(data?.salesTotal)}</b>
        </p>
        <p>
          Total Cash: <b>{formatter.format(data?.cashTotal)}</b>
        </p>
        <p>
          Total Electronics:{" "}
          <b>{formatter.format(data?.salesTotal - data?.cashTotal)}</b>
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
