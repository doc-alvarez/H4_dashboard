import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import {
  apiLogin,
  getAPIData,
  middleWareBotanico,
  middleWareMireya,
} from "~/utils/session.server";
import SalesPlace from "~/components/SalesPlace";
import {
  Form,
  useLoaderData,
  useLocation,
  useTransition,
} from "@remix-run/react";
import React from "react";
import md5 from "md5";
import { RingLoader } from "react-spinners";

interface Locale_Data {
  to: string;
  from: string;
  localName: string;
  len: number;
  salesTotal: number;
  cashTotal: number;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  let date = new Date();
  const url = new URL(request.url);
  const from =
    url.searchParams.get("from") ||
    `${date.getFullYear()}-${date.getMonth() + 1}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}`;
  const to =
    url.searchParams.get("to") ||
    `${date.getFullYear()}-${date.getMonth() + 1}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}`;
  let historic = url.searchParams.get("historic");
  let paging = historic ? 12 : 2;
  console.log(historic, paging);
  let data;
  let siria_token;
  let lac_token;

  switch (params.local) {
    //***************************************** */
    //MIREYA
    //***************************************** */
    case "mireya":
      let mireyaresult = await middleWareMireya(from, to, params, paging);
      console.log("MIREYA");
      return json(mireyaresult, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(mireyaresult)),
        },
      });
    //***************************************** */
    //BOTANICO
    //***************************************** */
    case "botanico":
      let botanicoresult = await middleWareBotanico(from, to, params, paging);
      console.log("BOTANICO");
      return json(botanicoresult, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(botanicoresult)),
        },
      });
    //***************************************** */
    //SIRIA
    //***************************************** */
    case "siria":
      siria_token = await apiLogin(
        process.env.SIRIA_EMAIL as string,
        process.env.SIRIA_PASS as string
      );
      data = await getAPIData({
        email: process.env.SIRIA_EMAIL as string,
        token: siria_token,
        from,
        to,
      });
      let siriaresult: Locale_Data = {
        from: from,
        to: to,
        localName: params.local as string,
        len: data?.length,
        salesTotal: data?.reduce(
          (acc: any, val: { total: any }) => acc + val.total,
          0
        ),
        cashTotal: data
          ?.map((order: { paymentmethod: string; total: any }) => {
            if (order.paymentmethod === "cash") {
              return order.total;
            } else {
              return null;
            }
          })
          ?.reduce((acc: any, val: any) => (val ? acc + val : acc), 0),
      };
      console.log("SIRIA");
      return json(siriaresult, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(siriaresult)),
        },
      });
    //***************************************** */
    //LACROZE
    //***************************************** */
    case "lacroze":
      lac_token = await apiLogin(
        process.env.LACROZE_EMAIL as string,
        process.env.LACROZE_PASS as string
      );
      data = await getAPIData({
        email: process.env.LACROZE_EMAIL as string,
        token: lac_token,
        from,
        to,
      });
      let lacrozeresult: Locale_Data = {
        from: from,
        to: to,
        localName: params.local as string,
        len: data?.length,
        salesTotal: data?.reduce(
          (acc: any, val: { total: any }) => acc + val.total,
          0
        ),
        cashTotal: data
          ?.map((order: { paymentmethod: string; total: any }) => {
            if (order.paymentmethod === "cash") {
              return order.total;
            } else {
              return null;
            }
          })
          ?.reduce((acc: any, val: any) => (val ? acc + val : acc), 0),
      };
      console.log("LACROZE");
      return json(lacrozeresult, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(lacrozeresult)),
        },
      });
    //***************************************** */
    //ALL
    //***************************************** */
    case "all":
      [lac_token, siria_token] = await Promise.all([
        apiLogin(
          process.env.LACROZE_EMAIL as string,
          process.env.LACROZE_PASS as string
        ),
        apiLogin(
          process.env.SIRIA_EMAIL as string,
          process.env.SIRIA_PASS as string
        ),
      ]);
      data = (
        await Promise.all([
          getAPIData({
            email: process.env.LACROZE_EMAIL as string,
            token: lac_token,
            from,
            to,
          }),
          getAPIData({
            email: process.env.SIRIA_EMAIL as string,
            token: siria_token,
            from,
            to,
          }),
        ])
      ).flat();
      const data2 = (
        await Promise.all([
          middleWareBotanico(from, to, params, paging),
          middleWareMireya(from, to, params, paging),
        ])
      ).flat();
      let result: Locale_Data = {
        from: from,
        to: to,
        localName: params.local as string,
        len: data?.length,
        salesTotal: data?.reduce(
          (acc: any, val: { total: any }) => acc + val.total,
          0
        ),
        cashTotal: data
          ?.map((order: { paymentmethod: string; total: any }) => {
            if (order.paymentmethod === "cash") {
              return order.total;
            } else {
              return null;
            }
          })
          ?.reduce((acc: any, val: any) => (val ? acc + val : acc), 0),
      };
      let integratedResult = [...data2, result].reduce((acc, val) => ({
        from: val.from,
        to: val.to,
        localName: val.localName,
        len: acc.len + val.len,
        salesTotal: acc.salesTotal + val.salesTotal,
        cashTotal: acc.cashTotal + val.cashTotal,
      }));
      console.log("ALL STORES");
      return json(integratedResult, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(result)),
        },
      });

    default:
      data = [];
  }
  return json([]);
};

export default function LocalSpecific() {
  const data = useLoaderData() as Locale_Data;
  const [dateFrom, setFromDate] = React.useState(data.from);
  const [dateTo, setToDate] = React.useState(data.to);
  let loc = useLocation();
  let transition = useTransition();

  React.useEffect(() => {
    if (!loc.search) {
      setFromDate(data.from);
      setToDate(data.to);
    }
  }, [data.from, data.to, loc]);

  return (
    <div>
      <hr></hr>
      <Form method='get'>
        <label htmlFor='from'></label>
        <input
          value={dateFrom}
          onChange={(event) => setFromDate(event?.currentTarget.value)}
          name='from'
          id='from'
          type='date'
        />
        <label htmlFor='to'></label>
        <input
          value={dateTo}
          onChange={(event) => setToDate(event.currentTarget.value)}
          name='to'
          id='to'
          type='date'
        />
        <button
          id='submit_date'
          disabled={Boolean(transition.state !== "idle")}
          style={{
            padding: "12px",
            minWidth: "80px",
            borderRadius: "20px",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          type='submit'
        >
          {transition.state !== "idle" ? (
            <RingLoader size='22px' loading={true} />
          ) : (
            <span
              style={{
                fontSize: "32px",
              }}
            >
              🧐
            </span>
          )}
        </button>
        <div style={{ marginTop: "20px" }}>
          <label htmlFor='checkbox'>Historico:</label>
          <input type='checkbox' id='checkbox' name='historic' />
        </div>
      </Form>
      <SalesPlace
        isLoading={transition.state !== "idle"}
        localName={data.localName}
        data={data}
      />
    </div>
  );
}
