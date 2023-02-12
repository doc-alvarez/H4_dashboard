import { json, redirect } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import {
  apiLogin,
  getAPIData,
  middleWareDanielLacroze,
  middleWareDanielSiria,
} from "~/utils/session.server"
import SalesPlace from "~/components/SalesPlace"
import {
  Form,
  useLoaderData,
  useLocation,
  useTransition,
} from "@remix-run/react"
import React from "react"
import md5 from "md5"
import { RingLoader } from "react-spinners"

interface Locale_Data {
  to: string
  from: string
  localName: string
  len: number
  salesTotal: number
  cashTotal: number
}

export const loader: LoaderFunction = async ({ params, request }) => {
  console.log("Server Loader called")
  const url = new URL(request.url)
  const from = url.searchParams.get("from") || new Date().toLocaleDateString()
  const to = url.searchParams.get("to") || new Date().toLocaleDateString()
  console.log(from, to)
  let historic = url.searchParams.get("historic")
  let paging = Math.ceil(Number(historic) / 500) || 2
  let data
  let siria_token
  let lac_token
  let dl_token
  let ds_token

  switch (params.local) {
    //***************************************** */
    //DANIEL-LACROZE
    //***************************************** */
    case "daniel-lacroze":
      dl_token = await apiLogin(
        process.env.DANIEL_LACROZE_EMAIL as string,
        process.env.DANIEL_LACROZE_PASS as string
      )
      data = await getAPIData({
        email: process.env.DANIEL_LACROZE_EMAIL as string,
        token: dl_token,
        from,
        to,
      })
      let daniel_lacroze_result: Locale_Data = {
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
              return order.total
            } else {
              return null
            }
          })
          ?.reduce((acc: any, val: any) => (val ? acc + val : acc), 0),
      }
      console.log("LACROZE")
      return json(daniel_lacroze_result, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(daniel_lacroze_result)),
        },
      })
    //***************************************** */
    //DANIEL-SIRIA
    //***************************************** */
    case "daniel-siria":
      ds_token = await apiLogin(
        process.env.DANIEL_SIRIA_EMAIL as string,
        process.env.DANIEL_SIRIA_PASS as string
      )
      data = await getAPIData({
        email: process.env.DANIEL_SIRIA_EMAIL as string,
        token: ds_token,
        from,
        to,
      })
      let daniel_siria_result: Locale_Data = {
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
              return order.total
            } else {
              return null
            }
          })
          ?.reduce((acc: any, val: any) => (val ? acc + val : acc), 0),
      }
      console.log("LACROZE")
      return json(daniel_siria_result, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(daniel_siria_result)),
        },
      })
    //***************************************** */
    //SUBWAY-SIRIA
    //***************************************** */
    case "subway-siria":
      siria_token = await apiLogin(
        process.env.SIRIA_EMAIL as string,
        process.env.SIRIA_PASS as string
      )
      data = await getAPIData({
        email: process.env.SIRIA_EMAIL as string,
        token: siria_token,
        from,
        to,
      })
      let subwaySiriaResult: Locale_Data = {
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
              return order.total
            } else {
              return null
            }
          })
          ?.reduce((acc: any, val: any) => (val ? acc + val : acc), 0),
      }
      console.log("SUBWAY-SIRIA")
      return json(subwaySiriaResult, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(subwaySiriaResult)),
        },
      })
    //***************************************** */
    //SUBWAY-LACROZE
    //***************************************** */
    case "subway-lacroze":
      lac_token = await apiLogin(
        process.env.LACROZE_EMAIL as string,
        process.env.LACROZE_PASS as string
      )
      data = await getAPIData({
        email: process.env.LACROZE_EMAIL as string,
        token: lac_token,
        from,
        to,
      })
      let subwayLacrozeResult: Locale_Data = {
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
              return order.total
            } else {
              return null
            }
          })
          ?.reduce((acc: any, val: any) => (val ? acc + val : acc), 0),
      }
      console.log("LACROZE")
      return json(subwayLacrozeResult, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(subwayLacrozeResult)),
        },
      })
    //***************************************** */
    //ALL
    //***************************************** */
    case "all-stores":
      ;[lac_token, siria_token, dl_token, ds_token] = await Promise.all([
        apiLogin(
          process.env.LACROZE_EMAIL as string,
          process.env.LACROZE_PASS as string
        ),
        apiLogin(
          process.env.SIRIA_EMAIL as string,
          process.env.SIRIA_PASS as string
        ),
        apiLogin(
          process.env.DANIEL_LACROZE_EMAIL as string,
          process.env.DANIEL_LACROZE_PASS as string
        ),
        apiLogin(
          process.env.DANIEL_SIRIA_EMAIL as string,
          process.env.DANIEL_SIRIA_PASS as string
        ),
      ])
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
          getAPIData({
            email: process.env.DANIEL_LACROZE_EMAIL as string,
            token: dl_token,
            from,
            to,
          }),
          getAPIData({
            email: process.env.DANIEL_SIRIA_EMAIL as string,
            token: ds_token,
            from,
            to,
          }),
        ])
      ).flat()
      // const data2 = (
      //   await Promise.all([
      //     middleWareDanielSiria(from, to, params, paging),
      //     middleWareDanielLacroze(from, to, params, paging),
      //   ])
      // ).flat()
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
              return order.total
            } else {
              return null
            }
          })
          ?.reduce((acc: any, val: any) => (val ? acc + val : acc), 0),
      }
      let integratedResult = [result].reduce((acc, val) => ({
        from: val.from,
        to: val.to,
        localName: val.localName,
        len: acc.len + val.len,
        salesTotal: acc.salesTotal + val.salesTotal,
        cashTotal: acc.cashTotal + val.cashTotal,
      }))
      console.log("ALL STORES")
      return json(integratedResult, {
        headers: {
          "cache-Control": "max-age=600, must-revalidate",
          eTag: md5(JSON.stringify(result)),
        },
      })

    default:
      return redirect("/admin/all-stores")
  }
}

export default function LocalSpecific() {
  const data = useLoaderData() as Locale_Data
  const [dateFrom, setFromDate] = React.useState(data.from)
  const [dateTo, setToDate] = React.useState(data.to)
  let loc = useLocation()
  let transition = useTransition()
  console.log(dateFrom, dateTo)
  React.useEffect(() => {
    if (!loc.search) {
      setFromDate(data.from)
      setToDate(data.to)
    }
  }, [data.from, data.to, loc])

  return (
    <div>
      <hr></hr>
      <Form method='get'>
        <div id='container_form'>
          <label htmlFor='from'></label>
          <input
            value={new Date(dateFrom).toISOString().slice(0, 10)}
            onChange={(event) => setFromDate(event?.currentTarget.value)}
            name='from'
            id='from'
            type='date'
          />
          <label htmlFor='to'></label>
          <input
            value={new Date(dateTo).toISOString().slice(0, 10)}
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
        </div>
        {/* <div style={{ width: "150px", marginTop: "20px" }}>
          <label htmlFor='records'></label>
          <input
            placeholder='Historic Orders...'
            type='text'
            id='records'
            name='historic'
          />
        </div> */}
      </Form>
      <SalesPlace
        isLoading={transition.state !== "idle"}
        localName={data.localName}
        data={data}
      />
    </div>
  )
}
