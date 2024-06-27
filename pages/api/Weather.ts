"use server";

const API_URL =
  "https://api.openweathermap.org/data/3.0/onecall?lat=33.4936&lon=-111.9167&units=imperial&appid=f79df586960e6ddbb36be5b6b2d57b5d";

import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const res1 = await fetch(API_URL, { next: { revalidate: 3600 } });
    res.status(200).json({ message: await res1.json() });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
