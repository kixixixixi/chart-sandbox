"use client"

import dynamic from "next/dynamic"

import { type ApexOptions } from "apexcharts"
import { type NextPage } from "next"
import { type FormEvent, useState, useEffect } from "react"
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
})

const colors = ["#ff0", "#0ff"] as const

const Page: NextPage = () => {
  const [dataText, setDataText] = useState<string>("")
  const [dataError, setDataError] = useState<string>()
  const [data, setData] = useState<
    {
      name: string
      group: string
      data: {
        x: number
        y: number
        fillColor: string
      }[]
    }[]
  >()
  useEffect(() => {
    setDataError(undefined)
    if (dataText.length < 4) return
    try {
      const data: {
        embedding: undefined
        projected: number[]
        text: string
        name: string
      }[] = JSON.parse(dataText)
      const series = [...new Set(data.map((d) => d.name))]
      setData(
        series.map((s, i) => ({
          name: s,
          group: s,
          data: data
            .filter((d) => d.name == s)
            .map((d) => ({
              x: d.projected[0],
              y: d.projected[1],
              fillColor: colors[i % colors.length],
            })),
        }))
      )
    } catch (e) {
      setDataError(`${e}`)
    }
  }, [dataText])
  const options: ApexOptions = {}
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  return (
    <>
      <section>
        <h2>Data</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <input
              type="file"
              accept=".json"
              onChange={({ target: { files } }) => {
                if (!files || files?.length === 0) return
                const file = files[0]
                const reader = new FileReader()
                reader.addEventListener("load", () => {
                  setDataText(
                    typeof reader.result === "string" ? reader.result : ""
                  )
                })
                reader.readAsText(file, "UTF-8")
              }}
            />
            <br />
            <textarea
              value={dataText}
              onChange={({ target: { value } }) => setDataText(value)}
            />
            {dataError && <p style={{ color: "red" }}>{dataError}</p>}
          </fieldset>

          <button>Set</button>
        </form>
      </section>
      {data && (
        <section>
          <Chart
            type="scatter"
            options={options}
            series={data}
            width={"100%"}
            height={400}
          />
        </section>
      )}
    </>
  )
}

export default Page
